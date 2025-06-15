const express = require('express');
const Registration = require('../models/Registration');
const router = express.Router();

// Get all registrations
router.get('/', async (req, res) => {
    try {
        const { section } = req.query;
        let query = {};
        
        if (section && section !== 'all') {
            query.sectionName = section;
        }
        
        const registrations = await Registration.find(query).sort({ createdAt: -1 });
        res.json(registrations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create new registration
router.post('/', async (req, res) => {
    try {
        const newRegistration = new Registration(req.body);
        await newRegistration.save();
        res.status(201).json(newRegistration);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update registration
router.put('/:id', async (req, res) => {
    try {
        const updatedRegistration = await Registration.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedRegistration);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete registration
router.delete('/:id', async (req, res) => {
    try {
        await Registration.findByIdAndDelete(req.params.id);
        res.json({ message: 'Registration deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
