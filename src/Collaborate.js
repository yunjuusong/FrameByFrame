import { FastImageSequence } from "@mediamonks/fast-image-sequence";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

function Collaborate() {
  const [image, setImage] = useState(null);
  const [allImage, setAllImage] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isSequencePlaying, setIsSequencePlaying] = useState(false);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const sequenceContainerRef = useRef();
  const sequenceRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get("http://localhost:5000/get-all-images");
      console.log("Fetched Images:", response.data.data);
      setAllImage(response.data.data || []);
    } catch (error) {
      console.error("Error fetching images:", error);
      alert("Unable to load images. Please try again.");
    }
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!image) {
      alert("Please select an image before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("editable", true);

    try {
      await axios.post("http://localhost:5000/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Image uploaded successfully");
      fetchImages();

      e.target.reset();
      setImage(null);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image. Please try again.");
    }
  };

  const handlePublishImages = async () => {
    try {
      await axios.post("http://localhost:5000/publish-images");
      console.log("Images published successfully");

      // Navigate to the homepage
      navigate("/");
    } catch (error) {
      console.error("Failed to publish images:", error);
      alert("Failed to publish images. Please try again.");
    }
  };

  const confirmPublish = () => {
    setShowConfirmationPopup(true);
  };

  const cancelPublish = () => {
    setShowConfirmationPopup(false);
  };

  const handleImageDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/delete-image/${id}`);
      console.log(`Deleted image with ID: ${id}`);
      fetchImages();
    } catch (error) {
      console.error("Failed to delete image:", error);
      alert("Failed to delete image. Please try again.");
    }
  };

  const onDragStart = (event, id) => {
    event.dataTransfer.setData("imageId", id);
  };

  const onDrop = async (event, targetId) => {
    event.preventDefault();
    const sourceId = event.dataTransfer.getData("imageId");
    const updatedImages = [...allImage];
    const sourceIndex = updatedImages.findIndex((img) => img._id === sourceId);
    const targetIndex = updatedImages.findIndex((img) => img._id === targetId);

    if (sourceIndex === -1 || targetIndex === -1) return;

    const [movedImage] = updatedImages.splice(sourceIndex, 1);
    updatedImages.splice(targetIndex, 0, movedImage);

    setAllImage(updatedImages);

    try {
      const imageOrder = updatedImages.map((img) => img._id);
      await axios.put("http://localhost:5000/update-image-order", {
        imageOrder,
      });
    } catch (error) {
      console.error("Failed to save image order:", error);
      alert("Failed to save image order.");
    }
  };

  const onDragOver = (event) => {
    event.preventDefault();
  };

  const renderImageSequence = async () => {
    if (isSequencePlaying) {
      stopImageSequence();
      return;
    }

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

    if (!sequenceRef.current) {
      sequenceRef.current = new FastImageSequence(
        sequenceContainerRef.current,
        options
      );
    }

    sequenceRef.current.play(10);
    setIsSequencePlaying(true);
  };

  const stopImageSequence = () => {
    if (sequenceRef.current) {
      sequenceRef.current.stop();
    }
    setIsSequencePlaying(false);
  };

  return (
    <div className="main-container">
      {/* Sidebar */}
      <div className="sidebar">
        <form onSubmit={handleImageUpload}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
          <button type="submit" disabled={!image}>
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
          <div className="preview-screen-header-text">Preview Screen</div>
          <div className="preview-buttons">
            <button className="start-over-button" onClick={fetchImages}>
              Start Over
            </button>
            <button className="publish-button" onClick={confirmPublish}>
              Publish
            </button>
            <button onClick={renderImageSequence} className="render-button">
              {isSequencePlaying
                ? "Stop Image Sequence"
                : "Play Image Sequence"}
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
          <p>No images available. Please upload some images.</p>
        ) : (
          allImage.map((data) => {
            return (
              <div
                key={data._id}
                className={`image-container ${
                  data.editable ? "editable" : "non-editable"
                }`}
                onDragStart={(event) => onDragStart(event, data._id)}
                onDragOver={onDragOver}
                onDrop={(event) => onDrop(event, data._id)}
              >
                <img
                  src={`http://localhost:5000/get-image/${data._id}`}
                  className="thumbnail"
                  alt={data.name || "Stored image"}
                  draggable={data.editable}
                />
                {data.editable && (
                  <button
                    className="delete-button"
                    onClick={() => handleImageDelete(data._id)}
                  >
                    X
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Confirmation Popup */}
      {showConfirmationPopup && (
        <div className="confirmation-popup">
          <div className="popup-content">
            <p>
              Are you sure you want to publish? Once published, images cannot be
              removed or edited.
            </p>
            <div className="popup-buttons">
              <button onClick={handlePublishImages}>Publish</button>
              <button onClick={cancelPublish}>Back</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Collaborate;
