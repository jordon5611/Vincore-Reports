const Order = require('../../models/Order')
const { sendEmail } = require("../../../middleware/nodeMailer");


const sendReport = async (req, res) => {

    const { orderId } = req.params;
    const { pdfUrl } = req.body;

    // Validate if order exists
    const order = await Order.findById(orderId);
    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }

    // Save PDF URL in order
    order.pdfUrl = pdfUrl;
    order.reportSendStatus = 'sent';
    await order.save();

    // Send email with PDF URL
    const subject = `Your Vehicle Report - Order ID: ${orderId}`;
    const text = `Dear ${order.firstName},\n\nYour vehicle report is ready! You can download it from the link below:\n\n${pdfUrl}\n\nThank you!`;

    await sendEmail(order.email, subject, text);

    res.status(200).json({ message: "Report sent successfully." });

};


module.exports = { sendReport }