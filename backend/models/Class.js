const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
    classCode: {
        type:       Number,
        unique:     true,
        required:   true
    },
    hasImage: {
        type:       Boolean,
        unique:     false,
        required:   true
    },
    className: {
        type:       String,
        unique:     false,
        required:   true,
        trim:       true
    },
    instructor: {
        type:       String,
        unique:     false,
        required:   true,
        trim:       true
    },
    duration: {
        type:       Number,
        unique:     false,
        required:   true
    },
    frequency: {
        type:       String,
        unique:     false,
        required:   true,
        trim:       true
    },
    note: {
        type:       String,
        unique:     false,
        required:   false,
        trim:       true
    }
});

const Class = mongoose.model('class', ClassSchema);
module.exports = Class;
