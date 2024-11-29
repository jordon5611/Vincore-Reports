
const express = require('express')
const stripe = require('stripe')(process.env.STRIPE_KEY);
const CreateSubscriptionSession = express.Router()


CreateSubscriptionSession.get('/create-subscription-session', async (req, res) => {

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price: 'price_1QQRwKSAcbxN0glnMxl6zFgh', // Get this from Stripe Dashboard
                quantity: 1,
            },
        ],
        mode: 'subscription',
        success_url: `${process.env.BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`, //'http://your-frontend-domain.com/success
        cancel_url: `${process.env.BASE_URL}/cancel`        //'http://your-frontend-domain.com/cancel',
    });

    console.log(session)

    res.redirect(303, session.url);

});




module.exports = CreateSubscriptionSession