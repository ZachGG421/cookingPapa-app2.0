import React from 'react';
import styles from './RecipePreviewModal.module.css';

const RecipePreviewModal = ({  recipe, onClose, onViewRecipe }) => {
    if (!recipe) return null; //If no recipe, do not render modal

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>{recipe.title}</h2>
                <img src={recipe.image} alt={recipe.title} className={styles.recimeImage} />
                <p>{recipe.description}</p>

                <div className={styles.modalActions}>
                    <button onClick={onViewRecipe}>View Full Recipe</button>
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default RecipePreviewModal;