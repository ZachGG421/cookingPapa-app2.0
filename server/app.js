require('dotenv').config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const cacheService = require("./cache/cacheService");
const userRoutes = require("./routes/userRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const Recipe = require("./models/Recipe");

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


app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api", recipeRoutes);

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

    try {
      // Check MongoDB before calling Spoonacular API
      const recipe = await Recipe.findOne({ apiId: recipeID });
      if (recipe) {
        console.log(" MongoDB hit for recipe ID:", recipeID);
        cacheService.set(recipeID, recipe); // Store in cache
        return res.json(recipe);
      }
    } catch (error) {
      console.error(" Error fetching recipe from MongoDB:", error);
    }

    // If cache miss, fetch from API
    const url = `https://api.spoonacular.com/recipes/${recipeID}/information?apiKey=${apiKey}`;

    try {
      const apiResponse = await fetch(url);
      if (!apiResponse.ok) throw new Error(`Spoonacular API error: ${apiResponse.statusText}`);

      const data = await apiResponse.json();

      // Cache data
      cacheService.set(recipeID, data);

      res.json(data);
    } catch (error) {
      console.error("Error fetching recipe details: ", error);
      res.status(500).send("Server error while fetching recipe details");
    }
  });

  app.listen(port, () => console.log(`Listening on port ${port}`));
})

