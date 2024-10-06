const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const order = new Schema({
    id: { type: ObjectId },
    order_date: { type: Date, default: Date.now },
    user: { type: ObjectId, ref: 'user' }
});

module.exports = mongoose.models.order || mongoose.model('order', order);