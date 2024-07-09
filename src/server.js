require('dotenv').config();
const app = require('./app');
const config = require('./config/config');
const express = require('express');
const mongoose = require('./config/database');




app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
});
