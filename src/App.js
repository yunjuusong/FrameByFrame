import { FastImageSequence } from "@mediamonks/fast-image-sequence";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { NavLink, Route, BrowserRouter as Router, Routes } from "react-router-dom";
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
            <span className="website-title">
              <span style={{ fontFamily: 'Papyrus' }}>F</span>
              <span style={{ fontFamily: 'Copperplate' }}>R</span>
              <span style={{ fontFamily: 'Ribeye Marrow' }}>A</span>
              <span style={{ fontFamily: 'Courier New' }}>M</span>
              <span style={{ fontFamily: 'OCR A Std' }}>E</span>
              <span style={{ fontFamily: 'Comic Sans MS' }}> </span>
              <span style={{ fontFamily: 'Hoefler Text' }}>B</span>
              <span style={{ fontFamily: 'Big Caslon' }}>Y</span>
              <span style={{ fontFamily: 'Trebuchet MS' }}> </span>
              <span style={{ fontFamily: 'Optima' }}>F</span>
              <span style={{ fontFamily: 'Avant Garde' }}>R</span>
              <span style={{ fontFamily: 'Overlock' }}>A</span>
              <span style={{ fontFamily: 'cursive' }}>M</span>
              <span style={{ fontFamily: 'Helvetica' }}>E</span>
            </span>
            <img src={require('./images/Group 3.png')} alt="Logo" className="logo" />
          </div>
          <div className="nav-links">
            <NavLink to="/" className={({ isActive }) => isActive ? "active-link" : ""}>Home</NavLink>
            <NavLink to="/tutorials" className={({ isActive }) => isActive ? "active-link" : ""}>Tutorial</NavLink>
            <NavLink to="/collaborate" className={({ isActive }) => isActive ? "active-link" : ""}>Collaborate</NavLink>
          </div>
        </div>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tutorials" element={<Tutorials />} />
          <Route path="/collaborate" element={<Collaborate />} />
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  const [allImage, setAllImage] = useState([]);
  const sequenceContainerRef = useRef(null);
  const sequenceInitialized = useRef(false);

  const getImage = async () => {
    try {
      const result = await axios.get("http://localhost:5000/get-all-images");
      setAllImage(result.data.data);
    } catch (error) {
      console.error("Failed to fetch images:", error);
    }
  };

  const renderImageSequence = () => {
    if (allImage.length === 0) {
      alert("No images available for rendering the sequence.");
      return;
    }
    if (sequenceInitialized.current) return;

    const options = {
      frames: allImage.length,
      src: {
        imageURL: (index) => `http://localhost:5000/get-image/${allImage[index]._id}`,
      },
      loop: true,
      objectFit: "cover",
    };

    const sequence = new FastImageSequence(sequenceContainerRef.current, options);
    sequence.play(10);
    sequenceInitialized.current = true;
  };

  useEffect(() => {
    getImage();
  }, []);

  useEffect(() => {
    if (allImage.length > 0) {
      renderImageSequence();
    }
  }, [allImage]);

  return (
    <div className="main-container">
      <div className="description-container">
        <p>
          Join a collaborative art piece where each contribution tells a story—a piece of a larger artwork that captures the range and liveliness of the human condition, frame by frame.
        </p>
      </div>

      <div
        ref={sequenceContainerRef}
        style={{
          width: "900px",
          height: "500px",
          backgroundColor: "black",
          marginTop: "20px",
        }}
      />
    </div>
  );
}

export default App;
