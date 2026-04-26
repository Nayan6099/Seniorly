const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const mailOptions = {
  from: `"Seniorly Test" <${process.env.EMAIL_USER}>`,
  to: process.env.EMAIL_USER, // Sending to yourself for testing
  subject: 'Seniorly Email Test - ' + new Date().toLocaleString(),
  text: 'If you are reading this, your email configuration is working perfectly!',
  html: '<b>If you are reading this, your email configuration is working perfectly!</b>',
};

console.log('Sending test email...');
console.log('From:', process.env.EMAIL_USER);
console.log('To:', process.env.EMAIL_USER);

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Error sending email:', error);
  } else {
    console.log('Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
  }
  process.exit();
});
