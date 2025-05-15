require("dotenv").config(); // Add this at the top
const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Only allow your frontend to send requests
app.use(
  cors({
    origin: "https://www.crystalpacltd.com",
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/send", async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Zoho SMTP transporter
  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true, // true for port 465, false for 587
    auth: {
      user: process.env.EMAIL_USER, // Hide your Zoho email
      pass: process.env.EMAIL_PASS, // Hide your Zoho app password
    },
  });

  const mailOptions = {
    from: "noreply@crystalpacltd.com", // Must be a Zoho mailbox
    to: "info@crystalpacltd.com", // Group email, receives the form submissions
    subject: `Form Message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send email" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
