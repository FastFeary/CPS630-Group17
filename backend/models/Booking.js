const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    classCode: {
        type:     Number,
        required: true
    },
    bookedAt: {
        type:    Date,
        default: Date.now
    }
});

const Booking = mongoose.model('booking', BookingSchema);
module.exports = Booking;
