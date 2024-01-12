// Import required modules
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/pinterestclone");

// Define the schema for a user
const userSchema = mongoose.Schema({
    // User's username
    username: String,
    // User's full name
    name: String,
    // User's email address
    email: String,
    // User's password (hashed and managed by passport-local-mongoose)
    password: String,
    // Path to the user's profile image
    profileImage: String,
    // User's contact number
    contact: Number,
    // Array to store user's boards (default to an empty array)
    board: {
        type: Array,
        default: []
    },
    // Array of references to posts associated with the user
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "post"
        }
    ]
});

// Enhance the user schema with passport-local-mongoose
userSchema.plugin(passportLocalMongoose);

// Create and export the Mongoose model for the 'user' schema
module.exports = mongoose.model("user", userSchema);
