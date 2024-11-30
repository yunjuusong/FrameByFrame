import React from "react";
import './Tutorials.css';

function Tutorials() {
  return (
    <div className="tutorials-container">
      <div className="floating-box" style={{ top: '10%', left: '5%' }}>
        <h3>Choose File</h3>
        <p>Click this button to select an image from your device for upload.</p>
      </div>
      
      <div className="floating-box" style={{ top: '25%', left: '5%' }}>
        <h3>Submit</h3>
        <p>Click Submit to upload your image to the database. Your image will appear in the bottom bar.</p>
      </div>
      
      <div className="floating-box" style={{ bottom: '15%', left: '5%' }}>
        <h3>Bottom Bar</h3>
        <p>Drag and drop your images in this bar to arrange them as needed.</p>
      </div>
      
      <div className="floating-box" style={{ top: '50%', right: '5%' }}>
        <h3>Play Image Sequence</h3>
        <p>Click this button to play the most recent image sequence.</p>
      </div>
      
      <div className="floating-box" style={{ top: '10%', right: '5%' }}>
        <h3>Start Over</h3>
        <p>Click this to remove all uploaded images and reset the UI.</p>
      </div>
      
      <div className="floating-box" style={{ top: '20%', right: '5%' }}>
        <h3>Publish</h3>
        <p>Click Publish to finalize and upload your video. Once published, changes cannot be made.</p>
      </div>
    </div>
  );
}

export default Tutorials;
