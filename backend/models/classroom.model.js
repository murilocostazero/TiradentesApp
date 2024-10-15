const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const classroom = new Schema({
    shift: {
        type: String,
        enum: ['morning', 'afternoon'], // Matutino ou Vespertino
        required: true
    },
    grade: {
        type: String,
        required: true
    },
    className: {
        type: String,
        required: true
    },
    school: {
        type: Schema.Types.ObjectId,
        ref: 'School',
        required: true
    },
    totalStudents: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Classroom', classroom);