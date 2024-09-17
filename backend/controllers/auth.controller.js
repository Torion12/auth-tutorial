import { User } from "../Models/user.models.js";
import bcryptjs from "bcrypt";
import { generateVerificationCode } from "../utils/generateVerificationCode.js";
import { generateTokenAndSetCookies } from "../utils/generateTokenAndSetCookies.js";
import { sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/email.js";
import {
  nodeEmailVerification,
  nodeWelcomeEmail,
  resetPasswordEmail,
  sendResetSuccessEmail,
} from "../nodemailer/email.js";
import crypto from "crypto";

//login user controller
export const login = async (req, res) => {
  const { password, email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: "false", message: "Email is Invalid!" });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: "fail", message: "Password is Invalid!" });
    }

    //Password Validation

    await generateTokenAndSetCookies(res, user._id);
    user.lastLogin = new Date();
    user.save();

    res.status(200).json({
      success: "true ",
      message: "Login Successfully",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    res.status(400).json({ success: "fail", message: error.message });
  }
};

//logout controller
export const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: "true", message: "Logout sucessfully!" });
};

//signup Controller
export const signup = async (req, res) => {
  const { email, name, password } = req.body;

  try {
    if (!email || !name || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are Required!" });
    }

    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      res
        .status(400)
        .json({ success: "Failed!", message: "User Already Exist!" });
    }

    //hash the password
    const hashedPassword = await bcryptjs.hash(password, 10);
    //verification code for sending in the email!
    const verification = generateVerificationCode();

    const user = new User({
      email,
      password: hashedPassword,
      name,
      verification,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24hours
    });

    await user.save();

    //jtw Token
    generateTokenAndSetCookies(res, user._id);
    //email Send to the new User
    await nodeEmailVerification(email, verification);

    res.status(201).json({
      success: true,
      message: "User Created Successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("Error", error.message);
  }
};

//user verification Email Send
export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verification: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({
        sucess: "faild",
        message: "Invalid or Expired verification Code",
      });
    }

    user.isVerified = true;
    user.verification = undefined;
    user.verificationTokenExpiresAt = undefined;
    user.save();

    // await sendWelcomeEmail(user.email, user.name);
    await nodeWelcomeEmail(user.email, user.name);
    console.log("Email Sent Successfully");
    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("Error sending verification", error);
    throw new Error(`Error Sending verification ${error}`);
  }
};
//user Forgot Password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ sucess: "fail", message: "User is not Found!" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 7 * 60 * 1000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpireAt = resetTokenExpiresAt;
    await user.save();

    // generate resetPassword to email
    await resetPasswordEmail(
      email,
      `http://localhost:4000/reset-password/${resetToken}`
    );

    return res.status(201).json({
      success: "True",
      message: "Reset Password has been sent to your email!",
    });
  } catch (error) {
    console.log("Resset password fail: ", error);
    throw new Error("Resset password fail: ", error.message);
  }
};

//user Reset password
export const resetPassword = async (req, res) => {
  const { newPassword } = req.body;
  const { token } = req.params;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpireAt: { $gt: Date.now() },
    });

    console.log(user);

    if (!user) {
      return res
        .status(400)
        .json({ success: "fail", message: "Invalid or Expired reset Token" });
    }

    //Hashed the new password
    const hashedPassword = await bcryptjs.hash(newPassword, 10);
    //update the user new password to the db
    user.password = hashedPassword;
    user.resetPasswordExpireAt = undefined;
    user.resetPasswordToken = undefined;
    //save the user new password to the db
    await user.save();

    //send reset email successfully
    await sendResetSuccessEmail(user.email);

    res
      .status(201)
      .json({ success: "True", message: "Password reset successful" });
  } catch (error) {
    console.log("reset error:", error);
    res.status(400).json({ success: "false", message: error.message });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({
      success: "true",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("Error in checkAuth:", error);
    return res.status(401).json({ success: "false", message: error.message });
  }
};
