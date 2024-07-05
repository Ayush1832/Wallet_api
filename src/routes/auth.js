const express = require('express');
const { check, validationResult } = require('express-validator');
const authController = require('../controllers/authController');

const router = express.Router();

router.post(
    '/signup',
[check('email', 'Please include a valid email').isEmail(), check('password', 'Password is required').exists()],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: "Validation Error" });
        }
        authController.signup(req, res);
    }
);

router.get('/verify/:token', authController.verifyEmail);

router.post(
    '/login',
    [check('email', 'Give a valid email').isEmail(), check('password', 'Password is required').exists()],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: "Validation error" });
        }
        authController.login(req, res);
    }
);

module.exports = router;
