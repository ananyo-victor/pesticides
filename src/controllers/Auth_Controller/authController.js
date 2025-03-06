import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import User from "../../models/user.js";
import HR from "../../models/hr.js";
 
const signUpUser = async (req, res) => {
  const {
    name,
    email,
    password,
    phoneNumber,
    skills, 
    resumePath,
    experience,
    education,
  } = req.body;
  try {
    // Check if user already exists
    console.log(req.body);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      skills,
      resumePath,
      experience,
      education,
      role: "user",
    });
    console.log(newUser);
    // Save user to database
    await newUser.save();

    // Generate token
    const token = jwt.sign(
      { userId: newUser._id, role: "user" },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    // Respond with success message and token
    res.status(201).json({ message: "User created successfully", token });
  } catch (error) {
    res.status(500).json({ message: "Error signing up user", error });
  }
};

const signUpHR = async (req, res) => {
  const { name, email, password, phoneNumber, companyName } = req.body;
  console.log(req.body);

  try {
    // Check if HR already exists
    const existingHR = await HR.findOne({ email });
    if (existingHR) {
      return res.status(400).json({ message: "HR already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new HR
    const newHR = new HR({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      companyName,
      role: "hr",
    });
    console.log(newHR);

    // Save HR to database
    await newHR.save();

    // Generate token
    const token = jwt.sign(
      { userId: newHR._id, role: "hr" },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    // Respond with success message and token
    res.status(201).json({ message: "HR created successfully", token });
  } catch (error) {
    res.status(500).json({ message: "Error signing up HR", error });
  }
};

const signIn = async (req, res) => {
  const { email, password, role } = req.body;
  console.log(req.body);

  try {
    // Check if user exists
    const user = await (role === "hr" ? HR : User).findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY, {
      expiresIn: "1h",
    });

    // Respond with success message and token
    res.status(200).json({ message: "Sign in successful", token });
  } catch (error) {
    res.status(500).json({ message: "Error signing in user", error });
  }
};

export { signUpUser, signUpHR, signIn };
