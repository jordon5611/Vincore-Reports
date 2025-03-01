const nodemailer = require('nodemailer')
require('dotenv').config();

function sendEmail(to, subject, text) {
  return new Promise((resolve, reject) => {

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'uhcstockstock@gmail.com',
        pass: process.env.EmailPassword,
      },
    });


    let message = {
      from: process.env.EMAILFORMAIL,
      to: to,
      subject: subject,
      text: text,
    };

    transporter.sendMail(message, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        reject(error);
      } else {
        console.log('Email sent: %s', info.messageId);
        resolve(info);
      }
    });
  });
}

module.exports = { sendEmail };