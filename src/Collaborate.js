import { FastImageSequence } from "@mediamonks/fast-image-sequence";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import "./App.css";

function Collaborate() {
  const [image, setImage] = useState(null);
  const [allImage, setAllImage] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
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
      setUploadedImages([
        ...uploadedImages,
        {
          id: Date.now(),
          previewUrl: URL.createObjectURL(image),
        },
      ]);
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
      console.log("Fetched Images:", result.data.data);
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
        imageURL: (index) =>
          `http://localhost:5000/get-image/${allImage[index]._id}`,
      },
      loop: true,
      objectFit: "cover",
    };

    const sequence = new FastImageSequence(sequenceContainerRef.current, options);
    sequence.play();
  };

  const handleStartOver = () => {
    console.log("Start Over");
  };

  const handlePublish = () => {
    alert("Published!");
  };

  const onDragStart = (event, id) => {
    event.dataTransfer.setData("imageId", id);
  };

  const onDrop = (event, targetId) => {
    event.preventDefault();
    const sourceId = event.dataTransfer.getData("imageId");
    const updatedImages = [...allImage];
    const sourceIndex = updatedImages.findIndex((img) => img._id === sourceId);
    const targetIndex = updatedImages.findIndex((img) => img._id === targetId);

    if (sourceIndex === -1 || targetIndex === -1) return;

    const [movedImage] = updatedImages.splice(sourceIndex, 1);
    updatedImages.splice(targetIndex, 0, movedImage);

    setAllImage(updatedImages); // Update the image order
  };

  const onDragOver = (event, data) => {
    event.preventDefault(); // Prevent drop if the image is non-editable
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
          allImage.map((data) => (
            <div
              key={data._id}
              className={`thumbnail-container ${
                data.editable ? "editable" : "non-editable"
              }`}
              onDragStart={(event) => onDragStart(event, data._id)}
              onDragOver={onDragOver}
              onDrop={(event) => onDrop(event, data._id)}
            >
              <img
                src={`http://localhost:5000/get-image/${data._id}`}
                className="thumbnail"
                alt={data.name || "stored image"}
                draggable
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Collaborate;
