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
            // Fetch details for each recipe displayed
            recipes.forEach((recipe) => {
              fetchRecipeDetails(recipe.id); // Fetch additional details for each recipe ID
            });
            //console.log(recipeDetails);
          }, [recipes, fetchRecipeDetails, recipeDetails]);

        // Function to handle "like" button click
            const handleLikeClick = (event, recipeId) => {
            event.stopPropagation(); // Prevents the modal from opening
            // Your logic for liking the recipe (e.g., API call or state update)
            console.log(`Liked recipe with ID: ${recipeId}`);
        };

        // Function to handle "save" button click
        const handleSaveClick = (event, recipeId) => {
            event.stopPropagation(); // Prevents the modal from opening
            // Your logic for saving the recipe (e.g., API call or state update)
            console.log(`Saved recipe with ID: ${recipeId}`);
        };
        
    return (
        <div className={styles.resultsGrid}>
            {recipes.map((recipe) => {
                const details = recipeDetails?.[recipe.id] || {};
                const shortDescription = details.summary
                ? formatDescription(details.summary)
                : "Description loading...";
                
                // Format used ingredients into a comma-separated string
                const usedIngredients = recipe.usedIngredients
                    ? recipe.usedIngredients.map((ingredient) => ingredient.name).join(', ')
                    : '';

                // Format unused ingredients into a comma-separated string
                const unusedIngredients = recipe.unusedIngredients
                    ? recipe.unusedIngredients.map((ingredient) => ingredient.name).join(', ')
                    : '';    
                return (
                    <div 
                        key={recipe.id} 
                        className={styles.recipeCard}
                        onClick={() => handleRecipeClick(recipe)}
                    >
                        <img src={recipe.image} alt={recipe.title} className={styles.recipeImage} />
                        <p className={styles.recipeTitle}>{recipe.title}</p>
                        <p className={styles.recipeDescription}>{shortDescription}</p>

                        <p className={styles.recipeUsedIngre}>
                            {usedIngredients ? `Used Ingredients: ${usedIngredients}` : 'No used ingredients'}
                        </p>
                        <p className={styles.recipeUnusedIngre}>
                            {unusedIngredients ? `Unused Ingredients: ${unusedIngredients}` : 'No unused ingredients'}
                        </p>


                        
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