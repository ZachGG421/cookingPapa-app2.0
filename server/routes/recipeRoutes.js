const express = require('express');
const Recipe = require('../models/Recipe');
const cacheService = require('../cache/cacheService');
const router = express.Router();

let fetch;
import('node-fetch').then(({ default: nodeFetch }) => {
    fetch = nodeFetch

    router.get('/search', async (req, res) => {
        const { query } = req.query;
    
        // Check cache
        if (cacheService.has(query)) {
            console.log(`Cache hit for query: ${query}`);
            return res.json(cacheService.get(query));
        }
        console.log(`Cache miss for query: ${query}`);
    
        //fallback: Spoonacular API
        try {
            const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=${process.env.API_KEY}`);
            const data = await response.json();
    
            //cache response
            cacheService.set(query, data);
            console.log(`Cache populated for query: ${query}`);
    
            res.json(data);
        } catch (error) {
            console.error(`Error fetching data for query: ${query}`, error);
            res.status(500).json({ error: 'Failed to fetch recipes'});
        }
    
    });
});



module.exports = router;
