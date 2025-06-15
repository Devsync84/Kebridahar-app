const express = require('express');
const { Registration, Attendance } = require('../models');
const router = express.Router();
const XLSX = require('xlsx');
const { jsPDF } = require('jspdf');

// Save attendance
router.post('/', async (req, res) => {
    try {
        const { date, registrationIds } = req.body;
        
        // Delete existing records for this date
        await Attendance.deleteMany({ date });
        
        // Create new records
        const records = registrationIds.map(id => ({ 
            registrationId: id, 
            date,
            markedAt: new Date()
        }));
        
        await Attendance.insertMany(records);
        res.status(201).json({ message: 'Attendance saved successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get attendance for date
router.get('/', async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) {
            return res.status(400).json({ error: 'Date parameter is required' });
        }
        
        const attendance = await Attendance.find({ date }).populate('registrationId');
        res.json(attendance);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Export to Excel
router.get('/export/excel', async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) {
            return res.status(400).json({ error: 'Date parameter is required' });
        }
        
        const attendance = await Attendance.find({ date }).populate('registrationId');
        
        // Group by section
        const sections = {};
        attendance.forEach(a => {
            const section = a.registrationId.sectionName;
            if (!sections[section]) sections[section] = [];
            sections[section].push(a);
        });
        
        // Create workbook
        const wb = XLSX.utils.book_new();
        
        // Add worksheet for each section
        Object.entries(sections).forEach(([section, records]) => {
            const data = [
                ["No.", "Household Name", "ID Number", "Kebelle", "Phone", "Marked At"],
                ...records.map((a, i) => [
                    i + 1,
                    a.registrationId.householdName,
                    a.registrationId.idNumber,
                    a.registrationId.kebelle,
                    a.registrationId.phone,
                    new Date(a.markedAt).toLocaleString()
                ])
            ];
            
            const ws = XLSX.utils.aoa_to_sheet(data);
            XLSX.utils.book_append_sheet(wb, ws, section.substring(0, 31));
        });
        
        // Generate buffer
        const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
        
        // Send file
        res.setHeader('Content-Disposition', `attachment; filename=attendance_${date}.xlsx`);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buf);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;