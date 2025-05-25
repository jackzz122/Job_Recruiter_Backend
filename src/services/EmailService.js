import nodemailer from "nodemailer";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
dotenv.config();

const readEmailTemplate = () => {
  const templatePath = path.join(
    process.cwd(),
    "src",
    "templates",
    "emailTemplate.html"
  );
  return fs.readFileSync(templatePath, "utf-8");
};

const replaceTemplateVariables = (template, variables) => {
  let html = template;
  Object.keys(variables).forEach((key) => {
    const regex = new RegExp(`{{${key}}}`, "g");
    html = html.replace(regex, variables[key]);
  });
  return html;
};

export const sendMailService = async (
  ownerMail,
  title,
  subject,
  receiveMail,
  content,
  companyName = "Web Tuyển Dụng XYZ"
) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Read the email template
  const template = readEmailTemplate();

  // Prepare variables for the template
  const variables = {
    title: title,
    content: content,
    companyName: companyName,
    contactEmail: ownerMail,
    currentYear: new Date().getFullYear(),
  };

  // Replace variables in the template
  const htmlContent = replaceTemplateVariables(template, variables);

  const info = await transporter.sendMail({
    from: `${title} | ${companyName} <${ownerMail}>`,
    to: receiveMail,
    subject: subject,
    text: content,
    html: htmlContent,
  });

  return info;
};
