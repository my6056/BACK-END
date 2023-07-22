import jwt from "jsonwebtoken";

const secretKey = process.env.SECRET_KEY;

const generateJwtToken = async (userId, name, email) => {
  return await jwt.sign({ userId, name, email }, secretKey, {
    expiresIn: "24h",
  });
};

export default generateJwtToken;
