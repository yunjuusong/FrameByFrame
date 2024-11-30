import { FastImageSequence } from "@mediamonks/fast-image-sequence";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import './Tutorials.css';

function Collaborate() {
  const [image, setImage] = useState(null);
  const [allImage, setAllImage] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const sequenceContainerRef = useRef(); // Ref for the image sequence container

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

  const handleStartOver = () => {
    // Reset any state or action related to starting over
    console.log("Start Over");
  };

  const handlePublish = () => {
    // Logic for the publish action
    alert("Published!");
  };

  return (
    <div className="main-container">
      {/* Sidebar */}
      <div className="sidebar">
        <form onSubmit={submitImage}>
          <input 
            type="file" 
            accept="image/*" 
            onChange={onInputChange}
            className="file-input"
          />
          <button 
            type="submit" 
            disabled={!image}
            className="submit-button"
          >
            Submit
          </button>
        </form>
        <div className="uploaded-images">
          <h3>Recently Uploaded</h3>
          {uploadedImages.length === 0 ? (
            <p>No images uploaded</p>
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
          <h2>Preview Screen</h2>
          <div className="preview-buttons">
            <button className="start-over-button" onClick={handleStartOver}>
              Start Over
            </button>
            <button className="publish-button" onClick={handlePublish}>
              Publish
            </button>
            <button onClick={renderImageSequence} className="render-button">
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

      {/* Bottom bar */}
      <div className="bottom-bar">
        {allImage.length === 0 ? (
          <p>No images in the database</p>
        ) : (
          <div className="image-grid">
            {allImage.map((data) => (
              <img
                key={data._id}
                src={`http://localhost:5000/get-image/${data._id}`}
                className="thumbnail"
                alt={data.name || "stored image"}
              />
            ))}
          </div>
        )}
      </div>

      {/* Tutorial boxes with arrows */}
      <div className="tutorials-container">
        {/* Start Over tutorial box */}
        <div className="floating-box" style={{ top: '10%', right: '5%' }}>
          <h3>Start Over</h3>
          <p>Click this to remove all uploaded images and reset the UI.</p>
        </div>
        
        {/* Publish tutorial box */}
        <div className="floating-box" style={{ top: '20%', right: '5%' }}>
          <h3>Publish</h3>
          <p>Click Publish to finalize and upload your video. Once published, changes cannot be made.</p>
        </div>
        
        {/* Play Image Sequence tutorial box */}
        <div className="floating-box" style={{ top: '30%', right: '5%' }}>
          <h3>Play Image Sequence</h3>
          <p>Click this button to play the most recent image sequence.</p>
        </div>

        {/* Choose File tutorial box */}
        <div className="floating-box" style={{ top: '10%', left: '5%' }}>
          <h3>Choose File</h3>
          <p>Click this button to select an image from your device for upload.</p>
        </div>

        {/* Submit tutorial box */}
        <div className="floating-box" style={{ top: '25%', left: '5%' }}>
          <h3>Submit</h3>
          <p>Click Submit to upload your image to the database. Your image will appear in the bottom bar.</p>
        </div>

        {/* Bottom Bar tutorial box */}
        <div className="floating-box" style={{ bottom: '15%', left: '5%' }}>
          <h3>Bottom Bar</h3>
          <p>Drag and drop your images in this bar to arrange them as needed.</p>
        </div>
      </div>
    </div>
  );
}

export default Collaborate;
