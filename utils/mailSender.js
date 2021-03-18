const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
const sendEmail = async function (options) {
  const { to, subject, text } = options;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host:process.env.SMTP_HOST,
    port:process.env.SMTP_PORT,
    secure: true,
    auth: {
      type: "OAuth2",
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
      clientId: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      accessToken : process.env.OAUTH_ACCESS_TOKEN,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    },
  });
  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to,
    subject,
    text,
  };
  // send mail with defined transport object
    let info = await transporter.sendMail(message);
    console.log(info) ; 
  
};

module.exports = sendEmail;
