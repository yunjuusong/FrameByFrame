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
        <div className="left-side">
          <span className="website-title">Frame by Frame </span>
          <img src={require('./images/Group 3.png')} alt="Logo" className="logo" />
        </div>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/tutorials">Tutorials</Link>
          <Link to="/collaborate" className="collaborate">Collaborate</Link>
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
      <div className="description-container">
        <p>Join a collaborative art piece where each contribution tells a story—a piece of a larger artwork that captures the range and liveliness of the human condition, frame by frame.</p>
      </div>
    </div>
  );
}

export default App;
