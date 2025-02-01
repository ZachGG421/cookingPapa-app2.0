const express = require('express');
const Recipe = require('../models/Recipe');
const Ingredient = require('../models/Ingredient');
const User = require('../models/User');
const cacheService = require('../cache/cacheService');
const router = express.Router();
const fetch = (...args) => import('node-fetch').then(({ default: nodeFetch }) => nodeFetch(...args));

router.post('/cache/:id', async (req, res) => {
    const { id } = req.params;
    const recipeData = req.body;

    if (!recipeData || Object.keys(recipeData).length === 0) {
        console.log(`POST /cache/${id} failed: No recipe data provided`);
        return res.status(400).json({ error: 'No recipe data provided' });
    }

    try {
        cacheService.set(id, recipeData);

        // Verify cache storage immediately
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

// GET: Fetch recipe by API ID (Cache → MongoDB → External API)
router.get('/byApiId/:apiId', async (req, res) => {
    const { apiId } = req.params;

    if (cacheService.has(apiId)) {
        return res.json(cacheService.get(apiId));
    }

    try {
        const recipe = await Recipe.findOne({ apiId });
        if (recipe) {
            cacheService.set(apiId, recipe);
            return res.json(recipe);
        }
    } catch (error) {
        console.error('Error fetching recipe from MongoDB:', error);
    }

    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/${apiId}/information?apiKey=${process.env.API_KEY}`);
        if (!response.ok) throw new Error(`Spoonacular API error: ${response.statusText}`);

        const apiRecipe = await response.json();
        const savedRecipe = await Recipe.findOneAndUpdate(
            { apiId: apiRecipe.id },
            { $set: apiRecipe },
            { upsert: true, new: true }
        );

        if (savedRecipe) {
            cacheService.set(apiId, savedRecipe);
            return res.json(savedRecipe);
        }
    } catch (error) {
        console.error('Error fetching from Spoonacular API:', error);
        return res.status(500).json({ error: 'Failed to fetch recipe' });
    }
});

// POST: Save recipe in MongoDB
router.post('/save', async (req, res) => {
    try {
        const recipe = await Recipe.findOneAndUpdate(
            { apiId: req.body.id },
            { $set: req.body },
            { upsert: true, new: true }
        );
        return res.status(201).json({ message: 'Recipe saved successfully', recipe });
    } catch (error) {
        console.error('Error saving recipe:', error);
        return res.status(500).json({ error: 'Failed to save recipe' });
    }
});

module.exports = router;
