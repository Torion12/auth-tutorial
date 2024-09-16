export const generateVerificationCode = () => {
  const verificationCode = Math.floor(10000 + Math.random() * 90000).toString();
  return verificationCode;
};
