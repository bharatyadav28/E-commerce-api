import sendEmail from "./sendEmail.js";

const sendResetPasswordEmail = async ({
  name,
  email,
  passwordToken,
  origin,
}) => {
  const link = `<a href=${origin}/user/reset-password?email=${email}&token=${passwordToken}>
  Reset password</a>`;
  // const link = `<a href="https://user/reset-password?email=${email}&token=${passwordToken}" class="btn-primary"
  // itemprop="url" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; color: #FFF; text-decoration: none; line-height: 2em; font-weight: bold; text-align: center; cursor: pointer; display: inline-block; border-radius: 5px; text-transform: capitalize; background-color: #348eda; margin: 0; border-color: #348eda;
  //  border-style: solid; border-width: 10px 20px;">Confirm email address</a>`;
  const message = `<p>Please click on the following link to reset your password ${link}</p>`;

  return sendEmail({ to: email, subject: "Reset Password", html: message });
};

export default sendResetPasswordEmail;
