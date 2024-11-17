const mongoose = require("mongoose");

const ImageDetailsSchema = new mongoose.Schema(
  {
    name: String,
    image: {
      data: Buffer,
      contentType: String
    }
  },
  {
    collection: "ImageDetails",
  }
);

mongoose.model("ImageDetails", ImageDetailsSchema);