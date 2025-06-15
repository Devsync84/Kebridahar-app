const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], required: true },
    section: String
});

// Initialize default users
userSchema.statics.initialize = async function() {
    const count = await this.countDocuments();
    if (count === 0) {
        await this.insertMany([
            { username: "admin", password: "15785184", role: "admin" },
            { username: "user01", password: "user01", role: "user", section: "Kebelle 01" },
            { username: "user02", password: "user02", role: "user", section: "Kebelle 02" },
            { username: "user03", password: "user03", role: "user", section: "Kebelle 03" },
            { username: "user04", password: "user04", role: "user", section: "Kebelle 04" },
            { username: "user05", password: "user05", role: "user", section: "Kebelle 05" },
            { username: "user06", password: "user06", role: "user", section: "Kebelle 06" },
            { username: "user07", password: "user07", role: "user", section: "Kebelle 07" },
            { username: "user08", password: "user08", role: "user", section: "Kebelle 08" },
            { username: "user09", password: "user09", role: "user", section: "Kebelle 09" },
            { username: "user10", password: "user10", role: "user", section: "Kebelle 10" },
            { username: "user11", password: "user11", role: "user", section: "Kebelle 11" },
            { username: "user12", password: "user12", role: "user", section: "Kebelle 12" }
        ]);
        console.log('Default users created');
    }
};

module.exports = mongoose.model('User', userSchema);