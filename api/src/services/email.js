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

    console.log({ CLIENT_EMAIL, CLIENT_HOST, CLIENT_USER, CLIENT_PASSWORD });

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
