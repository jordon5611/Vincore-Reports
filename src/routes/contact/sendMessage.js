//Create New password
const { sendEmail }  = require("../../../middleware/nodeMailer");

const sendMessage = async (req, res) =>{

    const {name, email, message} = req.body;

    const subject = 'Message from User';
    const text = `Name: ${name} \nEmail: ${email} \nMessage: ${message}`;

    await sendEmail(process.env.EMAIL, subject, text);


    res.status(200).json({status:'success', message:'Email sent Successfully'})

}

module.exports = { sendMessage }