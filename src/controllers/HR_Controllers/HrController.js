// import multer from "multer";
import bcrypt from "bcryptjs";
import hr from "../../models/hr.js";

const getHrProfile = async (req, res) => {
  try {
    const uId = req.user.userId;
    const Hr = await hr.findById(uId);
    if (!Hr) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(Hr);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const updateHrProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    let updatedData = req.body;

    // If password is being updated, hash it
    if (updatedData.password) {
      const salt = await bcrypt.genSalt(10);
      updatedData.password = await bcrypt.hash(updatedData.password, salt); // Hash the new password
    }

    // Update user in the database
    const user = await hr.findByIdAndUpdate(userId, updatedData, {
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

export { getHrProfile, updateHrProfile };
