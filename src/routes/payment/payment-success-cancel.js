const express = require('express')
const stripe = require('stripe')(process.env.STRIPE_KEY);
const SessionStatus = express.Router()

SessionStatus.get('/success', async (req, res) => {
    const sessionId = req.query.session_id;
    const session = await stripe.checkout.sessions.retrieve(sessionId, {expand: ['subscription']});
    console.log(JSON.stringify(session));
    res.send('Success! The payment was successful.');
});

SessionStatus.get('/cancel', async (req, res) => {
    res.redirect(`${process.env.BASE_URL}/`);
});

module.exports = SessionStatus