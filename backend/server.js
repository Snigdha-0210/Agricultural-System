const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load Env
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/weather', require('./routes/weatherRoutes'));
app.use('/api/recommendations', require('./routes/recommendationRoutes'));

// MongoDB Connection
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/smart-agri';
mongoose.connect(mongoUri, {
  serverSelectionTimeoutMS: 10000,
  tlsAllowInvalidCertificates: true
}).then(() => {
  console.log('✅ MongoDB Atlas Cluster Connected Successfully!');
}).catch(err => {
  console.error('❌ MongoDB Connection Error:', err.message);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));