import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
} from "../mailtrap/emailTemplate.js";
import { transporter } from "./email.config.js";

export const nodeEmailVerification = async (email, verification) => {
  const mailOptions = {
    from: "adrian.torion12@gmail.com",
    to: email,
    subject: "Verification Code",
    html: VERIFICATION_EMAIL_TEMPLATE.replace(
      "{verificationCode}",
      verification
    ),
  };

  try {
    const sendEmail = await transporter.sendMail(mailOptions);
    return sendEmail;
  } catch (error) {
    console.log("Error node email:", error.message);
    throw new Error("Error sending verification email");
  }
};

export const nodeWelcomeEmail = async (email, name) => {
  const mailOptions = {
    from: "adrian.torion12@gmail.com",
    to: email,
    subject: "THANK YOU!",
    html: WELCOME_EMAIL_TEMPLATE.replace("{USER}", name),
  };

  try {
    const sendEmail = await transporter.sendMail(mailOptions);
    return sendEmail;
  } catch (error) {
    console.log("Error node welcome Email :", error.message);
    throw new Error("Error sending Welcome Email");
  }
};

export const resetPasswordEmail = async (email, resetURL) => {
  const emailOptions = {
    from: "adrian.torion12@gmail.com",
    to: email,
    subject: "Reset Password",
    html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
  };

  try {
    const response = transporter.sendMail(emailOptions);
    return response;
  } catch (error) {
    console.log("Error node welcome Email :", error.message);
    throw new Error("Error sending Welcome Email");
  }
};

export const sendResetSuccessEmail = async (email) => {
  const emailOptions = {
    from: "adrian.torion12@gmail.com",
    to: email,
    subject: "Reset Success",
    html: PASSWORD_RESET_SUCCESS_TEMPLATE,
  };

  try {
    const response = transporter.sendMail(emailOptions);
    return response;
  } catch (error) {
    console.log("Error node welcome Email :", error.message);
    throw new Error("Error sending Welcome Email");
  }
};
