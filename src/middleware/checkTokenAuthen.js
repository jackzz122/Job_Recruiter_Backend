import jwt from "jsonwebtoken";
export const checkTokenAuthen = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return err.status(401).json({ auth: err.message });
      else {
        req.user = decoded.user;
        next();
      }
    });
  }
};
