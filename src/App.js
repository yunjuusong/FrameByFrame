import axios from "axios";
import { useEffect, useState } from "react";
import './App.css';

function App() {
  const [image, setImage] = useState(null);
  const [allImage, setAllImage] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);  // Track uploaded images

  useEffect(() => {
    getImage(); // Fetch images from the database
  }, []);

  const submitImage = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", image);

    // Upload image to the server
    await axios.post("http://localhost:5000/upload-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    getImage();  // Refresh images from the database after upload
    setUploadedImages([...uploadedImages, image]);  // Add uploaded image to the sidebar
  };

  const onInputChange = (e) => {
    setImage(e.target.files[0]);
  };

  const getImage = async () => {
    const result = await axios.get("http://localhost:5000/get-image");
    setAllImage(result.data.data);  // Set images from the database
  };

  return (
    <div className="app-container">
      <div className="task-bar">
        <div className="nav-links">
          <a href="index.html">Home</a>
          <a href="collaborate.html" className="collaborate">Collaborate</a>
        </div>
        <div className="actions">
          <button onClick={() => alert("Starting over...")}>Start Over</button>
          <button onClick={() => alert("Publishing...")}>Publish</button>
        </div>
      </div>

      <div className="main-container">
        {/* Sidebar - Display uploaded images */}
        <div className="sidebar">
          <form onSubmit={submitImage}>
            <input type="file" accept="image/*" onChange={onInputChange}></input>
            <button type="submit">Submit</button>
          </form>
          <div className="uploaded-images">
            {uploadedImages.length === 0 ? (
              <p>No images uploaded</p>
            ) : (
              uploadedImages.map((img, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(img)}  // Display uploaded image preview
                  height={60}
                  width={60}
                  alt="uploaded"
                />
              ))
            )}
          </div>
        </div>

        {/* Preview screen */}
        <div className="preview-screen">
          <div className="preview-content">Preview Screen</div>
        </div>
      </div>

      {/* Bottom bar - Display images from the database */}
      <div className="bottom-bar">
        {allImage.length === 0 ? (
          <p>No images in the database</p>
        ) : (
          allImage.map((data, index) => (
            <img
              key={index}
              src={require(`./images/${data.image}`)}  // Database images
              height={60}
              width={60}
              alt="database-image"
            />
          ))
        )}
      </div>
    </div>
  );
}

export default App;