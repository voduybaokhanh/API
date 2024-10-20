const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const vacine = new Schema({
    id: { type: ObjectId },
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 50,
        default: 'No name'
    },
    national: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50,
        default: 'No name'
    },
    price: { type: Number, required: true },
});

module.exports = mongoose.models.vacine || mongoose.model('vacine', vacine);