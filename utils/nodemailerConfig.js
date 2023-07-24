export default {
  host: "smtp.ethereal.email",
  port: process.env.ETHERIAL_PORT,
  auth: {
    user: process.env.ETHERIAL_USER,
    pass: process.env.ETHERIAL_PASS,
  },
};
