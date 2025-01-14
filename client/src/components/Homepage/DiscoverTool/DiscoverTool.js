import React, { useState } from 'react';
import styles from './DiscoverTool.module.css';

function DiscoverTool({ onSearch }) {
    const [ingredient, setIngredient] = useState('');
    const [ingredients, setIngredients] = useState([]);

    const addIngredient = () => {
        if (ingredient) {
            setIngredients([...ingredients, ingredient]);
            setIngredient('');
        }
    };

    const removeSpecificIngredient = (indexToRemove) => {
        setIngredients(ingredients.filter((_, index) => index !== indexToRemove));
    };

    const searchRecipes = () => {
        onSearch(ingredients);
    };

    return (
        <div className={`${styles.discoverToolContainer}`}>
            <div className={`${styles.enterIngredientsTab}`}>
                <p>Enter your Ingredients:</p>
                <div className={`${styles.enterIngredientsContent}`}>
                    <input 
                        type="text" 
                        value={ingredient} 
                        onChange={(e) => setIngredient(e.target.value)} 
                        onKeyDown={(e) => {
                            if(e.key ==='Enter') {
                                addIngredient();
                            }
                        } }
                        placeholder="Ingredient" 
                    />
                    <button onClick={addIngredient}>Add Ingredient</button>
                </div>
            </div>

            <div className={`${styles.ingredientsListTab}`}>
                <div className="Ingredients-List">
                    <ul>
                        {ingredients.map((ing, index) => (
                        <li key={index}>
                                {ing}
                                <button
                                    className={styles.removeButton}
                                    onClick={() => removeSpecificIngredient(index)}
                                >
                                    x
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className={`${styles.searchRecipesButton}`}>
                    <button onClick={searchRecipes}>Search Recipes</button>
                </div>
            </div>
        </div>
    );
};

export default DiscoverTool;