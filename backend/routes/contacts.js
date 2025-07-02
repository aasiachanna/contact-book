const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Contact = require('../models/Contact');

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Invalid token' });
        req.userId = decoded.userId;
        next();
    });
};

// Get all contacts
router.get('/', verifyToken, async (req, res) => {
    try {
        const contacts = await Contact.find({ user: req.userId });
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create contact
router.post('/', verifyToken, async (req, res) => {
    try {
        const contact = new Contact({
            ...req.body,
            user: req.userId
        });
        await contact.save();
        res.status(201).json(contact);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update contact
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const contact = await Contact.findOne({
            _id: req.params.id,
            user: req.userId
        });
        
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        Object.assign(contact, req.body);
        await contact.save();
        res.json(contact);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete contact
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const contact = await Contact.findOne({
            _id: req.params.id,
            user: req.userId
        });
        
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        await contact.deleteOne();
        res.json({ message: 'Contact deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
