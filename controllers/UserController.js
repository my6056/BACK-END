/*Importing */
import jwt from "jsonwebtoken";
const secretKey = process.env.SECRETE_KEY;
console.log("Secret Key :" , secretKey);
import UserModel from "../models/UserModel.js";
import bcryptJs from "bcryptjs";

/*  USER ACCOUNT CREATE FUNCTION  */

const UserAccountCrete = async (req, res, next) => {
  const { name, password, email, confirmPassword } = req.body;
  // Regular expression for validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}/;
  const nameRegex = /^[a-zA-Z0-9_]{3,}$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  if (!emailRegex.test(email)) {
    return res.json({
      status: false,
      message: "Enter Valid Email Please.",
    });
  }
  if (!name && !nameRegex.test(name)) {
    return res.json({
      status: false,
      message: "Enter Valid Name Please.",
    });
  }
  if (!passwordRegex.test(password)) {
    return res.json({
      status: false,
      message: "Enter Valid Password with special charector and min 6 digit",
    });
  }
  if (password !== confirmPassword) {
    return res.json({
      status: false,
      message: "Password And Confirm Password Did not match",
    });
  }
  const validEmail = email.toLowerCase();
  try {
    const user = await UserModel.findOne({ email: validEmail });
    if (user) {
      return res.json({
        status: false,
        message: "User Already exists with this email",
      });
    }
    // hashing the password before saving in db
    const hashedPassword = await bcryptJs.hash(password, 15);
    const newUser = await new UserModel({
      email: validEmail,
      password: hashedPassword,
      name: name,
    });
    // saaving details in db
    await newUser.save();
    return res.json({
      status: true,
      message: "Account Created Successfully",
    });
  } catch (error) {
    next(error);
    return res.json({ status: false, message: "Internal Server Error" });
  }
};

/* USER ACCOUNT LOGIN FUNCTION*/

const UserAccountLogin = async (req, res, next) => {
  // Extract email and password from request body
  const { email, password } = req.body;
  // Convert email to lowercase for case-insensitive comparison
  const validEmail = email.toLowerCase();
  try {
    // Check if the user exists
    const userExists = await UserModel.findOne({ email: validEmail });
    if (!userExists) {
      return res.json({
        status: false,
        message:
          "User Email Not Found or User Does Not Exist,Please Create New Account",
      });
    }
    // Verify the password
    const passwordMatch = await bcryptJs.compare(password, userExists.password);
    if (!passwordMatch) {
      return res.json({
        status: false,
        message: "Incorrect Password Try Again !",
      });
    }
     // Create a token for authentication with expires Time
    const token = await jwt.sign(
      {
        userId: userExists._id,
        name: userExists.name,
        email:  userExists.email,
      },
      secretKey,
      {
        expiresIn: '7d',
      }
    );
    return res.json({
      status: true,
      message: "Logged in successfull",
      token: token,
    });
  } catch (error) {
    next(error);
    return res.json({ status: false, message: "Internal Server Error" });
  }
};

export { UserAccountCrete, UserAccountLogin };
