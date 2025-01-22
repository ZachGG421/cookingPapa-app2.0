import React from 'react';
import Navbar from '../Navbar/Navbar';
import DiscoverTool from './DiscoverTool/DiscoverTool';
import DiscoverResults from './DiscoverResults/DiscoverResults';
import Footer from '../Footer/Footer';

const Homepage = ({ setIngredients, searchRecipes, recipes, fetchRecipeDetails, recipeDetails }) => {
  return (
    <div>
      <Navbar />
      <DiscoverTool setIngredients={setIngredients} onSearch={searchRecipes} />
      <DiscoverResults 
      recipes={recipes} 
      fetchRecipeDetails={fetchRecipeDetails} 
      recipeDetails={recipeDetails} />
      <Footer />
    </div>
  );
};

export default Homepage;