import React, { useState } from 'react';
import styles from '../DiscoverTool.module.css';

function DiscoverTool({ onSearch }) {
    const [ingredient, setIngredient] = useState('');
    const [ingredients, setIngredients] = useState([]);

    const addIngredient = () => {
        if (ingredient) {
            setIngredients([...ingredients, ingredient]);
            setIngredient('');
        }
    };

    const removeIngredient = () => {
        if(ingredients.length > 0) {
            setIngredients(ingredients.slice(0,-1));
        }
    }

    const searchRecipes = () => {
        onSearch(ingredients);
    }

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
                        <li key={index}>{ing}</li>
                        ))}
                    </ul>
                </div>

                <div className="removeIngredientButton">
                    <button onClick={removeIngredient}>Remove Ingredient</button>
                </div>
                <div className="searchRecipesButton">
                    <button onClick={searchRecipes}>Search Recipes</button>
                </div>
            </div>
        </div>
    );
};

export default DiscoverTool;