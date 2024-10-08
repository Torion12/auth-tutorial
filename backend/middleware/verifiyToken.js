import jtw from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res
      .status(401)
      .json({ success: "fail", message: "Unauthorize Access" });
  }

  try {
    const decode = jtw.verify(token, process.env.JTW_SECRET);
    if (!decode) {
      return res
        .status(401)
        .json({ success: "false", message: "Unauthorized Access" });
    }
    req.userId = decode.userId;
    console.log(req.userId);

    next();
  } catch (error) {
    console.log("error in verifyToken : ", error);
    return res.status(400).json({ success: "false", message: error.message });
  }
};
