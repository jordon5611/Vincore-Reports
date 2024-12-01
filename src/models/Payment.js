const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Order', // Reference to the Order collection
        required: true,
    },
    stripeId: {
        type: String, // Stripe Payment Intent or Session ID
    },
    stripeCustomerId: {
        type: String, // Stripe Customer ID
    },
    paypalId: {
        type: String, // PayPal Payment ID
        
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User collection, optional

    },
    amount: {
        type: Number, // Total payment amount in cents or dollars
        required: true,
    },
    currency: {
        type: String, // Currency code, e.g., 'usd'
        required: true,
        default: 'usd',
    },
    paymentStatus: {
        type: String, // Status of the payment (e.g., 'succeeded', 'pending', 'failed')
        enum: ['paid', 'unpaid'],
        required: true,
    },
    paymentMethod: {
        type: String, // Payment method used (e.g., 'credit_card', 'paypal')
        enum: ['card', 'paypal'],
        required: true,
    }
}, {timestamps: true});


const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
