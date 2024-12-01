const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    vin: {
        type: String,
        required: true,
        minlength: 17,
        maxlength: 17,
    },
    licensePlateNumber: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    address: {
        country: { type: String, required: true },
        state: { type: String, required: true },
        fullAddress: { type: String, required: true },
        city: { type: String, required: true },
        zipCode: { type: String },
    },
    paymentMethod: {
        type: String,
        enum: ['Stripe', 'PayPal'],
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending',
    },
    orderType: {
        type: String,
        enum: ['One-time', 'Subscription'],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
}, {timestamps: true}
);

module.exports = mongoose.model('Order', OrderSchema);
