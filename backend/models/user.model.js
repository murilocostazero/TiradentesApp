const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String },
    rank: { type: String },
    email: { type: String },
    password: { type: String },
    createdOn: { type: Date, default: new Date().getTime() },
    lastSelectedSchool: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School'
    }
});

module.exports = mongoose.model('User', userSchema);