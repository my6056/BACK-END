import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY;

const generateJwtToken = (userId, name, email) => {
  return jwt.sign({ userId, name, email }, SECRET_KEY, { expiresIn: "24h" });
};

export default generateJwtToken;
