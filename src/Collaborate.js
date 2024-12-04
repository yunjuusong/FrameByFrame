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
      setAllImage(result.data.data);
    } catch (error) {
      console.error("Failed to fetch images:", error);
      alert("Failed to load images");
    }
  };

  const deleteImage = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/delete-image/${id}`);
      alert("Image deleted successfully");
      getImage();
    } catch (error) {
      console.error("Failed to delete image:", error);
      alert("Failed to delete image");
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
  
    setAllImage(updatedImages); // Update the image order in the frontend
  
    // Update the order in the backend
    try {
      const imageOrder = updatedImages.map((img) => img._id);
      await axios.put("http://localhost:5000/update-image-order", { imageOrder });
    } catch (error) {
      console.error("Failed to save image order:", error);
      alert("Failed to save image order.");
    }
  };
  

  const onDragOver = (event) => {
    event.preventDefault();
  };

  const saveImageOrder = async (images) => {
    const imageOrder = images.map((image) => image._id); // Extract IDs in order
    try {
      await axios.put("http://localhost:5000/update-image-order", { imageOrder });
      alert("Image order updated successfully.");
    } catch (error) {
      console.error("Failed to update image order:", error);
      alert("Failed to save image order.");
    }
  };
  

  const publishImages = async () => {
    try {
      // Step 1: Make the API call to publish the images
      const response = await axios.post("http://localhost:5000/publish-images");
  
      // Step 2: Check if the response is successful
      if (response.data.status === "ok") {
        alert("Images published and order preserved");
        
        // Step 3: Refresh the images list after publishing to reflect the updated order
        getImage(); // Fetch the latest images and their updated order
      }
    } catch (error) {
      console.error("Failed to publish images:", error);
      alert("Failed to publish images");
    }
  };
  
  
  
  

  return (
    <div className="main-container">
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

      <div className="preview-screen">
        <div className="preview-screen-header">
          <h2>Preview Screen</h2>
          <div className="preview-buttons">
            <button
              className="start-over-button"
              onClick={() => alert("Start Over")}
            >
              Start Over
            </button>
            <button onClick={publishImages} className="publish-button">
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

      <div className="bottom-bar">
        {allImage.length === 0 ? (
          <p>No images in the database</p>
        ) : (
          allImage.map((data) => (
            <div
              key={data._id}
              className={`thumbnail-container ${data.editable ? "editable" : "non-editable"}`}
              onDragStart={(event) => onDragStart(event, data._id)}
              onDragOver={onDragOver}
              onDrop={(event) => onDrop(event, data._id)}
            >
              <img
                src={`http://localhost:5000/get-image/${data._id}`}
                className="thumbnail"
                alt={data.name || "stored image"}
                draggable={data.editable}
              />
              {data.editable && (
                <button
                  className="delete-button"
                  onClick={() => deleteImage(data._id)}
                >
                  Delete
                </button>
              )}
            </div>
          ))
        )}
      </div>



    </div>
  );
}

export default Collaborate;
