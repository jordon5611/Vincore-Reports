// process.env.
const express = require('express')
const stripe = require('stripe')(process.env.STRIPE_KEY);
const CreateReportSession = express.Router()

const Order = require('../../models/Order');
const { NotFoundError, BadRequestError } = require("../../../errors")

CreateReportSession.get('/create-report-payment/:orderId', async (req, res) => {

    const { orderId } = req.params

    const order = await Order.findById(orderId);

    if (order.orderType == 'Subscription') {
        throw new BadRequestError('This is not a Subscription order');
    }

    if (!order) {
        throw new NotFoundError('Order not found');
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price: 'price_1QQYYMSAcbxN0glnzCeVJeY2', // Get this from Stripe Dashboard
                quantity: 1,
            },
        ],

        mode: 'payment',
        success_url: `${process.env.BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}&orderId=${orderId}`,
        cancel_url: `${process.env.BASE_URL}/cancel`
    });

    //console.log(session);

    res.status(201).json({ status: 'success', url: session.url });

});

module.exports = CreateReportSession
