import { mailtrapClient, sender } from "./mailtrap.config.js";
import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplate.js";

export const sendVerificationEmail = async (email, verification) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verification Code",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verification
      ),
      category: "Email Verification",
    });

    console.log("Email Sent Successfully", response);
  } catch (error) {
    console.log("Error sending verification", error);
    // throw new Error(`Error Sending verification ${error}`);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      template_uuid: "5d425df7-f15e-441e-9321-36f84256db8a",
      template_variables: {
        company_info_name: "Auth-tutorial",
        name: name,
      },
    });
    console.log("Email Verification send Successfully");
  } catch (error) {
    console.log("Error sending verification", error);
    throw new Error(`Error Sending verification ${error}`);
  }
};
