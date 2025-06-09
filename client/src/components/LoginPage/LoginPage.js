import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.css";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        navigate("/profile");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.pageContainer}>
        <div className={styles.card}>
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <input
              name="email"
              placeholder="Email"
              className={styles.inputField}
              onChange={handleChange}
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              className={styles.inputField}
              onChange={handleChange}
              required
            />
            <button type="submit" className={styles.button}>Login</button>
            {error && <p className={styles.error}>{error}</p>}
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default LoginPage;
