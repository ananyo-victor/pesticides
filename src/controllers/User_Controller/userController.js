import bcrypt from "bcryptjs";
import User from "../../models/user.js";
import { uploadToCloudinary } from "../../middlewares/multer/multerFile.js";
import fs from "fs";

const getUserProfile = async (req, res) => {
  try {
    const uId = req.user.userId;
    const user = await User.findById(uId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, email, phoneNumber, experience, skills } = req.body;
    // console.log("req.body", req.body);

    // Upload files to Cloudinary
    let resumeUrl = null;
    let profilePicUrl = null;

    if (req.files.resume) {
      const resumePath = req.files.resume[0].path;
      const resumeResult = await uploadToCloudinary(resumePath, 'resumes');
      resumeUrl = resumeResult.secure_url;
      fs.unlinkSync(resumePath); // Remove the file from the local storage
    }

    if (req.files.profilePic) {
      const profilePicPath = req.files.profilePic[0].path;
      const profilePicResult = await uploadToCloudinary(profilePicPath, 'profile_pics');
      profilePicUrl = profilePicResult.secure_url;
      fs.unlinkSync(profilePicPath); // Remove the file from the local storage
    }

    // console.log("resumeUrl", resumeUrl);
    // console.log("profilePicUrl", profilePicUrl);

    // Prepare the updated data
    const updatedData = {
      name,
      email,
      phoneNumber,
      experience,
      skills,
    };

    if (resumeUrl) {
      updatedData.resumePath = resumeUrl;
    }

    if (profilePicUrl) {
      updatedData.profilePic = profilePicUrl;
    }

    // Update user in the database
    const user = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user); // Send back the updated user data
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

export { getUserProfile, updateUserProfile };
