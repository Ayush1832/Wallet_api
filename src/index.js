import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js'; // Add .js extension
import transactionRoutes from './routes/transactionRoutes.js'; // Add .js extension

dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);


const mongoUrl = 'mongodb://127.0.0.1:27017/wallet';

if (!mongoUrl) {
    throw new Error('MONGODB_URI is not defined in the environment variables');
  }

  mongoose.connect(mongoUrl).then(() => {
    console.log('Connected to MongoDB');
  }).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
