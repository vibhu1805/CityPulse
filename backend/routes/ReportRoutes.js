const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ dest: '../../uploads' });

router.post('/report', upload.single('file'), async (req, res) => {
  try {
    const { name, email, issue, location } = req.body;
    const image = req.file;

    // Prepare the form data for Django AI backend
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('issue', issue);
    formData.append('location', location);
    formData.append('file', fs.createReadStream(image.path));

    // Send the image and other details to Django
    const djangoResponse = await axios.post('http://localhost:8000/detect/', formData, {
      headers: formData.getHeaders(),
    });

    // Remove the temporary image file
    fs.unlinkSync(image.path);

    // Return the response from Django to the frontend
    res.status(200).json(djangoResponse.data);
  } catch (error) {
    console.error('Error in report submission:', error);
    res.status(500).json({ error: 'Failed to submit report. Please try again.' });
  }
});

module.exports = router;
