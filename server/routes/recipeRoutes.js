const express = require('express');
const Recipe = require('../models/Recipe');
const Ingredient = require('../models/Ingredient')
const User = require('../models/User');
const cacheService = require('../cache/cacheService');
const router = express.Router();

let fetch;
import('node-fetch').then(({ default: nodeFetch }) => {
    fetch = nodeFetch

    // Search for recipes through Cache - MongoDB - API
    router.get('/search', async (req, res) => {
        const { query } = req.query;
    
        // Check cache
        if (cacheService.has(query)) {
            console.log(`Cache hit for query: ${query}`);
            return res.json(cacheService.get(query));
        }
        console.log(`Cache miss for query: ${query}`);

        // Check MongoDB
        try {
            const dbRecipes = await Recipe.find({ title: new RegExp(query, 'i') });
            //console.log('Recipes found in MongoDB:', dbRecipes);
            if (dbRecipes.length > 0) {
                console.log(`MongoDB hit for query: ${query}`);
                cacheService.set(query, dbRecipes);
                return res.json(dbRecipes);
            }
            console.log(`MongoDB miss for query: ${query}`);
        } catch (error) {
            console.log('Error querying MongoDB:', error);
        }
    
        // Fetch from Spoonacular API
        try {
            const response = await fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${query}&apiKey=${process.env.API_KEY}`);
            const basicRecipes = await response.json();
            //console.log('Basic Recipes:', basicRecipes);

            // Fetch full details for each recipe
            const detailedRecipes = await Promise.all(
                basicRecipes.map(async (basicRecipe, index) => {
                    const detailedResponse = await fetch(`https://api.spoonacular.com/recipes/${basicRecipe.id}/information?apiKey=${process.env.API_KEY}`);
                    const detailedRecipe = await detailedResponse.json();

                    //Debugging
                    if (index === 0) {
                        console.log('First Detailed Recipe:', detailedRecipe);
                    }

                    return detailedRecipe;
                })
            );
            
            // Save recipes to MongoDB
            const savedRecipes = await Promise.all(
                detailedRecipes.map(async (recipe) => {
                    try {
                        const savedRecipe = await Recipe.findOneAndUpdate(
                            { apiId: recipe.id },
                            {
                                $set: {
                                    title: recipe.title,
                                    image: recipe.image,
                                    summary: recipe.summary || 'No summary available.',
                                    readyInMinutes: recipe.readyInMinutes,
                                    servings: recipe.servings,
                                    sourceUrl: recipe.sourceUrl,
                                    vegetarian: recipe.vegetarian,
                                    vegan: recipe.vegan,
                                    glutenFree: recipe.glutenFree,
                                    dairyFree: recipe.dairyFree,
                                    veryHealthy: recipe.veryHealthy,
                                    cheap: recipe.cheap,
                                    veryPopular: recipe.veryPopular,
                                    sustainable: recipe.sustainable,
                                    aggregateLikes: recipe.aggregateLikes,
                                    healthScore: recipe.healthScore,
                                    pricePerServing: recipe.pricePerServing,
                                    extendedIngredients: Array.isArray(recipe.extendedIngredients) ? recipe.extendedIngredients : [],
                                    instructions: recipe.instructions || 'No instructions provided.',
                                    dishTypes: recipe.dishTypes || [],
                                    cuisines: recipe.cuisines || [],
                                    diets: recipe.diets || [],
                                    createdBy: null,
                                    source: 'api',
                                },
                            },
                            { upsert: true, new: true }
                        );
                        return savedRecipe;
                    } catch (error) {
                        console.error(`Error saving recipe "${recipe.title}":`, error);
                        return null;
                    }
                })
            );
            

            const validRecipes = savedRecipes.filter((recipe) => recipe !== null);

            // Cache valid recipes
            cacheService.set(query, validRecipes);
            //console.log(`Cache populated for query: ${query}`);
    
            res.json(validRecipes);
        } catch (error) {
            console.error(`Error fetching data for query: ${query}`, error);
            res.status(500).json({ error: 'Failed to fetch recipes'});
        }
    });

    // Add a user-generated recipe to MongoDB
    router.post('/create', async (req, res) => {
        const {
            title,
            image,
            summary,
            readyInMinutes,
            servings,
            ingredients,
            instructions,
            userId,
        } = req.body;

        try {
            const savedIngredients = await Promise.all(
                ingredients.map(async (ingredient) => {
                    try {
                        const savedIngredient = await Ingredient.findOneAndUpdate(
                            { name: ingredient.name },
                            { $setOnInsert: { name: ingredient.name, recipes: [] } },
                            { upsert: true, new: true }
                        );
                        return savedIngredient._id;
                    } catch (error) {
                        console.error(`Error processing ingredient "${ingredient.name}":`, error.message);
                        return null;
                    }
                })
            );

            const validIngredients = savedIngredients.filter((id) => id !== null);

            // Create a new recipe
            const newRecipe = new Recipe({
                title,
                image,
                summary,
                readyInMinutes,
                servings,
                ingredients: savedIngredients,
                instructions,
                createdBy: userId,
                source: 'user',
            });

            const savedRecipe = await newRecipe.save();
            res.status(201).json({ message: 'Recipe created successfully', recipe: savedRecipe });
        } catch (error) {
            console.error('Error creating recipe:', error);
            res.status(500).json({ error: 'Failed to create recipe' });
        }
    });

    // Fetch saved recipes for a user
    router.get('/:userId/saved', async (req, res) => {
        const { userId } = req.params;

        try {
            const user = await User.findById(userId).populate('savedRecipes');
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user.savedRecipes);
        } catch (error) {
            console.error('Error fetching saved recipes:', error);
            res.status(500).json({ error: 'Failed to fetch saved recipes' });
        }
    });

    // Fetch liked recipes for a user
    router.get('/:userId/liked', async (req, res) => {
        const { userId } = req.params;

        try {
            const user = await User.findById(userId).populate('likedRecipes');
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user.likedRecipes);
        } catch (error) {
            console.error('Error fetching liked recipes:', error);
            res.status(500).json({ error: 'Failed to fetch liked recipes' });
        }
    });
});

module.exports = router;
