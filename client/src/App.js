import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './components/Homepage/Homepage';

function App() {
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);

  const searchRecipes = async (ingredients) => {
    if (ingredients.length > 0) {
      const ingredientsQuery = ingredients.join(',');
      try {
        const response = await fetch(`/search-recipes?ingredients=${ingredientsQuery}`);
        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
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
            />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;