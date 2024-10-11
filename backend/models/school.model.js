const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schoolSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    address: {
        type: String,
        required: true,
        trim: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
    },
    team: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Referencia ao schema User
    }],
    createdOn: { type: Date, default: new Date().getTime() },
    active: {
        type: Boolean,
        default: true, // A escola está ativa por padrão
    }
});

module.exports = mongoose.model('School', schoolSchema);
