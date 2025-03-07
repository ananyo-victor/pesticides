import Application from "../models/application.js";
import mongoose from "mongoose";
import { verifyTokens } from "../middlewares/verifyTokens.js";
import multer from "multer";
import path from "path";
import JOB_POST from "../models/job-post.js";
import User from "../models/user.js";
import { log } from "console";
// import { User } from "lucide-react";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/resumes"); // Directory to save uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only .pdf files are allowed!"));
    }
  },
}).single("resume"); // 'resume' is the field name for the file

export const getApp = async (req, res) => {
  try {
    const { jobId } = req.params; // Get jobId from URL

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: "Invalid Job ID" });
    }
    const applications = await Application.aggregate([
      {
        $match: { jobId: new mongoose.Types.ObjectId(jobId) }
      },
      {
        $lookup: {
          from: "users", // Check if this collection name is correct
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          jobId: 1,
          "user.name": 1,
          "user.email": 1,
          "user.phoneNumber": 1,
          "user.education": 1,
          experience: 1, 
          location: 1,
          appliedAt: 1,
          status: 1,
          resume: 1
        }
      }
    ]);
    //const jobData = await JOB_POST.findOne({ _id: jobId });
    // const jobData = await JOB_POST.findOne({ _id: jobId }).lean();
    const jobData = await JOB_POST.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(jobId) } // Job ID match karega
      },
      {
        $project: { 
          title: 1, 
          description: 1, 
          salary: 1, 
          location: 1 
        } // Sirf required fields fetch karenge
      }
    ]); 
    if (!applications.length) {
      return res
        .status(404)
        .json({ message: "No applications found for this job" });
    }
    res.status(200).json({ applications, jobTitle: jobData.Title });

    
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const applyForJob = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {

      const { coverLetter, location, hrId, experience } = req.body;
      const userId = req.user.userId;
      const jobId = req.params.jobId;

      // console.log("User ID: ", userId);

      const existingApplication = await Application.findOne({ userId, jobId });

      if (existingApplication) {
        return res.status(400).json({
          message: "User has already applied for this job.",
          application: existingApplication,
        });
      }

      // Ensure location is parsed as an array
      let parsedLocation;
      try {
        parsedLocation = JSON.parse(location);
      } catch (error) {
        return res.status(400).json({ message: "Invalid location format" });
      }

      // Ensure experience is parsed as a number
      const parsedExperience = Number(experience);

      const newApplication = new Application({
        userId,
        jobId,
        hrId,
        resume: req.file ? req.file.path : null, // Save the file path if file is uploaded
        coverLetter,
        location: parsedLocation,
        status: "Pending",
        experience: parsedExperience,
      });

      // console.log("new Application : ", newApplication);

      await newApplication.save();

      res.status(201).json({
        message: "Application submitted successfully!",
        application: newApplication,
      });
    } catch (error) {
      console.error("Error while applying for job:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
};
