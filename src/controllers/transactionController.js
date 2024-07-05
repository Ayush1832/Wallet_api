const User = require('../models/User');
const Transaction = require('/models/Transaction');
const nodemailer = require('nodemailer');
const config = require('../config/config');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.emailUser,
        pass: config.emailPassword,
    },
});

const sendTransactionEmail = (user, status) => {
    const subject = status === 'success' ? 'Transaction Successful' : 'Transaction Failed';
    const message = status === 'success' ? 'Your transaction was successful' : 'Your transaction failed';

    transporter.sendMail({
        to: user.email,
        subject,
        text: message,
    });
};

exports.transfer = async (req, res) => {
    const { to, amount } = req.body;

    try {
        const fromUser = await User.findById(req.user.id);
        const toUser = await User.findById(to);

        if (!toUser) {
            return res.status(400).json({ msg: 'Recipient not found' });
        }

        if (fromUser.balance < amount) {
            sendTransactionEmail(fromUser, 'failure');
            return res.status(400).json({ msg: 'Insufficient balance' });
        }

        fromUser.balance -= amount;
        toUser.balance += amount;

        await fromUser.save();
        await toUser.save();

        const transaction = new Transaction({
            from: fromUser.id,
            to: toUser.id,
            amount,
        });

        await transaction.save();

        sendTransactionEmail(fromUser, 'success');
        res.status(200).json({ msg: 'Transaction successful' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ from: req.user.id }).populate('to', 'email');

        res.status(200).json(transactions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
