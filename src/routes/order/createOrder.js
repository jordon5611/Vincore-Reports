const Order = require('../../models/Order');
const { BadRequestError } = require("../../../errors")
const vinValidator = require('vin-validator');
const Authentication = require('../../../HelpingFunctions/authentication')
const User = require('../../models/User');

const createOrder = async (req, res, next) => {

    const {
        vin,
        licensePlateNumber,
        firstName,
        lastName,
        email,
        phoneNumber,
        address,
        paymentMethod,
        orderType,
        amount,
    } = req.body;

    // Validate fields (you can add more custom validation here)
    if (!vinValidator.validate(vin)) {
        throw new BadRequestError('Invalid VIN');
    }

        // Create the order in the database
    const newOrder = new Order({
        vin,
        licensePlateNumber,
        firstName,
        lastName,
        email,
        phoneNumber,
        address,
        paymentMethod,
        orderType,
        amount,
    });

    let userId;
    let existingUser

    if (orderType == 'Subscription') {

        const user = await Authentication()(req, res);

        userId = user.userId

        if (!userId) {
            throw new BadRequestError('User is not logged in, So you can not create subscription order')
        }

        existingUser = await User.findById(userId);

        if (!existingUser) {
            throw new BadRequestError('User not found');
        }

        if( existingUser.subscriptionEndDate > new Date()){
            if(existingUser.availableReports == 0){
                throw new BadRequestError('You have reached your subscription report limit, Now you have to buy a new report')
            }
            if(paymentMethod == 'PayPal' || paymentMethod == 'Stripe'){
                throw new BadRequestError('You have already subcription and available report, So you can not buy new report')
            }
            existingUser.availableReports = existingUser.availableReports - 1;

            newOrder.paymentStatus = 'Completed'
            
        }

    }



 

    if (userId) {
        newOrder.userId = userId
    }

    const savedOrder = await newOrder.save();
    await existingUser.save();

    // Return the order details
    return res.status(201).json({
        status: 'success',
        message: 'Order created successfully.',
        order: savedOrder,
    });
};

module.exports = { createOrder };
