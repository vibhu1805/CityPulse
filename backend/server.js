const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const reportRouter = require('./routes/report');  // Route for report handling
const authRouter = require('./routes/Auth');      // Importing authentication routes
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());  // Enable CORS for all routes
app.use(bodyParser.json());  // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));  // Parse URL-encoded bodies

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Use authentication routes
app.use('/auth', authRouter);  // Use the authRouter for both signup and login routes
app.use('/report', reportRouter);  // Endpoint for report routes

const PORT = process.env.PORT || 5000;
process.emitWarning = (warning) => {
    if (warning.message.includes("DEP0044")) return; // Suppress util.isArray warning
    console.warn(warning);
};

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
