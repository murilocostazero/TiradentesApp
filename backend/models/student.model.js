const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const student = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    cpf: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true,
    },
    address: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true,
    },
    guardianName: {
        type: String,
        required: true,
        trim: true,
    },
    guardianContact: {
        type: String,
        required: true,
    },
    behavior: {
        type: String,
        enum: ['Excellent', 'Good', 'Regular', 'Bad', 'Terrible'],
        required: true,
        default: 'Regular'
    },
    positiveObservations: {
        type: [String],
        default: []
    },
    classroom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Classroom'
    },
    photoUrl: { type: String }, // URL da foto do aluno
    createdOn: { type: Date, default: new Date().getTime() },
});

module.exports = mongoose.model('Student', student);