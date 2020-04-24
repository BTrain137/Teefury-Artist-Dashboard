import nodemailer from "nodemailer";
const { CLIENT_EMAIL, CLIENT_HOST, CLIENT_USER, CLIENT_PASSWORD } = process.env;

export const sendMail = (artistEmail, subject) => {
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
      html: `<b>Hello world </b><br> This is the first email sent with Nodemailer in Node.js <br /><br /><img style="width:50px;height:50px;" src="cid:logo"> `, // html body
      attachments: [
        {
          filename: "Logo.svg",
          path: __dirname + "/../assets/tee-bird.svg",
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
