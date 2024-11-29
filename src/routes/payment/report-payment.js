// process.env.
const express = require('express')
const stripe = require('stripe')(process.env.STRIPE_KEY);
const CreateReportSession = express.Router()

CreateReportSession.get('/create-report-payment', async (req, res) => {

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            { 
                price: 'price_1QQYYMSAcbxN0glnzCeVJeY2', // Get this from Stripe Dashboard
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${process.env.BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.BASE_URL}/cancel`
    });

    console.log(session);

    res.redirect(303, session.url);

});

module.exports = CreateReportSession
