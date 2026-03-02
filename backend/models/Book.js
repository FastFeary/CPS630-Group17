const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    isbn: {
        type:       Number,
        unique:     true,
        required:   true
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