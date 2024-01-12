// Import the Mongoose library
const mongoose = require('mongoose');

// Define the schema for a post
const postSchema = mongoose.Schema({
    // Reference to the user who created the post using their ObjectId
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"  // Assuming there is a "user" model in the application
    },
    // Title of the post
    title: String,
    // Description or content of the post
    description: String,
    // Filename or path to the image associated with the post
    image: String
});

// Create and export the Mongoose model for the 'post' schema
module.exports = mongoose.model("post", postSchema);
