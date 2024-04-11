import './App.css';
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import DiscoverTool from './components/DiscoverTool';
import DiscoveryResults from './components/DiscoverResults.js'
import Footer from './components/Footer.js'


function App() {
  
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);

  const searchRecipes = async (ingredients) => {
    if (ingredients.length > 0 ) {
      const ingredientsQuery = ingredients.join(',');
      try {
        const response = await fetch(`/search-recipes?ingredients=${ingredientsQuery}`);
        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    }
  }
  return (
    <Router>
      <div className="App">
          <Navbar />
          <div className="mainContent">
            <DiscoverTool setIngredients={setIngredients} onSearch={searchRecipes} />
            <DiscoveryResults recipes={recipes} />
          </div>
          <Footer />
      </div>
    </Router>
  );
}

export default App;
