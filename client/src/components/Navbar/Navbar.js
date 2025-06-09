import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
import logo from '../../assets/cookingpapalogo.png'
import AuthModal from "../AuthModal/AuthModal";

function Navbar() {

    const navigate = useNavigate();

    // Token state to track login status
    const [token, setToken] = useState(localStorage.getItem("token"));

    // Keep token state in sync with localStorage changes
    useEffect(() => {
        const handleStorageChange = () => {
            setToken(localStorage.getItem("token"));
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    //adding the states
    const [isActive, setIsActive] = useState(false);
    const [showModal, setShowModal ] = useState(false);

    //add the active class
    const toggleActiveClass = () => {
        setIsActive(!isActive);
    };

    //Cleanup function to remove active class
    const removeActive = () => {
        setIsActive(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setToken(null);
        navigate("/");
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
                            <Link to="/" className={`${styles.navLink}`}>Homepage</Link>
                        </li>
                        <li onClick={removeActive}>
                            <Link to="/recipes" className={`${styles.navLink}`}>Recipes</Link>
                        </li>
                        <li onClick={removeActive}>
                            <Link to="/about" className={`${styles.navLink}`}>About Us</Link>
                        </li>
                        <li onClick={removeActive}>
                            <Link to="/contact" className={`${styles.navLink}`}>Contact</Link>
                        </li>

                        {/* Profile + Logout */}
                        {token ? (
                            <>
                                <li onClick={removeActive}>
                                    <Link to="/profile" className={styles.navLink}>Profile</Link>
                                </li>
                                <li onClick={removeActive}>
                                    <button
                                        onClick={handleLogout}
                                        className={styles.logoutButton}
                                    >
                                        Logout
                                        </button>
                                </li>
                            </>
                            ) : (
                                <li onClick={removeActive}>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setShowModal(true);
                                        }}
                                        className={styles.navLink}
                                    >
                                    Profile
                                    </button>
                                </li>
                            )}
                    </ul>

                    {/* Hamburger Menu*/}
                    <div className={`${styles.hamburger} ${isActive ? styles.active : ''}`} onClick={toggleActiveClass}>
                        <span className={`${styles.bar}`}></span>
                        <span className={`${styles.bar}`}></span>
                        <span className={`${styles.bar}`}></span>
                    </div>
                </nav>
                {showModal && <AuthModal onClose={() => setShowModal(false)} />}
            </header>
    );
}

export default Navbar;