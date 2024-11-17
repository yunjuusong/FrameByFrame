const mongoose = require("mongoose");

const ImageDetailsScehma = new mongoose.Schema(
  {
  image: { type: String, required: true },
  sequenceName: { type: String, required: true },
  index: { type: Number, required: true },
  },
  {
    collection: "ImageDetails", 
  }
);

mongoose.model("ImageDetails", ImageDetailsScehma);
