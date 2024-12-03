// imageDetails.js
const mongoose = require("mongoose");

const ImageDetailsSchema = new mongoose.Schema(
  {
    name: String,
    image: {
      data: Buffer,
      contentType: String
    },
    editable: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "ImageDetails",
  }
);

const Images = mongoose.model("ImageDetails", ImageDetailsSchema);

module.exports = Images;  // Export the model
