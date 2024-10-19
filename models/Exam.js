const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const exam = new Schema({
    id: { type: ObjectId },
    code: { type: String },
    link: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 255
    },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.models.exam || mongoose.model('exam', exam);
// exam -----> exams