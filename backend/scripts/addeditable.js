const mongoose = require("mongoose");
const Images = require("../imageDetails");  // Ensure this path is correct

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
      // Update all images where 'editable' field does not exist
      const result = await Images.updateMany(
        { editable: { $exists: false } }, // Find documents missing 'editable' field
        { $set: { editable: false } }     // Set default value for 'editable'
      );
      console.log(`Updated ${result.nModified} documents.`);  // Output how many documents were modified
    } catch (error) {
      console.error("Error updating images:", error);
    }

    // Close the database connection after the update
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });
