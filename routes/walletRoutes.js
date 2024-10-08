const express = require('express');
const WalletTransaction = require('../models/Wallet');
const router = express.Router();

// Get all wallet transactions for a supervisor
router.get('/:supervisorId', async (req, res) => {
    try {
        const transactions = await WalletTransaction.find({ supervisorId: req.params.supervisorId });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new wallet transaction
router.post('/', async (req, res) => {
    const transaction = new WalletTransaction(req.body);
    try {
        const newTransaction = await transaction.save();
        res.status(201).json(newTransaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;