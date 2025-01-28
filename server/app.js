require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cacheService = require("./cache/cacheService");
const userRoutes = require("./routes/userRoutes");
const recipeRoutes = require("./routes/recipeRoutes");

const app = express();
const port = process.env.PORT || 4000;
const apiKey = process.env.API_KEY;

//console.log("API Key:", process.env.API_KEY);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Check connection status 
/*
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});


mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});
*/ 



app.use(express.json());

let fetch;
import('node-fetch').then(({default: nodeFetch}) => {
  fetch = nodeFetch;

  //Search recipes by ingredients 
  app.get("/search-recipes", async (req, res) => {
    const ingredients = req.query.ingredients;

    // Check cache
    if (cacheService.has(ingredients)) {
      console.log("Cache hit");
      return res.json(cacheService.get(ingredients));
    }

    // If cache miss, fetch from API
    const url = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${apiKey}&ingredients=${ingredients}&number=12`;

    try {
      const apiResponse = await fetch(url);
      const data = await apiResponse.json();

      //Cache data
      cacheService.set(ingredients, data);

      res.json(data);
    } catch (error) {
      console.error("Error fetching recipes: ", error);
      res.status(500).send("Server error while fetching recipes");

    }
  });

  //Fetch recipes by recipe ID
  app.get("/recipe/:id", async (req,res) => {
    const recipeID = req.params.id;

    // Check cache
    if (cacheService.has(recipeID)) {
      console.log("Cache hit");
      return res.json(cacheService.get(recipeID));
    }

    // If cache miss, fetch from API
    const url = `https://api.spoonacular.com/recipes/${recipeID}/information?apiKey=${apiKey}`;

    try {
      const apiResponse = await fetch(url);
      const data = await apiResponse.json();

      // Cache data
      cacheService.set(recipeID, data);

      res.json(data);
    } catch (error) {
      console.error("Error fetching recipe details: ", error);
      res.status(500).send("Server error while fetching recipe details");
    }
  });

  // Use routes
  app.use("/api/users", userRoutes);
  app.use("/api/recipes", recipeRoutes);

  app.listen(port, () => console.log(`Listening on port ${port}`));
})

