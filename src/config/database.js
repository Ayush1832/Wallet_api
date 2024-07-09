require('dotenv').config();
const mongoose = require('mongoose');
const config = require('./config');
const db = mongoose.connection;

const mongoUrl = 'mongodb://127.0.0.1:27017/wallet';


if (!mongoUrl) {
    throw new Error('MONGODB_URI is not defined in the environment variables');
  }

  mongoose.connect(mongoUrl).then(() => {
    console.log('Connected to MongoDB');
  }).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

module.exports = db;
