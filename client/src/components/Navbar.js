import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../Navbar.module.css';
import logo from '../images/cookingpapalogo.png'

function Navbar() {

    //adding the states
    const [isActive, setIsActive] = useState(false);

    //add the active class
    const toggleActiveClass = () => {
        setIsActive(!isActive);
    };

    //Cleanup function to remove active class
    const removeActive = () => {
        setIsActive(false);
    };
    
    return(
            <header className="App-header">
                <nav className={`${styles.navbar}`}>

                    {/* logo */}
                    <div className={styles.logoContainer}>
                        <img src={logo} alt="Logo" className={styles.logo} />
                    </div>

                    <div className={styles.appTitle}>
                        <h1>Cooking Papa</h1>
                    </div>

                    {/* Navigation Menu */}
                    <ul className={`${styles.navMenu} ${isActive ? styles.active: ''}`}>
                        <li onClick={removeActive}>
                            <Link to="#home" className={`${styles.navLink}`}>Homepage</Link>
                        </li>
                        <li onClick={removeActive}>
                            <Link to="#RecipePage" className={`${styles.navLink}`}>Recipes</Link>
                        </li>
                        <li onClick={removeActive}>
                            <Link to="AboutUs" className={`${styles.navLink}`}>About Us</Link>
                        </li>
                        <li onClick={removeActive}>
                            <Link to="#Contact" className={`${styles.navLink}`}>Contact</Link>
                        </li>
                        <li onClick={removeActive}>
                            <Link to="Profile" className={`${styles.navLink}`}>Profile</Link>
                        </li>
                    </ul>

                    {/* Hamburger Menu*/}
                    <div className={`${styles.hamburger} ${isActive ? styles.active : ''}`} onClick={toggleActiveClass}>
                        <span className={`${styles.bar}`}></span>
                        <span className={`${styles.bar}`}></span>
                        <span className={`${styles.bar}`}></span>
                    </div>
                </nav>
            </header>
    );
}

export default Navbar;