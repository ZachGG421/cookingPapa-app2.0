import React from 'react';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

const RecipesPage = ({}) => {
    return (
        <div>
            <Navbar />

            <div>
                <h1>Recipes Page</h1>
                <p>This is where You'll find all of your saved recipes</p>
            </div>
            <Footer />
        </div>
    );
};

export default RecipesPage;

