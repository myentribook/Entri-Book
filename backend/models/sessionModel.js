const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
    mobileNumber: {
        type: String,
        required: true,
        unique: true
    },
    lastMessageAt: {
        type: Date,
        default: Date.now,
        expires: 600   // Delete after 10 minutes
    }
});

module.exports = mongoose.model("Session", sessionSchema);