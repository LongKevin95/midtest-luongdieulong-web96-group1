import User from "../models/userModel.js";
import crypto from "crypto";

const registerUser = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    if (!userName || !email || !password) {
      return res.status(400).json({
        message: "All fields userId, username, email, password are required!",
      });
    }
    const lowerUserName = userName.toLowerCase();
    const lowerEmail = email.toLowerCase();

    // Check if user already exists
    const userExists = await User.findOne({ email: lowerEmail });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
        data: null,
      });
    }

    const randomString = crypto.randomBytes(5).toString("hex");
    const userId = `u-${randomString}`;

    const user = await User.create({
      userId,
      userName: lowerUserName,
      email: lowerEmail,
      password,
    });
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields email, password are required!",
        data: null,
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email or password is incorrect!",
        data: null,
      });
    }
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Email or password is incorrect!",
        data: null,
      });
    }

    const randomString = crypto.randomBytes(5).toString("hex");
    const apiKey = `mern-$${user.userId}$-$${user.email}$-$${randomString}$`;

    user.apiKey = apiKey;
    await user.save();

    res.status(200).json({
      user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: error.message, data: null });
  }
};

export default { registerUser, loginUser };
