import React, { useEffect, useState } from 'react';
import RecipePreviewModal from '../../RecipePreviewModal/RecipePreviewModal';
import styles from './DiscoverResults.module.css';

const DiscoverResults = ({ recipes }) => {
        console.log('Recipes:', recipes, 'Type:', typeof recipes);

        const [selectedRecipe, setSelectedRecipe] = useState(null);
        const [isModalOpen, setIsModalOpen] = useState(false);

        const handleRecipeClick = (recipe) => {
            setSelectedRecipe(recipe);
            setIsModalOpen(true);
        }

        const closeModal = () => {
            setIsModalOpen(false);
            setSelectedRecipe(null);
        }

        const viewFullRecipe = () => {
            window.location.href = `/recipes/${selectedRecipe.id}`;
        };

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
            {recipes.map((recipe, index) => (
                <div 
                    key={index} 
                    className={styles.recipeCard}
                    onClick={() => handleRecipeClick(recipe)}
                >
                    <img src={recipe.image} alt={recipe.title} className={styles.recipeImage} />
                    <p className={styles.recipeTitle}>{recipe.title}</p>

                    {/* Like and Save buttons with individual click handlers */}
                    <div className={styles.recipeActions}>
                        <button 
                            className={styles.likeButton} 
                            onClick={(event) => handleLikeClick(event, recipe.id)}
                        >Like
                        </button>
                        <button 
                            className={styles.saveButton} 
                            onClick={(event) => handleSaveClick(event, recipe.id)}
                        >Save
                        </button>
                    </div> 
                </div>
            ))}

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