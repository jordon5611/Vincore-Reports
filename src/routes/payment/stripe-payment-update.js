
const express = require('express')
const stripe = require('stripe')(process.env.STRIPE_KEY);
const UpdateSubscription = express.Router()

UpdateSubscription.get('/customers/:customer_id', async (req, res) => {

    //Check User

    const session = await stripe.billingPortal.sessions.create({
        customer: req.params.customer_id,
        return_url: `${process.env.BASE_URL}/`,
    })

    res.redirect(303, session.url);

})


const StripeWebhook = express.Router()

StripeWebhook.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
    const payload = req.body;
    const sig = req.headers['stripe-signature'];
    const endpointSecret = 'your-webhook-signing-secret';

    const event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET_KEY);

    // Handle different event types

    switch (event.type) {
        case 'checkout.session.completed':
            const checkoutSession = event.data.object;
            console.log('Payment successful:', checkoutSession);
            // Perform any necessary actions with the checkout session data
            
            break;
        
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log('Payment successful:', paymentIntent);
            // Perform any necessary actions with the payment intent data
            
            break;

        case 'customer.subscription.updated':
            const subscription = event.data.object;
            console.log('Subscription updated:', subscription);
            // Perform any necessary actions with the subscription data
    
        default:
            console.log(`Unhandled event type: ${event.type}`);
            break;
    }
    if (event.type === 'checkout.session.completed') {
        console.log('Payment successful:', event.data.object);
    }

    if (event.type === 'payment_intent.succeeded') {
        console.log('Payment successful:', event.data.object);
    }

    if (event.type === 'customer.subscription.updated') {
        console.log('Payment successful:', event.data.object);
    }

    res.send();

});


module.exports = UpdateSubscription, StripeWebhook