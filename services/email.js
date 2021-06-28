const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
require("dotenv").config();

class EmailService {
  constructor() {
    this.link = "http://localhost:3000";
  }
  async sendVerifyEmail(verifyToken, email) {
    await this.#sendEmail({
      to: email,
      subject: "Verify your account",
      html: this.#createVerifyEmail(verifyToken, email),
    });
  }

  #createVerifyEmail(verifyToken, name) {
    const mailGenerator = new Mailgen({
      theme: "default",
      product: {
        name: "Julls Ju",
        link: this.link,
      },
    });
    return mailGenerator.generate({
      body: {
        name,
        intro: "Welcome!",
        action: {
          instructions: "To verify your account, please click here",
          button: {
            text: "Confirm your account",
            link: `${this.link}/api/users/verify/${verifyToken}`,
          },
        },
      },
    });
  }

  async #sendEmail(message) {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SMTP_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    const info = await transporter.sendMail({
      ...message,
      from: process.env.EMAIL_SENDER,
    });

    console.log("sendEmail", info);
  }
}

module.exports = EmailService;