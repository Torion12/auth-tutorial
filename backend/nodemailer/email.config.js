import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: "adrian.torion12@gmail.com",
    pass: "lebp lwwo argi fwar",
  },
});

