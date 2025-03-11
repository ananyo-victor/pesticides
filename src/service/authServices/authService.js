import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import User from "../../models/user.js";
import HR from "../../models/hr.js";

export const signUpUserService = async (req) => {
    const {
        SeekerName: name, // Map SeekerName to name
        email,
        password,
        phone: phoneNumber, // Map phone to phoneNumber
        skills,
        resumePath = "", // Set default value to empty string
        experience,
        education = "", // Set default value to empty string
        profilePic = "" // Set default value to empty string
    } = req.body;
    console.log(req.body);
    try {
        // Check if user already exists
        // console.log("Request body:", req.body);
        // const existingUser = await User.findOne({ email });
        const existingUser = await User.aggregate([
            { $match: {email : email} },
            { $limit: 1 },
            { $project: { _id: 1 } }
        ]).then(data => data[0]);

        if (existingUser) {

            //   console.log("User already exists");
            //   return res.status(400).json({ message: "User already exists" });
            return {
                success: false,
                message: "User already exists",
            };
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // console.log("Password hashed");

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
            profilePic,
            role: "user",
        });
        // console.log("New user created:", newUser);

        // Save user to database
        await newUser.save();
        // console.log("User saved to database");

        // Generate token
        const token = jwt.sign(
            { userId: newUser._id, role: "user" },
            process.env.JWT_KEY,
            { expiresIn: "1h" }
        );
        // console.log("Token generated");

        // Respond with success message and token
        // return res.status(201).json({ message: "User created successfully", token });
        return {
            success: true,
            message: "User created successfully",
            token
        };
    } catch (error) {
        console.error("Error signing up user:", error);
        // return res.status(500).json({ message: "Error signing up user", error });
        return {
            success: false,
            message: "Error signing up user",
            error
        };
    }
};

export const signUpHRService = async (req) => {
    const { hrName, email, password, phone, companyName, role } = req.body;
    console.log(req.body);

    try {
        // Check if HR already exists
        // const existingHR = await HR.findOne({ email });

        const existingHR = await HR.aggregate([
            { $match: {email : email} },
            { $limit: 1 },
            { $project: { _id: 1 } }
        ]).then(data => data[0]);

        if (existingHR) {
            // return res.status(400).json({ message: "HR already exists" });
            return {
                success: false,
                message: "HR already exists",
            };
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new HR
        const newHR = new HR({
            name: hrName, // Map hrName to name
            email,
            password: hashedPassword,
            phoneNumber: phone,
            companyName,
            role,
        });
        // console.log(newHR);

        // Save HR to database
        await newHR.save();

        // Generate token
        const token = jwt.sign(
            { userId: newHR._id, role },
            process.env.JWT_KEY,
            { expiresIn: "1h" }
        );

        // Respond with success message and token
        // res.status(201).json({ message: "HR created successfully", token });
        return {
            success: true,
            message: "HR created successfully",
            token
        };
    } catch (error) {
        console.error("Error signing up HR:", error); // Log the error
        // res.status(500).json({ message: "Error signing up HR", error });
        return {
            success: false,
            message: "Error signing up HR",
            error
        };
    }
};

export const signInService = async (req) => {
    const { email, password, role } = req.body;
    console.log(req.body);

    try {
        // Check if user exists
        const user = await (role === "hr" ? HR : User).aggregate([
            { $match: {email : email} },
            { $limit: 1 },
            { $project: { password: 1 } }
        ]).then(data => data[0]);
        console.log(user);
        if (!user) {
            // return res.status(400).json({ message: "User not found" });
            return {
                success: false,
                message: "User not found",
            };
        }
// console.log(user);
        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            // return res.status(400).json({ message: "Invalid password" });
            return {
                success: false,
                message: "Invalid password",
            };
        }
        // Generate token
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_KEY, {
            expiresIn: "1h",
        });

        // Respond with success message and token
        // res.status(200).json({ message: "Sign in successful", token, role });
        return {
            success: true,
            message: "Sign in successful",
            token,
            role
        };

    } catch (error) {
        // res.status(500).json({ message: "Error signing in user", error });
        return {
            success: false,
            message: "Error signing in user",
            error
        };
    }
};

// export { signUpUser, signUpHR, signIn };
