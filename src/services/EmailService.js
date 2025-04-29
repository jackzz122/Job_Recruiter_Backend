import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendMailService = async (
  ownerMail,
  title,
  subject,
  receiveMail,
  text
) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587, // Port cho TLS
    secure: false, // Sử dụng false cho TLS (SSL sẽ dùng port 465 và secure: true)
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const info = await transporter.sendMail({
    from: `${title} | Web Tuyển Dụng XYZ" <${ownerMail}>`, // sender address
    to: `${receiveMail}`,
    subject: `${subject}`,
    text: `${text}`, // plain text body
    html: `Hello123 ${text}`, // html body
  });
  return info;
};
