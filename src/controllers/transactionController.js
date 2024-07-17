
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const transferFunds = async (req, res) => {
  const { recipientEmail, amount } = req.body;

  const sender = await User.findById(req.user._id);
  const recipient = await User.findOne({ email: recipientEmail });

  if (!recipient) {
    return res.status(404).json({ message: 'Recipient not found' });
  }

  if (sender.balance < amount) {
    const transaction = await Transaction.create({
      sender: req.user._id,
      recipient: recipient._id,
      amount,
      status: 'failed',
    });
    return res.status(400).json({ message: 'Insufficient funds' });
  }

  sender.balance -= amount;
  recipient.balance += amount;

  await sender.save();
  await recipient.save();

  const transaction = await Transaction.create({
    sender: req.user._id,
    recipient: recipient._id,
    amount,
    status: 'success',
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: req.user.email,
    subject: 'Transaction Success',
    text: `You have successfully transferred ${amount} to ${recipientEmail}.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  res.json({ message: 'Transfer successful', transaction });
};

export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ sender: req.user._id }).populate('recipient', 'email');
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
