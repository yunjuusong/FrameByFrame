// imageDetails.js


// server.js
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const fs = require('fs');
app.use(express.json());
const cors = require("cors");
app.use(cors());

//mongodb connection
const mongoUrl = "mongodb+srv://vuhachau2412:framebyframe@framebyframe.yczau.mongodb.net/?retryWrites=true&w=majority&appName=framebyframe"

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

// Configure multer for memory storage instead of disk
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
        contentType: req.file.mimetype,
      },
      editable: true,
      draggable: true,
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
    const images = await Images.find({}, 'name _id editable');  // Ensure to select 'editable'
    console.log(images); // Log the full result here
    res.json({ status: "ok", data: images });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.listen(5000, () => {
  console.log("Server Started");
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

app.post("/publish-images", async (req, res) => {
  try {
    await Images.updateMany({}, { $set: { editable: false, draggable: false } });
    res.json({ status: "ok", message: "All images published" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: error.message });
  }
});