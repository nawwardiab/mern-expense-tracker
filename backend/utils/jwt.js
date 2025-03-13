import jwt from "jsonwebtoken";

export const createSendToken = (res, status, user) => {
  const { JWT_EXP, JWT_SECRET } = process.env;
  //! Sign jwt token
  const jwtToken = jwt.sign({ id: user._id }, JWT_SECRET, {
    expiresIn: JWT_EXP,
  });

  //! Set cookie option
  const cookieOptions = {
    maxAge: 10 * 60 * 1000,
    httpOnly: true,
  };

  //! Send token using cookie
  res.cookie("jwtToken", jwtToken, cookieOptions);

  res.status(status).json({ success: true, status, data: user });
};
