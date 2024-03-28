import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import { Link } from 'react-router-dom';


function App() {
  
  const [data, setData] = useState(null);
  
  useEffect(() => {
    const callBackendAPI = async () => {
      try {
        const response = await fetch("/api");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const body = await response.json();
        setData(body.message);
      } catch (error) {
        console.error(error.message);
      }
    };
    callBackendAPI();
  }, []);


  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Navbar />

          {data && <p>{data}</p>}
        </header>
      </div>
    </Router>
  );
}

export default App;
