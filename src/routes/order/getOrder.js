
const Order = require('../../models/Order'); // Adjust the path as per your directory structure
const { NotFoundError } = require("../../../errors")


// Get order by orderId

const getOrder = async (req, res) => {

        const { orderId } = req.params;

        // Find the order by its ID
        const order = await Order.findById(orderId)

        if (!order) {
            throw new NotFoundError('Order not found' );
        }

        // Respond with the order details
        res.status(200).json({
            status: 'success',
            order,
        });

};

module.exports = { getOrder };
