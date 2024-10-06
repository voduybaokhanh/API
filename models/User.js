const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const user = new Schema({
    id: { type: ObjectId },
    name: { type: String },
    password: { type: String },
    email: { type: String },
});

module.exports = mongoose.models.user || mongoose.model('user', user);