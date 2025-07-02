const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['personal', 'work', 'family', 'other'],
        default: 'personal',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
