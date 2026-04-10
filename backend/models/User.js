const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type:     String,
        required: true
    },
    passwordHash: {
        type:    String,
        required: true
    },
    permission: {
        type: String,
        default: 'basic'
    }
});

const User = mongoose.model('user', UserSchema);
module.exports = User;
