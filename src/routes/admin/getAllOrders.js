const Order = require('../../models/Order')

const getAllOrders = async (req, res) => {

    const orders = await Order.find();

    res.status(200).json({ status: 'success', orders });
};


module.exports = { getAllOrders }