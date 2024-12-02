const express = require('express')
const stripe = require('stripe')(process.env.STRIPE_KEY);
const SessionStatus = express.Router()
const Payment = require('../../models/Payment');
const Order = require('../../models/Order');
const User = require('../../models/User');
//Errors
const { NotFoundError } = require("../../../errors")

SessionStatus.get('/success', async (req, res) => {
    const { orderId } = req.query;
    const sessionId = req.query.session_id;
    const session = await stripe.checkout.sessions.retrieve(sessionId, {expand: ['subscription']});
    //console.log(JSON.stringify(session));

    const order = await Order.findById(orderId);

    if (!order) {
        throw new NotFoundError('Order not found' );
    }

    //create a payment record
    const paymentData = {
        orderId: orderId , // Optional if orderId exists
        stripeId: session.id,
        stripeCustomerId: session.customer, // Customer ID from Stripe
        userId: order.userId || null, // Optional userId if logged in
        amount: session.amount_total / 100, // Convert to dollars
        currency: session.currency,
        paymentStatus: session.payment_status, // 'paid', 'unpaid', etc.
        paymentMethod: 'card', // 'card', 'bank_transfer', etc.
    };

    order.paymentStatus = 'Completed';
    await order.save();

    if( order.orderType == 'Subscription' && order.userId ) {
        const user = await User.findById(order.userId);
        if(user){
            user.subscription = true;
            user.stripeCustomerId = session.customer;
            user.availableReports += 5;
            // Access subscription period start and end from the expanded subscription object
            if (session.subscription && session.subscription.current_period_start && session.subscription.current_period_end) {
                user.subscriptionStartDate = new Date(session.subscription.current_period_start * 1000); // Convert to JavaScript Date
                user.subscriptionEndDate = new Date(session.subscription.current_period_end * 1000);   // Convert to JavaScript Date
            } else {
                //console.log("Subscription details are missing in the session.");
            }
            await user.save();
        }

    }
    const payment = new Payment(paymentData);
    await payment.save();


    res.redirect(`https://vin-core.vercel.app?status=success`);
});

SessionStatus.get('/cancel', async (req, res) => {
    res.redirect(`https://vin-core.vercel.app?status=cancel`);
});

module.exports = SessionStatus