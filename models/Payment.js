const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const payment = new Schema({
    id: { type: ObjectId },
    payment_date: { type: Date, default: Date.now },
    payment_method: { type: String },
    payment_status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    order: { type: ObjectId, ref: 'order' },
});

module.exports = mongoose.models.payment || mongoose.model('payment', payment);