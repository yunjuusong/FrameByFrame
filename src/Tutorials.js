import { FastImageSequence } from "@mediamonks/fast-image-sequence";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import './Tutorials.css';

function Collaborate() {
  const [showPopup, setShowPopup] = useState(true); // State to control the popup visibility
  const [image, setImage] = useState(null);
  const [allImage, setAllImage] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [showChooseFileBox, setShowChooseFileBox] = useState(false); // State for visibility of Choose File Box
  const [showSubmitBox, setShowSubmitBox] = useState(false); // State for visibility of Submit Box
  const [showBottomBarBox, setShowBottomBarBox] = useState(false); // State for visibility of Bottom Bar Box
  const [showStartOverBox, setShowStartOverBox] = useState(false); // State for visibility of Start Over Box
  const [showPublishBox, setShowPublishBox] = useState(false); // State for visibility of Publish Box
  const [showPlayImageSequenceBox, setShowPlayImageSequenceBox] = useState(false); // State for Play Image Sequence Box
  const sequenceContainerRef = useRef();

  useEffect(() => {
    getImage();
  }, []);

  const submitImage = async (e) => {
    e.preventDefault();
    if (!image) return;

    const formData = new FormData();
    formData.append("image", image);

    try {
      await axios.post("http://localhost:5000/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadedImages([...uploadedImages, {
        id: Date.now(),
        previewUrl: URL.createObjectURL(image),
      }]);
      getImage();
      e.target.reset();
      setImage(null);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image");
    }
  };

  const onInputChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const getImage = async () => {
    try {
      const result = await axios.get("http://localhost:5000/get-all-images");
      setAllImage(result.data.data);
    } catch (error) {
      console.error("Failed to fetch images:", error);
      alert("Failed to load images");
    }
  };

  const renderImageSequence = async () => {
    if (allImage.length === 0) {
      alert("No images available for rendering the sequence.");
      return;
    }

    const options = {
      frames: allImage.length,
      src: {
        imageURL: (index) => `http://localhost:5000/get-image/${allImage[index]._id}`,
      },
      loop: true,
      objectFit: "cover",
    };

    const sequence = new FastImageSequence(sequenceContainerRef.current, options);
    sequence.play();
  };

  const toggleStartOverBox = () => {
    setShowStartOverBox(!showStartOverBox);
  };

  const togglePublishBox = () => {
    setShowPublishBox(!showPublishBox);
  };

  const togglePlayImageSequenceBox = () => {
    setShowPlayImageSequenceBox(!showPlayImageSequenceBox);
  };

  const toggleChooseFileBox = () => {
    setShowChooseFileBox(!showChooseFileBox);
  };

  const toggleSubmitBox = () => {
    setShowSubmitBox(!showSubmitBox);
  };

  const toggleBottomBarBox = () => {
    setShowBottomBarBox(!showBottomBarBox);
  };

  // Handle popup close action
  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="main-container">
      {/* Popup */}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Welcome to the Tutorial Page.</h3>
            <p>Click on the blue buttons to learn about their functionality. Click on the buttons again to close the description.</p>
            <button className="close-popup" onClick={closePopup}>Close</button>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className="sidebar">
        <form onSubmit={submitImage}>
          <button 
            type="button" 
            onClick={toggleChooseFileBox} 
            className="file-input-button"
          >
            Choose File
          </button>
          <button 
            type="button" 
            className="submit-button"
            onClick={toggleSubmitBox} // Toggle the submit box visibility
          >
            Submit
          </button>
        </form>
        <div className="uploaded-images">
          <h3>Recently Uploaded</h3>
          {uploadedImages.length === 0 ? (
            <p>Your uploaded images will be displayed here.</p>
          ) : (
            uploadedImages.map((img) => (
              <img
                key={img.id}
                src={img.previewUrl}
                className="thumbnail"
                height={60}
                width={60}
                alt="uploaded preview"
              />
            ))
          )}
        </div>
      </div>

      {/* Preview screen */}
      <div className="preview-screen">
        <div className="preview-screen-header">
        <div class="preview-screen-header-text">Preview Screen</div>
        <div class="preview-screen-header-text-2">A preview of the most updated video will be displayed down below.</div>
        
          <div className="preview-buttons">
            {/* Replaced Start Over button with toggle functionality */}
            <button className="start-over-button" onClick={toggleStartOverBox}>
              Start Over
            </button>
            {/* Replaced Publish button with toggle functionality */}
            <button className="publish-button" onClick={togglePublishBox}>
              Publish
            </button>
            <button onClick={togglePlayImageSequenceBox} className="render-button">
              Play Image Sequence
            </button>
          </div>
        </div>
        <div
          ref={sequenceContainerRef}
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "black",
          }}
        />
      </div>

      {/* Floating tutorial boxes */}
      <div className="tutorials-container">
        {/* Choose File tutorial box */}
        {showChooseFileBox && (
          <div className="floating-box" style={{ top: '1%', left: '7%' }}>
            <h3>Choose File</h3>
            <p>Click this button to learn about selecting files for upload.</p>
          </div>
        )}
        {/* Submit tutorial box */}
        {showSubmitBox && (
          <div className="floating-box" style={{ top: '15%', left: '5%' }}>
            <h3>Submit</h3>
            <p>Click Submit to upload your image to the database. Your image will appear in the bottom bar.</p>
          </div>
        )}
        {/* Start Over tutorial box closer to the button */}
        {showStartOverBox && (
          <div className="floating-box" style={{ top: '80px', right: '15%' }}>
            <h3>Start Over</h3>
            <p>Click this button to start the process over and clear the uploaded images.</p>
          </div>
        )}
        {/* Publish tutorial box */}
        {showPublishBox && (
          <div className="floating-box" style={{ top: '200px', right: '10%' }}>
            <h3>Publish</h3>
            <p>Click this button to finalize and publish your work. You may not delete any images once you click publish.</p>
          </div>
        )}
        {/* Play Image Sequence tutorial box */}
        {showPlayImageSequenceBox && (
          <div className="floating-box" style={{ top: '100px', right: '0%' }}>
            <h3>Play Image Sequence</h3>
            <p>Click this button to start the image sequence animation.</p>
          </div>
        )}
        {/* Bottom Bar tutorial box */}
        {showBottomBarBox && (
          <div className="floating-box" style={{ bottom: '15%', left: '5%' }}>
            <h3>Bottom Bar</h3>
            <p>Drag and drop your images in this bar to arrange them as needed. You may delete any uploaded images before they are published.</p>
          </div>
        )}
      </div>

      {/* Temporary Bottom Bar */}
      <div className="bottom-bar">
        <button
          className="bottom-bar-button"
          onClick={toggleBottomBarBox} // Toggles the bottom bar box
        >
          Bottom Bar
        </button>
      </div>
    </div>
  );
}

export default Collaborate;
