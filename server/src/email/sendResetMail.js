const sgMail = require("@sendgrid/mail");
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendResetMali = async (resetToken, toEmail, host) => {
    const msg = {
      to: toEmail, // Change to your recipient
      from: process.env.EMAIL_FROM, // Change to your verified sender
      subject: "Reset Password",
      text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process (Link is only valid for 30 min):\n' +
          host + '/reset/' + resetToken + '\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
    };
  
    try {
      await sgMail.send(msg);
      // console.log("email send");
    } catch (e) {
      // console.log(e);
      e.name = "EmailSendError"
      throw new Error(e);
    }
  };

  module.exports = sendResetMali