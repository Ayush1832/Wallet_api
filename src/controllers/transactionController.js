import User from '../models/User.js'; 
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
    return res.status(400).json({ message: 'Insufficient funds' });
  }

  sender.balance -= amount;
  recipient.balance += amount;

  await sender.save();
  await recipient.save();

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

  res.json({ message: 'Transfer successful' });
};

export const getTransactions = async (req, res) => {
  // Assuming transactions are recorded elsewhere or use MongoDB for simplicity
  const transactions = [
    // Dummy transaction data
    { id: 1, sender: 'user1@example.com', recipient: 'user2@example.com', amount: 100, status: 'success' },
    { id: 2, sender: 'user1@example.com', recipient: 'user3@example.com', amount: 200, status: 'failed' },
  ];

  res.json(transactions);
};
