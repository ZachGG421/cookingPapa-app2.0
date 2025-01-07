import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './components/Homepage/Homepage';

function App() {
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [recipeDetails, setRecipeDetails] = useState({});

  const searchRecipes = async (ingredients) => {
    if (ingredients.length > 0) {
      const ingredientsQuery = ingredients.join(',');
      try {
        const response = await fetch(`/search-recipes?ingredients=${ingredientsQuery}`);
        const data = await response.json();

        console.log(data);
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    }
  };

  const fetchRecipeDetails = async (id) => {
    // Check if we already have the details for this recipe to avoid repeated fetches
    if (!recipeDetails[id]) {
      try {
        const response = await fetch(`/recipe/${id}`);
        const data = await response.json();
        setRecipeDetails((prevDetails) => ({
          ...prevDetails,
          [id]: data, // Store the details in a dictionary with the recipe ID as the key
        }));
      } catch (error) {
        console.error("Error fetching recipe details:", error);
      }
    }
  };

  return (
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