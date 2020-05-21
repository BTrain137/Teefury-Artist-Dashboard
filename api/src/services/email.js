import nodemailer from "nodemailer";
const { CLIENT_EMAIL, CLIENT_HOST, CLIENT_USER, CLIENT_PASSWORD } = process.env;

/**
 * Sending email to artist
 * @param  {String} artistEmail The artist contact email
 * @param  {String} subject     Subject of the email
 * @param  {String} htmlContent The body of email
 * @return {Promise}
 */

export const sendMail = (artistEmail, subject, htmlContent) => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      host: CLIENT_HOST,
      secureConnection: false,
      port: 587,
      tls: {
        ciphers: "SSLv3",
      },
      auth: {
        user: CLIENT_USER,
        pass: CLIENT_PASSWORD,
      },
    });

    const mailOptions = {
      from: CLIENT_EMAIL,
      to: artistEmail,
      subject,
      html: `${htmlContent}<br/><br/><img style="width:40px;height:40px;" src="cid:logo">`, // html body
      attachments: [
        {
          filename: "Logo.svg",
          path: __dirname + "/../../assets/tee-bird.svg",
          cid: "logo",
        },
      ],
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        reject(err);
      } else {
        resolve(info);
      }
    });
  });
};

/**
 * Sending Reset Email
 * @param  {String} artistEmail The artist contact email
 * @param  {String} token       Token to validate artist
 * @return {Promise}
 */

export const resetEmail = (artistEmail, token) => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      host: CLIENT_HOST,
      secureConnection: false,
      port: 587,
      tls: {
        ciphers: "SSLv3",
      },
      auth: {
        user: CLIENT_USER,
        pass: CLIENT_PASSWORD,
      },
    });

    const htmlContent =
      "You are receiving this because we received a request to reset the password on your account.\n\n" +
      "Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n" +
      `http://artists.teefury.com/reset-password/${token}\n\n` +
      "If you did not request this, please ignore this email and your password will remain unchanged.\n";

    const mailOptions = {
      from: CLIENT_EMAIL,
      to: artistEmail,
      subject: "Artist Dashboard Reset Password",
      text: `${htmlContent}`,
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        reject(err);
      } else {
        resolve(info);
      }
    });
  });
};
