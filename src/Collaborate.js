import { FastImageSequence } from "@mediamonks/fast-image-sequence";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import "./App.css";

function Collaborate() {
  const [image, setImage] = useState(null);
  const [allImage, setAllImage] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isSequencePlaying, setIsSequencePlaying] = useState(false); // Track sequence playback state
  const sequenceContainerRef = useRef(); // Ref for the image sequence container
  const sequenceRef = useRef(null); // Ref for the FastImageSequence instance
  //   const [image, setImage] = useState(null);
  //  const [allImage, setAllImage] = useState([]);
  //  const sequenceContainerRef = useRef();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get("http://localhost:5000/get-all-images");
      console.log("Fetched Images:", response.data.data); // Log fetched images
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
    formData.append("editable", true); // Ensure 'editable' is true upon submission.

    try {
      await axios.post("http://localhost:5000/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Image uploaded successfully");
      fetchImages(); // Refresh the images list

      // Reset input
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

      // Refresh images to update editable status
      fetchImages();
    } catch (error) {
      console.error("Failed to publish images:", error);
      alert("Failed to publish images. Please try again.");
    }
  };

  const handleImageDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/delete-image/${id}`);
      console.log(`Deleted image with ID: ${id}`);
      fetchImages(); // Refresh the list after deletion
    } catch (error) {
      console.error("Failed to delete image:", error);
      alert("Failed to delete image. Please try again.");
    }
  };

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
    setIsSequencePlaying(true); // Update state to reflect playback status
  };

  const stopImageSequence = () => {
    if (sequenceRef.current) {
      sequenceRef.current.stop();
    }
    setIsSequencePlaying(false); // Update state to reflect stopped status
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
        <div className="main-container">
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
          </div>

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
      </div>

        {/* Preview screen */}
        <div className="preview-screen">
          <div className="preview-screen-header">
            <h2>Preview Screen</h2>
            <div className="preview-buttons">
              <button className="start-over-button" onClick={fetchImages}>Start Over</button>
              <button className="publish-button" onClick={handlePublishImages}>Publish</button>
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
              console.log(
                `Rendering image with ID: ${data._id}, Editable: ${data.editable}`
              );
              return (
                <div key={data._id} className="image-container">
                  <img
                    src={`http://localhost:5000/get-image/${data._id}`}
                    alt={data.name || "Stored image"}
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
    </div>
  );
}

export default Collaborate;
