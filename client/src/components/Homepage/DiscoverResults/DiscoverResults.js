import React, { useEffect, useState } from 'react';
import styles from './DiscoverResults.module.css';

const DiscoverResults = ({ recipes }) => {
        console.log('Recipes:', recipes, 'Type:', typeof recipes);
    return (
        <div className={styles.resultsGrid}>
            {recipes.map((recipe, index) => (
                <div key={index} className={styles.recipeCard}>
                    <img src={recipe.image} alt={recipe.title} className="{styles.recipeImage}" />
                    <p className={styles.recipeTitle}>{recipe.title}</p>
                    <div className={styles.recipeActions}>
                        <button className={styles.likeButton}>Like</button>
                        <button className={styles.saveButton}>Save</button>
                    </div>   
                </div>
            ))}
        </div>
    );
};

export default DiscoverResults;