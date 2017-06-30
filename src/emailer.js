const nodemailer = require('nodemailer');

/* eslint-disable no-console */

const officetransporter = nodemailer.createTransport({
  host: 'cardano-com.mail.protection.outlook.com',
  port: 25,
  secureConnection : false,
});

const mailOptions = {
    from: 'indexmanagement@cardano.com',
    to: 'a.coetzee@cardano.com',
    subject: 'Test',
    text: 'Test email',
    html: `<b> test Email </b>`
  };

// verify connection configuration
officetransporter.verify(function(error, success) {
   if (error) {
        console.log(error);
   } else {
        console.log('Server is ready to take our messages');
   }
});

 officetransporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log(`Message ${info.messageId} sent: ${info.response}`);
  });
