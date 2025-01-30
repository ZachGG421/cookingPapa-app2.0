import React, { useEffect, useState } from 'react';
import RecipePreviewModal from '../../RecipePreviewModal/RecipePreviewModal';
import styles from './DiscoverResults.module.css';


const formatDescription = (summary) => {
    // Remove HTML tags
    const plainText = summary.replace(/<[^>]+>/g, '');

    // Limit description to 100 characters and add ellipsis
    return plainText.length > 200 
        ? plainText.slice(0, 300) + '...'
        : plainText;
};

// Utility function to format ingredients
const formatIngredients = (ingredients, label) => {
    return ingredients && ingredients.length > 0
        ? `${label}: ${ingredients.map((ingredient) => ingredient.name).join(', ')}`
        : `No ${label.toLowerCase()}`;
};

const DiscoverResults = ({ recipes, fetchRecipeDetails, recipeDetails }) => {
        //console.log('Recipes:', recipes, 'Type:', typeof recipes);

        const [selectedRecipe, setSelectedRecipe] = useState(null);
        const [isModalOpen, setIsModalOpen] = useState(false);

        const handleRecipeClick = (recipe) => {
            setSelectedRecipe(recipe);
            setIsModalOpen(true);
            console.log('Selected Recipe:', recipe);
        }

        const closeModal = () => {
            setIsModalOpen(false);
            setSelectedRecipe(null);
        }

        const viewFullRecipe = () => {
            window.location.href = `/recipes/${selectedRecipe.id}`;
        };

        useEffect(() => {
            if (!recipes.length) {
                console.log("No recipes found. Skipping Fetch.")
                return;
            } 
    
            const missingDetails = recipes
                .filter((recipe) => !recipeDetails?.[recipe.id])
                .map((recipe) => recipe.id);
    
            if (!missingDetails.length) {
                console.log("All recipes have details. No API call needed.")
                return; // Exit early if no missing details
            }

            console.log(`Fetching details for ${missingDetails.length} recipes: `, missingDetails);
    
            const timer = setTimeout(() => {
                missingDetails.forEach((id) => {
                    try {
                        console.log(`Calling fetchRecipeDetails for Recipe ID: ${id}`);
                        fetchRecipeDetails(id);
                    } catch (error) {
                        console.error(`Error fetching details for recipe ID: ${id}`, error);
                    }
                });
            }, 300); // Debounce time
            console.log("Cleaning up fetchRecipeDetails calls.");
            return () => clearTimeout(timer); // Cleanup on unmount
        }, [recipes]);

        // Function to handle "like" button click
            const handleLikeClick = (event, recipeId) => {
            event.stopPropagation();
            // Logic for liking the recipe
            console.log(`Liked recipe with ID: ${recipeId}`);
        };

        // Function to handle "save" button click
        const handleSaveClick = (event, recipeId) => {
            event.stopPropagation();
            // Logic for saving the recipe
            console.log(`Saved recipe with ID: ${recipeId}`);
        };
        
    return (
        <div className={styles.resultsGrid}>
            {recipes.map((recipe) => {
                const details = recipeDetails?.[recipe.id] || {};
                const shortDescription = details.summary
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
                            <button 
                                className={styles.likeButton} 
                                onClick={(event) => handleLikeClick(event, recipe.id)}
                            >Like</button>
                            <button 
                                className={styles.saveButton} 
                                onClick={(event) => handleSaveClick(event, recipe.id)}
                            >Save</button>
                        </div>
                    </div>
                );
            })}

            {isModalOpen && 
                <RecipePreviewModal
                recipe={selectedRecipe}
                onClose={closeModal}
                onViewRecipe={viewFullRecipe}
            />
            }
        </div>
    );
};

export default DiscoverResults;