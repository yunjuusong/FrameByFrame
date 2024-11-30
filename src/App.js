import React from "react";
import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import './App.css';
import Collaborate from './Collaborate'; // Import the new Collaborate component
import Tutorials from './Tutorials';

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Task Bar */}
        <div className="task-bar">
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/tutorials">Tutorials</Link>
            <Link to="/collaborate" className="collaborate">Collaborate</Link>
          </div>
          <div className="actions">
          </div>
        </div>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tutorials" element={<Tutorials />} />
          <Route path="/collaborate" element={<Collaborate />} /> {/* Use Collaborate */}
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div className="main-container">
      <h1>Welcome to the Main Page</h1>
      <p>Navigate using the links above.</p>
    </div>
  );
}

export default App;
