import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Node mailer
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "m.arhamsaleem900@gmail.com",
    pass: process.env.Mail_Password,
  },
});

export const mailer = async ({ to, subject, text, html }) => {
    const info = await transporter.sendMail({
      from: '"Urham Galoure" <codewithpsych@gmail.com>',
      to,
      subject,
      text,
      html,
    });
    return info;
};
