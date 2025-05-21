import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import styles from "./RecipePage.module.css";

const formatDescription = (summary) => {
  return summary ? summary.replace(/<[^>]+>/g, "") : "No description available.";
};

const formatInstructions = (recipe) => {
  if (Array.isArray(recipe.analyzedInstructions) && recipe.analyzedInstructions.length > 0) {
    return recipe.analyzedInstructions[0].steps.map((step, index) => `${index + 1}. ${step.step}`);
  } else if (typeof recipe.instructions === "string") {
    return recipe.instructions.split(".").filter(step => step.trim().length > 0).map((step, index) => `${index + 1}. ${step.trim()}`);
  }
  return [];
};

const RecipePage = ({ fetchRecipeDetails, recipeDetails }) => {
  const { id } = useParams();
  const location = useLocation(); //Get passed recipe from DiscoverResults.js
  const [recipe, setRecipe] = useState(location.state?.recipe || recipeDetails?.[id] || null);
  const [loading, setLoading] = useState(!recipe);
  const [error, setError] = useState(null);

  // Save Recipe to MongoDB
  const saveRecipeToMongoDB = async (recipe) => {
    if (!recipe || !recipe.id) return;

    try {
      const response = await fetch("http://localhost:4000/api/recipes/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiId: recipe.id,
          title: recipe.title,
          image: recipe.image,
          summary: recipe.summary || "No summary available.",
          readyInMinutes: recipe.readyInMinutes || 0,
          servings: recipe.servings || 1,
          dishTypes: recipe.dishTypes || [],
          cuisines: recipe.cuisines || [],
          extendedIngredients: recipe.extendedIngredients || [],
          instructions: Array.isArray(recipe.instructions)
            ? recipe.instructions.join('. ')
            : recipe.instructions || "",
        }),
      });

      if (response.ok) {
        console.log(`Recipe ${recipe.id} saved to MongoDB`);
      } else {
        console.error(`Failed to save Recipe ${recipe.id} to MongoDB`);
      }
    } catch (error) {
      console.error(`Error saving Recipe ${recipe.id} to MongoDB:`, error);
    }
  };

  useEffect(() => {
    if (recipe) return;

    const fetchRecipe = async () => {
      setLoading(true);
      setError(null); // Reset error before fetching

      try {
        // Check Cache First
        const cacheResponse = await fetch(`http://localhost:4000/api/cache/${id}`);
        if (cacheResponse.ok) {
          const cachedRecipe = await cacheResponse.json();
          console.log(`Cache hit for Recipe ${id}`);
          setRecipe(cachedRecipe);
          await saveRecipeToMongoDB(cachedRecipe); // Save to DB
          setLoading(false);
          return;
        }

        // Check MongoDB
        const dbResponse = await fetch(`http://localhost:4000/api/recipes/byApiId/${id}`);
        if (dbResponse.ok) {
          const dbRecipe = await dbResponse.json();
          console.log(`MongoDB hit for Recipe ${id}`);
          setRecipe(dbRecipe);
          await saveRecipeToMongoDB(dbRecipe); // Save to DB
          setLoading(false);
          return;
        }

        // Fetch from Spoonacular API
        console.log(`Fetching Recipe ${id} from Spoonacular API...`);
        const apiResponse = await fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${process.env.REACT_APP_API_KEY}`);
        if (!apiResponse.ok) throw new Error(`API request failed for Recipe ${id}`);

        const apiRecipe = await apiResponse.json();
        console.log(`Fetched Recipe ${id} from API`);
        setRecipe(apiRecipe);
        await saveRecipeToMongoDB(apiRecipe); // Save to DB

      } catch (error) {
        console.error("Error fetching Recipe:", error);
        setError("Failed to load recipe. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (!recipe) {
      fetchRecipe();
    }
  }, [id]);

  if (loading) return <p>Loading recipe details...</p>;
  if (error) return <p className={styles.errorMessage}>{error}</p>;
  if (!recipe) return <p>Recipe not found.</p>;

  return (
    <>
      <Navbar />
      <div className={styles.recipePageContainer}>
        <div className={styles.recipeCard}>
          <div className={styles.recipeHeader}>
            <img src={recipe.image} alt={recipe.title} className={styles.recipeImage} />
            <div className={styles.recipeContent}>
              <h1 className={styles.recipeTitle}>{recipe.title}</h1>
              <p className={styles.recipeDescription}>{formatDescription(recipe.summary)}</p>
              <div className={styles.recipeStats}>
                <p><strong>Time to Make:</strong> {recipe.readyInMinutes ? `${recipe.readyInMinutes} mins` : "N/A"}</p>
                <p><strong>Servings:</strong> {recipe.servings || "N/A"}</p>
              </div>
            </div>
          </div>
          <div className={styles.ingredientsContainer}>
            <h3>Ingredients:</h3>
            <ul className={styles.ingredientsList}>
              {recipe.extendedIngredients?.map((ingredient, index) => (
                <li key={index}>{ingredient.original}</li>
              ))}
            </ul>
          </div>
          <div className={styles.instructionsContainer}>
            <h3>Instructions:</h3>
            <ol className={styles.instructionsList}>
              {formatInstructions(recipe).map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RecipePage;
