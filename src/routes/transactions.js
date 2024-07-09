const express = require('express');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const transactionController = require('../controllers/transactionController');
const Transaction = require('../models/Transaction');


const router = express.Router();

router.post(
    '/transfer',
    [
        auth,
        check('to', 'Recipient is required').not().isEmpty(),
        check('amount', 'Amount is required').isNumeric(),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        transactionController.transfer(req, res);
    }
);

router.get('/transactions', auth, transactionController.getTransactions);

module.exports = router;
