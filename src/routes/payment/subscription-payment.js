
const express = require('express')
const stripe = require('stripe')(process.env.STRIPE_KEY);
const CreateSubscriptionSession = express.Router()

const Order = require('../../models/Order');
const { NotFoundError, BadRequestError } = require("../../../errors")

CreateSubscriptionSession.get('/create-subscription-session/:orderId', async (req, res) => {

    const { orderId } = req.params

    const order = await Order.findById(orderId);

    if (!order) {
        throw new NotFoundError('Order not found');
    }

    if (order.orderType == 'One-time') {
        throw new BadRequestError('This is not a one-time order');
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price: 'price_1QQRwKSAcbxN0glnMxl6zFgh', // Get this from Stripe Dashboard
                quantity: 1,
            },
        ],
        mode: 'subscription',
        success_url: `${process.env.BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}&orderId=${orderId}`, //'http://your-frontend-domain.com/success
        cancel_url: `${process.env.BASE_URL}/cancel`        //'http://your-frontend-domain.com/cancel',
    });

    //console.log(session)

    res.redirect(303, session.url);

});




module.exports = CreateSubscriptionSession