import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Ensure all fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    //to check if email is valid
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    const isValidEmail = gmailRegex.test(email);
    if (!isValidEmail) {
      return res
        .status(400)
        .json({ message: "Please enter a valid Gmail address" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    //check for password lenght
    if (password.length < 8) {
      return res.status(400).json({
        success: "false",
        message: "Password must be at least 8 characters",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    res.status(201).json({
      message: "User registered successfully",
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Ensure all fields are provided
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    const isValidEmail = gmailRegex.test(email);
    if (!isValidEmail) {
      return res
        .status(400)
        .json({ message: "Please enter a valid Gmail address" });
    }
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(500).json({ message: "User does not exist" });
    }
    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(500).json({ message: "Invalid email or password" });
    }
    res.status(201).json({
      message: "User registered successfully",
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
     console.error("Error in logging user:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
        return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user profile:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
    }   
    