import sendEmail from "./sendEmail.js";

const sendVerificationEmail = async ({
  name,
  email,
  verificationToken,
  origin,
}) => {
  const verifyEmail = `${origin}/user/verify-email?email=${email}&token=${verificationToken}`;
  const message = `<p>Please confirm your email by clicking on the following link : 
  <a href="${verifyEmail}">Verify Email</a> </p> https://www.google.com/`;
  return sendEmail({
    to: email,
    subject: "Email Confirmation",
    html: `<h4> Hello, ${name}</h4> ${message}`,
  });
};

export default sendVerificationEmail;
