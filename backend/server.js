const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
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
      user: "noreply@crystalpacltd.com", // Your Zoho mailbox, not group address
      pass: "458S1fG5TEKX", // App password from Zoho
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
    res.status(200).json({ message: "Email sent successfully via Zoho Mail" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send email via Zoho" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
