import React, { useEffect, useState } from 'react';
import RecipePreviewModal from '../../RecipePreviewModal/RecipePreviewModal';
import styles from './DiscoverResults.module.css';

// Format description (removes HTML tags)
const formatDescription = (summary) => {
    return summary ? summary.replace(/<[^>]+>/g, '') : "No description available.";
};

// Format ingredients into a readable string
const formatIngredients = (ingredients, label) => {
    return ingredients?.length > 0
        ? `${label}: ${ingredients.map((ingredient) => ingredient.name).join(', ')}` 
        : `No ${label.toLowerCase()}`;
};

const DiscoverResults = ({ recipes, fetchRecipeDetails, recipeDetails }) => {
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleRecipeClick = (recipe) => {
        setSelectedRecipe(recipe);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedRecipe(null);
    };

    const viewFullRecipe = () => {
        window.location.href = `/recipes/${selectedRecipe.id}`;
    };

    const saveRecipe = async (recipe) => {
        try {
            if (!recipe || typeof recipe !== 'object' || !recipe.id) {
                console.warn(`Invalid recipe data. Skipping save for ID: ${recipe?.id}`);
                return;
            }

            const recipeToSave = {
                apiId: recipe.apiId || recipe.id,
                title: recipe.title,
                image: recipe.image,
                summary: recipe.summary || "No summary available",
                readyInMinutes: recipe.readyInMinutes || 0,
                servings: recipe.servings || 1,
                dishTypes: recipe.dishTypes || [],
                cuisines: recipe.cuisines || [],
                extendedIngredients: recipe.extendedIngredients || [],
                instructions: Array.isArray(recipe.instructions)
                    ? recipe.instructions.join(". ")
                    : recipe.instructions || "",
            };

            console.log(`Saving Recipe ${recipeToSave.apiId} to MongoDB...`);
            const response = await fetch(`http://localhost:4000/api/recipes/save`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(recipeToSave),
            });

            const data = await response.json();
            console.log(`Save Response for Recipe ${recipeToSave.apiId}:`, data);

            if (data.error) {
                console.error(`Backend rejected Recipe ${recipeToSave.apiId}:`, data.error);
            }
        } catch (error) {
            console.error(`Error saving recipe ${recipe?.id}:`, error);
        }
    };

    useEffect(() => {
        if (!recipes.length) {
            console.log("No recipes found. Skipping Fetch.");
            return;
        }

        const missingDetails = recipes
            .filter((recipe) => !recipeDetails?.[recipe.id])
            .map((recipe) => recipe.id);

        if (!missingDetails.length) {
            console.log("All recipes have details. No API call needed.");
            return;
        }

        console.log(`Fetching details for ${missingDetails.length} recipes: `, missingDetails);

        const timer = setTimeout(() => {
            missingDetails.forEach(async (id) => {
                try {
                    if (recipeDetails[id]) {
                        console.log(`Recipe ${id} already in state. Skipping fetch.`);
                        return;
                    }

                    console.log(`Calling fetchRecipeDetails for Recipe ID: ${id}`);
                    const recipe = await fetchRecipeDetails(id);

                    if (!recipe || typeof recipe !== 'object' || !recipe.id) {
                        console.warn(`Skipping save, invalid recipe for ID ${id}`);
                        return;
                    }

                    await saveRecipe(recipe);
                } catch (error) {
                    console.error(`Error fetching details for recipe ID: ${id}`, error);
                }
            });
        }, 300); // Debounce time

        console.log("Cleaning up fetchRecipeDetails calls.");
        return () => clearTimeout(timer);
    }, [recipes, recipeDetails]);

    return (
        <div className={styles.resultsGrid}>
            {recipes.map((recipe) => {
                const details = recipeDetails?.[recipe.id] || {};
                const shortDescription = details?.summary
                    ? formatDescription(details.summary)
                    : "Description loading...";

                const usedIngredients = formatIngredients(recipe.usedIngredients, 'Used Ingredients');
                const unusedIngredients = formatIngredients(recipe.unusedIngredients, 'Unused Ingredients');

                return (
                    <div 
                        key={recipe.id} 
                        className={styles.recipeCard}
                        onClick={() => handleRecipeClick(recipe)}
                    >
                        <img src={recipe.image} alt={recipe.title} className={styles.recipeImage} />
                        <p className={styles.recipeTitle}>{recipe.title}</p>
                        <p className={styles.recipeDescription}>{shortDescription}</p>
                        <p className={styles.recipeUsedIngre}>{usedIngredients}</p>
                        <p className={styles.recipeUnusedIngre}>{unusedIngredients}</p>

                        <div className={styles.recipeActions}>
                            <button className={styles.likeButton}>Like</button>
                            <button className={styles.saveButton}>Save</button>
                        </div>
                    </div>
                );
            })}

            {isModalOpen && 
                <RecipePreviewModal
                recipe={selectedRecipe}
                onClose={closeModal}
                onViewRecipe={viewFullRecipe}
            />}
        </div>
    );
};

export default DiscoverResults;
