import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const transporter = nodemailer.createTransport({
  host: process.env.NODE_HOST,
  port: process.env.NODE_PORT,
  auth: {
    user: process.env.NODE_USER,
    pass: process.env.NODE_PASS,
  },
});
