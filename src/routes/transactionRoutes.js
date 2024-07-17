import express from 'express';
import { transferFunds, getTransactions } from '../controllers/transactionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/transfer', protect, transferFunds);
router.get('/transactions', protect, getTransactions);

export default router;
