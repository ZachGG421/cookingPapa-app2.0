import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './components/Homepage/Homepage';
import RecipePage from "./components/RecipePage/RecipePage";
import RecipesPage from './components/RecipesPage/RecipesPage';
import AboutUsPage from "./components/AboutUsPage/AboutUsPage";
import ContactPage from "./components/ContactPage/ContactPage";
import ProfilePage from "./components/ProfilePage/ProfilePage";
import LoginPage from "./components/LoginPage/LoginPage";
import RegisterPage from "./components/RegisterPage/RegisterPage";

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
    if (!recipeDetails[id]) {
        try {
            const response = await fetch(`/recipe/${id}`);
            const data = await response.json();

            setRecipeDetails((prevDetails) => ({
                ...prevDetails,
                [id]: data,
            }));

            return data;
        } catch (error) {
            console.error("Error fetching recipe details:", error);
            return null;
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
        <Route path="/recipes/:id" element={<RecipePage fetchRecipeDetails={fetchRecipeDetails} recipeDetails={recipeDetails} />} />
        <Route path="/recipes" element={<RecipesPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;