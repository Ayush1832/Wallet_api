const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config/config');
const User = require('../models/User');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.emailUser,
        pass: config.emailPassword,
    },
});

const sendVerificationEmail = (user) => {
    const token = jwt.sign({ user: { id: user.id } }, config.jwtSecret);

    const url = `http://localhost:${config.port}/api/auth/verify/${token}`;

    transporter.sendMail({
        to: user.email,
        subject: 'Verify Email',
        html: `Click <a href="${url}">here</a> to verify your email`,
    });
};

exports.signup = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            email,
            password,
        });

        await user.save();
        sendVerificationEmail(user);

        res.status(200).json({ msg: 'User registered, please verify your email' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.verifyEmail = async (req, res) => {
    try {
        const decoded = jwt.verify(req.params.token, config.jwtSecret);
        const user = await User.findById(decoded.user.id);
        if (!user) {
            return res.status(400).json({ msg: 'Invalid token' });
        }

        user.isVerified = true;
        await user.save();

        res.status(200).json({ msg: 'Email verified successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        if (!user.isVerified) {
            return res.status(400).json({ msg: 'Please verify your email first' });
        }

        const payload = {
            user: {
                id: user.id,
            },
        };

        jwt.sign(payload, config.jwtSecret, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
