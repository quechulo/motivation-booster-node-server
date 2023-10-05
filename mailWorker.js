const nodemailer = require("nodemailer");
const db = require("./db-utils.js");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});


module.exports = { transporter };
