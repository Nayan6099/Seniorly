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

console.log('Testing connection with:');
console.log('User:', process.env.EMAIL_USER);
console.log('Pass:', process.env.EMAIL_PASS ? '****' + process.env.EMAIL_PASS.slice(-4) : 'MISSING');

transporter.verify((error, success) => {
  if (error) {
    console.error('Connection error:', error);
  } else {
    console.log('Server is ready to take our messages');
  }
  process.exit();
});
