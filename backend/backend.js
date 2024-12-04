const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");
app.use(express.json());
const cors = require("cors");
app.use(cors());

// MongoDB connection
const mongoUrl = "mongodb+srv://vuhachau2412:framebyframe@framebyframe.yczau.mongodb.net/?retryWrites=true&w=majority&appName=framebyframe";

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => console.log(e));

require("./imageDetails");
const Images = mongoose.model("ImageDetails");

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/upload-image", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ status: "error", message: "No file uploaded" });
  }

  try {
    const newImage = new Images({
      name: req.file.originalname,
      image: {
        data: req.file.buffer,
        contentType: req.file.mimetype
      },
      editable: true, // Flag to mark the image as editable
      order: 0, // Initial order when uploaded
    });

    await newImage.save();
    res.json({ status: "ok", message: "Image uploaded successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.get("/get-image/:id", async (req, res) => {
  try {
    const image = await Images.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ status: "error", message: "Image not found" });
    }

    res.set('Content-Type', image.image.contentType);
    res.send(image.image.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.get("/get-all-images", async (req, res) => {
  try {
    const images = await Images.find({}, 'name _id editable order'); // Fetch name, ID, editable flag, and order
    res.json({ status: "ok", data: images });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.put("/update-image-order", async (req, res) => {
  const { imageOrder } = req.body; // Expecting an array of image IDs

  try {
    // Update the order of each image individually
    for (let i = 0; i < imageOrder.length; i++) {
      await Images.findByIdAndUpdate(imageOrder[i], { order: i });
    }
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Failed to update image order:", error);
    res.status(500).json({ success: false, message: "Error updating image order" });
  }
});



app.delete("/delete-image/:id", async (req, res) => {
  try {
    const image = await Images.findByIdAndDelete(req.params.id);
    if (!image) {
      return res.status(404).json({ status: "error", message: "Image not found" });
    }
    res.json({ status: "ok", message: "Image deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Route to publish images and save the current order
app.post("/publish-images", async (req, res) => {
  try {
    // Update the `editable` field to false for all images
    await Images.updateMany({}, { $set: { editable: false } });

    // Don't touch the order; it should remain as is
    res.json({ status: "ok", message: "All images published" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: error.message });
  }
});


app.listen(5000, () => {
  console.log("Server Started");
});