const Order = require('../../models/Order')

const getOrdersByPaymentStatus = async (req, res) => {
    const { status } = req.params; // pending, paid, failed

    const orders = await Order.find({ paymentStatus: status });

    if (!orders.length) {
        return res.status(404).json({ message: "No orders found for this status" });
    }

    res.status(200).json({ status: 'success', orders });
};


module.exports = { getOrdersByPaymentStatus }