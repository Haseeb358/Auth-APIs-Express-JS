import nodemailer from "nodemailer";
import dotenv from "dotenv";
import hbs from "nodemailer-express-handlebars";
import path from "path";

dotenv.config();

let transporter = nodemailer.createTransport({
  host: process.env.EMAILHOST,
  port: process.env.EMAILPORT,
  auth: {
    user: process.env.EMAILUSER,
    pass: process.env.EMAILPASS,
  },
});

let Options = {
  viewEngine: {
    partialsDir: path.resolve("./views"),
    defaultLayout: false,
  },
  viewPath: path.resolve("./views/"),
};

transporter.use("compile", hbs(Options));

let sendEmail = async (opt) => {
  try {
    const info = await transporter.sendMail({
      from: "hs123@gmail.com",
      to: opt.to,
      subject: opt.subject,

      template: "email",
      context: {
        name: opt.name,
        otp: opt.otp,
        company: "my company",
      },
      attachments: [
        {
          filename: "logo1.png",
          path: path.join("utils", "../images/logo1.png"),
          cid: "logo@company.com",
        },
        {
          filename: "Linkenin.png",
          path: path.join("utils", "../images/Linkenin.png"),
          cid: "logoLinkenin@company.com",
        },
        {
          filename: "fb.png", //
          path: path.join("utils", "../images/fb.png"),
          cid: "logofb@company.com",
        },
        {
          filename: "insta.png",
          path: path.join("utils", "../images/insta.png"),
          cid: "logoinsta@company.com",
        },
        {
          filename: "twitter.png",
          path: path.join("utils", "../images/twitter.png"),
          cid: "logotwitter@company.com",
        },
      ],
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.log("Error from mail server: ", error);
  }
};

export default sendEmail;
