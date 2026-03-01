const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    isbn: {
        type:       String,
        unique:     true,
        required:   true,
        trim:       true
    },
    hasImage: {
        type:       Boolean,
        unique:     false,
        required:   true
    },
    title: {
        type:       String,
        unique:     false,
        required:   true,
        trim:       true
    },
    author: {
        type:       String,
        unique:     false,
        required:   true,
        trim:       true
    },
    year: {
        type:       Number,
        unique:     false,
        required:   true
    },
    note: {
        type:       String,
        unique:     false,
        required:   false,
        trim:       true
    }
});

const Book = mongoose.model('book', BookSchema);
module.exports = Book;