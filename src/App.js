import { FastImageSequence } from "@mediamonks/fast-image-sequence";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
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
          <Link to="/">Home</Link>
          <Link to="/tutorials">Tutorial</Link>
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
  const [allImage, setAllImage] = useState([]);
  const sequenceContainerRef = useRef(null); // Ref for the image sequence container
  const sequenceInitialized = useRef(false); // Ref to track if sequence is initialized

  // Fetch images from the backend
  const getImage = async () => {
    try {
      const result = await axios.get("http://localhost:5000/get-all-images");
      setAllImage(result.data.data);
    } catch (error) {
      console.error("Failed to fetch images:", error);
    }
  };

  // Render the image sequence
  const renderImageSequence = () => {
    if (allImage.length === 0) {
      alert("No images available for rendering the sequence.");
      return;
    }

    // Only initialize the sequence if it hasn't been initialized already
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

    sequenceInitialized.current = true; // Set the flag to true after initialization
  };

  // Fetch the images when the component mounts
  useEffect(() => {
    getImage();
  }, []);

  useEffect(() => {
    if (allImage.length > 0) {
      renderImageSequence(); // Start the sequence after images are fetched
    }
  }, [allImage]);

  return (
    <div className="main-container">
      <div className="description-container">
        <p>
          Join a collaborative art piece where each contribution tells a story—a piece of a larger artwork that captures the range and liveliness of the human condition, frame by frame.
        </p>
      </div>

      {/* Video / Image sequence container */}
      <div
        ref={sequenceContainerRef}
        style={{
          width: "900px",
          height: "500px",  // Adjust the height of the video container
          backgroundColor: "black",
          marginTop: "20px",
        }}
      />
    </div>
  );
}

export default App;
