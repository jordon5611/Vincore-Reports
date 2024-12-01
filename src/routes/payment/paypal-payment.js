// routes/payment.js
const express = require('express');
const router = express.Router();
const paypal = require('../../../paypal');
const Payment = require('../../models/Payment');
const Order = require('../../models/Order');
const { NotFoundError } = require("../../../errors")

router.get('/paypal/create-payment/:orderId', async (req, res) => {

    const { orderId } = req.params

    const order = await Order.findById(orderId);

    if (!order) {
        throw new NotFoundError('Order not found');
    }

    const create_payment_json = {
        intent: 'sale',
        payer: { payment_method: 'paypal' },
        redirect_urls: {
            return_url: `${process.env.BASE_URL}/payment/paypal/success?orderId=${orderId}`,
            cancel_url: `${process.env.BASE_URL}/payment/paypal/cancel`,
        },
        transactions: [{
            amount: { currency: 'USD', total: order.amount.toFixed(2).toString() },
            description: `This is the report payment for vehicle. Vin number is ${order.vin}, license plate number is ${order.licensePlateNumber} and email of user is ${order.email}`,
        }],
        application_context: {
            shipping_preference: 'NO_SHIPPING', // Removes shipping section
            landing_page: 'BILLING',           // Removes Pay Later options
        },
    };

    paypal.payment.create(create_payment_json, (error, payment) => {
        if (error) {
            console.error(error);
            console.error('Error details:', error.response.details);
            res.status(500).send('Error creating payment');
        } else {
            const approvalUrl = payment.links.find(link => link.rel === 'approval_url').href;
            res.status(201).json({ status: 'success', url: approvalUrl });
        }
    });
});



router.get('/paypal/success', async (req, res) => { // Success
    const { paymentId, PayerID, orderId } = req.query;

    const execute_payment_json = {
        payer_id: PayerID,
    };

    console.log(orderId);
    console.log(paymentId);
    console.log(PayerID);

    paypal.payment.execute(paymentId, execute_payment_json, async (error, payment) => {
        if (error) {
            console.error(error.response);
            res.status(500).send('Payment execution failed');
        } else {
            console.log('Payment executed successfully: ', payment);

            const order = await Order.findById(orderId);

            if (!order) {
                throw new NotFoundError('Order not found');
            }

            //create a payment record
            const paymentData = {
                orderId: orderId, // Optional if orderId exists
                paypalId: payment.id,
                amount: payment.transactions[0].amount.total / 100, // Convert to dollars
                paymentStatus: 'paid', // 'paid', 'unpaid', etc.
                paymentMethod: 'paypal', // 'card', 'bank_transfer', etc.
            };

            order.paymentStatus = 'Completed';
            await order.save();

            const paymentcreated = new Payment(paymentData);
            await paymentcreated.save();

            res.redirect(`https://vin-core.vercel.app?status=success`);
        }
    });
});

router.get('/paypal/cancel', (req, res) => { // Cancel
    res.redirect(`https://vin-core.vercel.app?status=cancel`);
});


module.exports = router;