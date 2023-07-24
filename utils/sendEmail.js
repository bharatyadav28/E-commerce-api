import nodemailer from "nodemailer";

import nodemailerConfig from "./nodemailerConfig.js";
import mailgun from "mailgun-js";

const sendEmail = async ({ to, subject, html }) => {
  // ethereal;
  const transporter = nodemailer.createTransport(nodemailerConfig);
  return transporter.sendMail({
    from: '"Apna Ecommerce 👻" <apnaecommerce@gmail.com>',
    to,
    subject: subject,
    html: html,
  });

  // const mg = mailgun({
  //   apiKey: process.env.MAILGUN_APIKEY,
  //   domain: process.env.MAILGUN_DOMAIN,
  // });

  // const emailData = {
  //   from: '"Apna Ecommerce 👻" <apnaecommerce@gmail.com>',
  //   to,
  //   subject: subject,
  //   html: html,
  // };

  // return mg.messages().send(emailData);
};

export default sendEmail;
