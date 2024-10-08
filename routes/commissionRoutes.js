const express = require('express');
const Commission = require('../models/Commission');
const router = express.Router();

// Get all commissions for a supervisor
router.get('/:supervisorId', async (req, res) => {
    try {
        const commissions = await Commission.find({ supervisorId: req.params.supervisorId });
        res.json(commissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new commission entry
router.post('/', async (req, res) => {
    const commission = new Commission(req.body);
    try {
        const newCommission = await commission.save();
        res.status(201).json(newCommission);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;