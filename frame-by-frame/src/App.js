import React, { useState } from "react";

const App = () => {
  const [images, setImages] = useState([]);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => {
      return {
        file,
        url: URL.createObjectURL(file),
      };
    });

    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  const removeImage = (url) => {
    setImages((prevImages) => prevImages.filter((image) => image.url !== url));
    URL.revokeObjectURL(url); // Clean up memory
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Image Uploader</h1>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
      />
      <div style={{ marginTop: "20px", display: "flex", flexWrap: "wrap" }}>
        {images.map((image, index) => (
          <div
            key={index}
            style={{
              margin: "10px",
              textAlign: "center",
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "10px",
            }}
          >
            <img
              src={image.url}
              alt={`Uploaded ${index}`}
              style={{
                width: "150px",
                height: "150px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
            <button
              onClick={() => removeImage(image.url)}
              style={{
                marginTop: "10px",
                background: "#ff4d4d",
                color: "white",
                border: "none",
                padding: "5px 10px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
