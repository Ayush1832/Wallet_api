require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transactions');



const app = express();

app.use(bodyParser.json());
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

module.exports = app;
