const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });
// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  //   let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
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
  // console.log({
  //   service: "gmail",
  //   auth: {
  //     type: "OAuth2",
  //     user: process.env.MAIL_USERNAME,
  //     pass: process.env.MAIL_PASSWORD,
  //     clientId: process.env.OAUTH_CLIENT_ID,
  //     clientSecret: process.env.OAUTH_CLIENT_SECRET,
  //     accessToken : process.env.OAUTH_ACCESS_TOKEN,
  //     refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  //   },
  // });
  // // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `hazem.hemily@gmail.com`, // sender address
    to: "hazem.hemily@gmail.com", // list of receivers
    subject: "Hello", // Subject line
    text: "Hello world?", // plain text body
  });
  console.log(info);
  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

main().catch(console.error);

// "459460620983-ha9ibcsfhpbq1p0dq2otkkc5lungv9bk.apps.googleusercontent.com" client_ID
// "R8BUNnznJ_4178GvlOGPTV6m" CLIENT_SECRET
// "1//04FjRejJh_t-gCgYIARAAGAQSNwF-L9IrSIt5x8g8dLSFW-17s-pYZanfKmk82olcVsLLwzxpACtSODcUA9Fvv55HKwktRNAhdT4" refresh token
