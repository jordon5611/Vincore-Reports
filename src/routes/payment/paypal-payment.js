// routes/payment.js
const express = require('express');
const router = express.Router();
const paypal = require('../../../paypal');

router.get('/paypal/create-payment', (req, res) => {
    const create_payment_json = {
        intent: 'sale',
        payer: { payment_method: 'paypal' },
        redirect_urls: {
            return_url: 'http://localhost:4000/payment/paypal/success',
            cancel_url: 'http://localhost:4000/payment/paypal/cancel',
        },
        transactions: [{
            amount: { currency: 'USD', total: '10.00' },
            description: 'This is the payment description.',
        }],
    };

    paypal.payment.create(create_payment_json, (error, payment) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error creating payment');
        } else {
            const approvalUrl = payment.links.find(link => link.rel === 'approval_url').href;
            res.redirect(303, approvalUrl);
        }
    });
});

router.get('/paypal/success', (req, res) => { // Success
    const { paymentId, PayerID } = req.query;

    const execute_payment_json = {
        payer_id: PayerID,
    };

    paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
        if (error) {
            console.error(error.response);
            res.status(500).send('Payment execution failed');
        } else {
            res.status(200).send('Payment Successful!');
        }
    });
});

router.get('/paypal/cancel', (req, res) => { // Cancel
    res.status(200).send('Payment Cancelled');
});


module.exports = router;