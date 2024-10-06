const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const orderitem = new Schema({
    id: { type: ObjectId },
    quantity: { type: Number },
    price: { type: Number },
    order: { type: ObjectId, ref: 'order' },
    product: { type: ObjectId, ref: 'product' },
});

module.exports = mongoose.models.orderitem || mongoose.model('orderitem', orderitem);