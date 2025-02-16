const Order = require('../../models/Order')

const getOrdersByReportStatus = async (req, res) => {
    const { status } = req.params; // pending, sent

    const orders = await Order.find({ reportSendStatus: status, paymentStatus: 'Completed' });

    if (!orders.length) {
        return res.status(404).json({ message: "No orders found for this status" });
    }

    res.status(200).json({status: 'success', orders});
};


module.exports = { getOrdersByReportStatus }