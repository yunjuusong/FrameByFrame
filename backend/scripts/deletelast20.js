const mongoose = require("mongoose");
const Images = require("../imageDetails"); // Ensure this path is correct

// MongoDB connection URL
const mongoUrl = "mongodb+srv://vuhachau2412:framebyframe@framebyframe.yczau.mongodb.net/?retryWrites=true&w=majority&appName=framebyframe";

// Connect to MongoDB
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    console.log("Connected to the database.");

    try {
      // Fetch the first 30 images sorted by their creation date (or another suitable field)
      const imagesToDelete = await Images.find({})
        .sort({ createdAt: 1 }) // Sort by creation date in ascending order
        .limit(30);             // Limit the result to the first 30 images

      if (imagesToDelete.length === 0) {
        console.log("No images found to delete.");
      } else {
        // Delete the selected images
        const deleteResult = await Images.deleteMany({
          _id: { $in: imagesToDelete.map(image => image._id) },
        });
        console.log(`Deleted ${deleteResult.deletedCount} images.`);
      }
    } catch (error) {
      console.error("Error deleting images:", error);
    }

    // Close the database connection after the operation
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });
