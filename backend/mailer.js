// backend/mailer.js
import nodemailer from "nodemailer";

export async function sendMail(formData) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "projectdreaseroustech@gmail.com",
      pass: "kvyq eigd jekm libl", // your app password
    },
  });

  const mailOptions = {
    from: "projectdreaseroustech@gmail.com",
    to: "projectdreaseroustech@gmail.com",
    subject: "New Form Submission",
    text: `You got a new submission:\n\nName: ${formData.name}\nEmail: ${formData.email}\nMessage: ${formData.message}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (err) {
    console.error("Email error:", err);
  }
}
