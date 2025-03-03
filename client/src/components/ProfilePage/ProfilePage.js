import React from 'react';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

const ProfilePage = ({}) => {
    return (
        <div>
            <Navbar />
            <div>
                <h1>Profile</h1>
                <p>This is who you are</p>
            </div>
            <Footer />
        </div>
    );
};

export default ProfilePage;