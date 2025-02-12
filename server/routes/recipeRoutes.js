const express = require('express');
const Recipe = require('../models/Recipe');
const Ingredient = require('../models/Ingredient');
const User = require('../models/User');
const cacheService = require('../cache/cacheService');
const router = express.Router();
const fetch = (...args) => import('node-fetch').then(({ default: nodeFetch }) => nodeFetch(...args));

// POST: Save recipe in Cache 
router.post('/cache/:id', async (req, res) => {
    const { id } = req.params;
    const recipeData = req.body;

    if (!recipeData || Object.keys(recipeData).length === 0) {
        console.log(`POST /cache/${id} failed: No recipe data provided`);
        return res.status(400).json({ error: 'No recipe data provided' });
    }

    try {
        cacheService.set(id, recipeData);

        // Verify cache storage
        const cachedRecipe = cacheService.get(id);
        console.log(`Recipe ${id} successfully stored in cache:`, cachedRecipe);

        return res.status(201).json({
            message: `Recipe ${id} cached successfully`,
            cachedRecipe: cachedRecipe,
        });
    } catch (error) {
        console.error("Error caching recipe:", error);
        return res.status(500).json({ error: 'Error caching recipe' });
    }
});

// POST: Save recipe in MongoDB
router.post('/save', async (req, res) => {
    try {
        const recipeData = req.body;
        if (!recipeData.apiId) {
            return res.status(400).json({ error: 'Missing apiId field' });
        }

        const savedRecipe = await Recipe.findOneAndUpdate(
            { apiId: recipeData.apiId },
            { $set: recipeData },
            { upsert: true, new: true }
        );

        console.log(`Successfully saved Recipe ${savedRecipe.apiId} to MongoDB`);
        return res.status(201).json({ message: 'Recipe saved successfully', savedRecipe });
    } catch (error) {
        console.error('Error saving recipe:', error);
        return res.status(500).json({ error: 'Failed to save recipe' });
    }
});


// GET: Fetch recipe from cache or MongoDB
router.get('/cache/:id', async (req, res) => {
    const { id } = req.params;

    // Check if recipe is in cache
    if (cacheService.has(id)) {
        console.log(`Cache hit for recipe ID: ${id}`);
        return res.json(cacheService.get(id)); // Send cached response
    }

    console.log(`Cache miss for recipe ID: ${id}, checking MongoDB...`);

    try {
        // If cache is empty, check MongoDB
        const recipe = await Recipe.findOne({ apiId: id });
        if (recipe) {
            console.log(`MongoDB hit for recipe ID: ${id}, caching result...`);
            cacheService.set(id, recipe); // Store in cache
            return res.json(recipe);
        }
    } catch (error) {
        console.error("Error fetching from MongoDB:", error);
        return res.status(500).json({ error: 'Error checking database for recipe' });
    }

    console.log(`Recipe ${id} not found in cache or database.`);
    return res.status(404).json({ message: 'Recipe not found in cache or database' });
});

// GET: Fetch recipe by API ID (Cache - MongoDB - API)
router.get('/byApiId/:apiId', async (req, res) => {
    const { apiId } = req.params;

    // Check Cache First
    if (cacheService.has(apiId)) {
        console.log(`Cache hit for Recipe ID: ${apiId}`);
        return res.json(cacheService.get(apiId));
    }

    // Check MongoDB
    try {
        const recipe = await Recipe.findOne({ apiId });
        if (recipe) {
            console.log(`MongoDB hit for Recipe ID: ${apiId}`);
            cacheService.set(apiId, recipe); // Store in cache
            return res.json(recipe);
        }
    } catch (error) {
        console.error('Error fetching recipe from MongoDB:', error);
    }

    // Fetch from Spoonacular API if not found
    try {
        console.log(`Fetching Recipe ${apiId} from Spoonacular API...`);
        const response = await fetch(`https://api.spoonacular.com/recipes/${apiId}/information?apiKey=${process.env.API_KEY}`);
        if (!response.ok) throw new Error(`Spoonacular API error: ${response.statusText}`);

        const apiRecipe = await response.json();

        // Save the fetched recipe to MongoDB
        console.log(`Saving Recipe ${apiRecipe.id} to MongoDB...`);
        const savedRecipe = await Recipe.findOneAndUpdate(
            { apiId: apiRecipe.id },  // Query by apiId
            {
                apiId: apiRecipe.id,
                title: apiRecipe.title,
                image: apiRecipe.image,
                summary: apiRecipe.summary || "No summary available.",
                readyInMinutes: apiRecipe.readyInMinutes || 0,
                servings: apiRecipe.servings || 1,
                dishTypes: apiRecipe.dishTypes || [],
                cuisines: apiRecipe.cuisines || [],
                extendedIngredients: apiRecipe.extendedIngredients || [],
                instructions: Array.isArray(apiRecipe.instructions)
                    ? apiRecipe.instructions.join('. ')
                    : apiRecipe.instructions || "",
            },
            { upsert: true, new: true }
        );

        if (savedRecipe) {
            console.log(`Successfully saved Recipe ${savedRecipe.apiId} to MongoDB`);
            cacheService.set(apiId, savedRecipe); // Store in cache
            return res.json(savedRecipe);
        } else {
            throw new Error(`Failed to save Recipe ${apiId} to MongoDB`);
        }
    } catch (error) {
        console.error('Error fetching from Spoonacular API:', error);
        return res.status(500).json({ error: 'Failed to fetch recipe' });
    }
});




module.exports = router;
