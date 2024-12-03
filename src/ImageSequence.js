import React, { useEffect, useRef, useState } from 'react';
import { FastImageSequence } from '@mediamonks/fast-image-sequence';

const ImageSequence = ({ sequenceName }) => {
  const containerRef = useRef();
  const [loading, setLoading] = useState(true); // Loading state for debugging

  useEffect(() => {
    const loadSequence = async () => {
      try {
        // Fetching the image sequence from the backend
        const response = await fetch(`http://localhost:5000/api/images/sequence?sequenceName=${sequenceName}`);
        
        // Check if the response is valid
        if (!response.ok) {
          throw new Error("Failed to fetch image sequence");
        }

        const { sequence } = await response.json();

        // Log the sequence to debug
        console.log("Received image sequence:", sequence);

        if (!sequence || sequence.length === 0) {
          throw new Error("No images found in the sequence");
        }

        const options = {
          frames: sequence.length,
          src: {
            imageURL: (index) => `http://localhost:5000/get-image/${sequence[index]._id}`,
          },
          loop: true,
          objectFit: "cover",
        };

        // Initialize FastImageSequence and play the sequence
        const imageSequence = new FastImageSequence(containerRef.current, options);
        imageSequence.play(10);

        // Mark loading as false once sequence is ready
        setLoading(false);

      } catch (error) {
        console.error("Error loading image sequence:", error);
        setLoading(false); // Stop loading on error
      }
    };

    loadSequence();
  }, [sequenceName]);

  return (
    <div>
      {loading ? (
        <div>Loading...</div> // Show loading text if sequence is being loaded
      ) : (
        <div ref={containerRef} style={{ width: '100%', height: '500px', backgroundColor: 'black' }} />
      )}
    </div>
  );
};

export default ImageSequence;