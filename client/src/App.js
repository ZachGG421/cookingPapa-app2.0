import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './components/Homepage/Homepage';

function App() {
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [recipeDetails, setRecipeDetails] = useState({});

  //function for searching recipes based on user input ingredients
  //sends GET request to backend for API interaction
  const searchRecipes = async (ingredients) => {
    if (ingredients.length > 0) {

      //converts array of ingredients into comma-separated string
      const ingredientsQuery = ingredients.join(',');

      try {
        
        //fetch recipes using ingredients query
        const response = await fetch(`/search-recipes?ingredients=${ingredientsQuery}`);
        const data = await response.json();

        //debug
        console.log(data);

        //updates recipe state with fetched recipes
        setRecipes(data);

      } catch (error) {
        //logs errors for troubleshooting
        console.error("Error fetching recipes:", error);
      }
    }
  };

  //function for getting recipe details by recipe ID
  const fetchRecipeDetails = async (id) => {
    //check if the recipe details already cached
    if (!recipeDetails[id]) {
      try {

        //fetch recipe details using id query
        const response = await fetch(`/recipe/${id}`);
        const data = await response.json();

        //updates recipeDetails state with fetched details
        setRecipeDetails((prevDetails) => ({
          ...prevDetails, //retain previous details
          [id]: data, // add or overwrite details for current recipe ID
        }));
      } catch (error) {
        //log errors for troubleshooting
        console.error("Error fetching recipe details:", error);
      }
    }
  };

  return (
    //wraps application in Router to enable navigation between pages
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <Homepage 
              setIngredients={setIngredients} 
              searchRecipes={searchRecipes} 
              recipes={recipes}
              fetchRecipeDetails={fetchRecipeDetails}
              recipeDetails={recipeDetails}

            />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;