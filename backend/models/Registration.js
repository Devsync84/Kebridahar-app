const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    sectionName: { type: String, required: true },
    householdName: { type: String, required: true },
    gender: { type: String, required: true },
    city: { type: String, default: "Kebridahar" },
    kebelle: { type: String, required: true },
    idNumber: { type: String, required: true },
    phone: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: String, required: true }
});

module.exports = mongoose.model('Registration', registrationSchema);
