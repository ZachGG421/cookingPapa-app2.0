import React from 'react';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

const AboutUsPage = ({}) => {
    return (
        <div>
            <Navbar />
            <div>
                <h1>About Us</h1>
                <p>This is who we are</p>
            </div>
            <Footer />
        </div>
    );
};

export default AboutUsPage;