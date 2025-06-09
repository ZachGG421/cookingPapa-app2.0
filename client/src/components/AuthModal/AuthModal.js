import React from 'react';
import { useNavigate } from "react-router-dom";
import styles from './AuthModal.module.css';

function AuthModal({ onClose }){
    const navigate = useNavigate();

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2> Welcome to Cooking Papa!</h2>
                <p>Login to your profile, or register to create an account</p>
                <div className={styles.buttonGroup}>
                    <button onClick={() => navigate("/register")}>Register</button>
                    <button onClick={() => navigate("/login")}>Login</button>
                </div>
                <button onClick={onClose} className={styles.closeButton}>X</button>
            </div>
        </div>
    );
};

export default AuthModal;