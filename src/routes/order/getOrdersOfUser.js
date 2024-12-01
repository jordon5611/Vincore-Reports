const Order = require('../../models/Order'); // Adjust the path as per your directory structure
const { NotFoundError } = require("../../../errors");

// Get all orders of a user by userId
const getOrdersOfUser = async (req, res) => {
    const { userId } = req.params; // Assuming userId is passed as a URL parameter

    // Find all orders associated with the user
    const orders = await Order.find({ userId });

    if (!orders || orders.length === 0) {
        throw new NotFoundError('No orders found for this user');
    }

    // Respond with the orders details
    res.status(200).json({
        status: 'success',
        orders,
    });
};

module.exports = { getOrdersOfUser };
