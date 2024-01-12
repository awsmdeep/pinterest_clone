// Import required modules
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

// Define storage configuration for multer
const storage = multer.diskStorage({
  // Set the destination folder for uploaded files
  destination: function (req, file, cb) {
    cb(null, './public/images/uploads');
  },
  // Define the filename for the uploaded file
  filename: function (req, file, cb) {
    // Generate a unique identifier using UUID
    const unique = uuidv4();
    // Set the filename to a combination of unique identifier and original file extension
    cb(null, unique + path.extname(file.originalname));
  }
});

// Create a multer instance with the defined storage configuration
const upload = multer({ storage: storage });

// Export the configured multer instance for use in other modules
module.exports = upload;
