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
      default: true,
    },
  },
  {
    collection: "ImageDetails",
  }
);

mongoose.model("ImageDetails", ImageDetailsSchema);