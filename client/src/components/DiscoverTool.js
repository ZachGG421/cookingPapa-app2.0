import React, { useState } from 'react';
import styles from '../DiscoverTool.module.css';

/*import { fetchRecipes } from './api'; */

function DiscoverTool() {
    const [ingredient, setIngredient] = useState('');
    const [ingredients, setIngredients] = useState([]);
    const [recipes, setRecipes] = useState([]);

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

    const searchRecipes = async () => {
        /*
        const fetchedRecipes = await fetchRecipes(ingredients);
        setRecipes(fetchedRecipes);
        */
       console.log("Making API request");
    };

    return (
        <div className={`${styles.discoverToolContainer}`}>
            <div className={`${styles.enterIngredientsTab}`}>
                <p>Enter your Ingredients:</p>
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
            </div>


            





            {/*    
            <div>
                <p>Ingredients List</p>
                <ul>
                    {ingredients.map((ing, index) => (
                        <li key={index}>{ing}</li>
                    ))}
                </ul>
                <button onClick={removeIngredient}>Remove Ingredient</button>
            </div>
            <button onClick={searchRecipes}>Search</button>
            <div className="results-container">
                {recipes.map(recipe => (
                    <div key={recipe.id} className="recipe-container">
                        <h2>{recipe.title}</h2>
                        <img src={recipe.image} alt={recipe.title} />

                    </div>
                ))}
            </div>
              */}
        </div>
    );
}

export default DiscoverTool;