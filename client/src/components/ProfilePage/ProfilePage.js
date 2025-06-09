import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import styles from "./ProfilePage.module.css";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Not logged in.");
        return;
      }

      try {
        const res = await fetch("http://localhost:4000/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setUser(data);
        } else {
          setError(data.error || "Failed to fetch profile.");
        }
      } catch (err) {
        setError("Server error");
      }
    };

    fetchProfile();
  }, []);

  return (
    <>
    <Navbar />
    <div className={styles.pageBackground}>
      <div className={styles.profileContainer}>
        <h2 className={styles.heading}>Profile</h2>
        {error && <p className={styles.error}>{error}</p>}
        {user ? (
          <div className={styles.userInfo}>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        ) : !error ? (
          <p className={styles.loading}>Loading...</p>
        ) : null}
      </div>
    </div>
    <Footer />
    </>
    );
}

export default ProfilePage;
