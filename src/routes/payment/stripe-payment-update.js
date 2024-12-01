
const express = require('express')
const stripe = require('stripe')(process.env.STRIPE_KEY);
const UpdateSubscription = express.Router()
const Authentication = require('../../../middleware/authentication')
const User = require('../../models/User');

const { NotFoundError, BadRequestError } = require("../../../errors")

UpdateSubscription.get('/customers/:customer_id',Authentication, async (req, res) => {

    //Check User

    const {userId} = req.user

    const user = await User.findById(userId)

    if(!user){
        throw new NotFoundError('User not found')
    }

    if(user.subscription == false){
        throw new BadRequestError('You have not subscribed to any plan')
    }

    const customerId = user.stripeCustomerId

    //const customer_id = req.params.customer_id


    const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${process.env.BASE_URL}/`,
    })

    res.redirect(303, session.url);
    res.status(200).json({status:'success', url: session.url});

})


const StripeWebhook = express.Router()

StripeWebhook.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {

    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET_KEY);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

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

            const subsCancelled = subscription.cancellation_details.reason;
            if (subsCancelled) {
                // Perform any necessary actions when the subscription is cancelled

                const customerId = subscription.customer;
                const user = await User.findOne({ stripeCustomerId: customerId });

                if (user) {
                    user.subscription = false;
                    await user.save();
                }
                console.log('Subscription cancelled');
            }else{
                const customerId = subscription.customer;
                const user = await User.findOne({ stripeCustomerId: customerId });

                if (user) {
                    user.subscription = true;
                    user.subscriptionStartDate = session.current_period_start;
                    user.subscriptionEndDate = session.current_period_end;
                    await user.save();
                }
            }
            break;

        case 'customer.updated':
            const customer = event.data.object;
            console.log('Customer updated:', customer);
            // Perform any necessary actions with the customer data

            const customerId = customer.id;

            const user = await User.findOne({ stripeCustomerId: customerId })

            const email = customer.email;
            const name = customer.name;
            const phone = customer.phone;
            const city = customer.address.city;
            const country = customer.address.country;
            const postalCode = customer.address.postal_code;
            const address = customer.address.line1;
            const state = customer.address.state;

            const nameParts = name.split(' ');
            const firstName = nameParts[0];
            const lastName = nameParts.slice(1).join(' ');

            if (user) {

                user.email = email;
                user.fname = firstName;
                user.lname = lastName;
                user.phone = phone;
                user.address = address;
                user.city = city;
                user.state = state;
                user.country = country;
                user.postalCode = postalCode;

                await user.save()

            }

            break;
        default:
            console.log(`Unhandled event type: ${event.type}`);
            break;
    }

    res.send();

});


module.exports = { UpdateSubscription, StripeWebhook }