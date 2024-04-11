require('dotenv').config();
console.log("API Key:", process.env.API_KEY);
const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
const apiKey = process.env.API_KEY;

app.use(express.json());

let fetch;
import('node-fetch').then(({default: nodeFetch}) => {
  fetch = nodeFetch;
  app.get("/search-recipes", async (req, res) => {
    const ingredients = req.query.ingredients;
    const url = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${apiKey}&ingredients=${ingredients}&number=12`;

    try {
      const apiResponse = await fetch(url);
      const data = await apiResponse.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching recipes: ", error);
      res.status(500).send("Server error while fetching recipes");

    }
  });

  app.listen(port, () => console.log(`Listening on port ${port}`));
})

