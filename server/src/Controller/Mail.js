require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "deepakkotamsetti16@gmail.com",
    pass: process.env.APP_PASSWORD,
  },
});

const sendMail = async (req, res) => {
  const { user, mail, contestName } = req.body;

  const mailOption = {
    from: {
      name: "Code Hunters",
      address: "deepakkotamsetti16@gmail.com",
    },
    to: mail,
    subject: `Hello ${user}`,
    html: `<h5>You have registration for ${contestName} Have successfully done</h5>`, // Allow HTML content to be dynamic
  };

  try {
    await transporter.sendMail(mailOption);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error occurred while sending email" });
    console.log("Error occurred while sending email:");
  }
};

module.exports = { sendMail };
