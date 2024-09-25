const express = require('express');
const multer = require('multer');
const { detectPotholes } = require('../controllers/detectControllers'); // Ensure the path is correct
const path = require('path');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads')); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Define the report route for pothole detection
router.post('/report', upload.single('file'), detectPotholes); // Ensure consistency in field name

module.exports = router;
