import { applyForJobService } from '../../service/userServices/applicationService.js';
import Application from '../../models/application.js';
import JOB_POST from '../../models/job-post.js';

export const applyForJob = async (req, res) => {
  try {
    const response = await applyForJobService(req, res);
    if (response) {
      res.status(201).json({ message: 'Application submitted successfully!' });
    } else {
      res.status(400).json({ message: 'Failed to submit application.' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const isJobApplied = async (req, res) => {
  try {
    const { jobId } = req.query;
    const userId = req.user.userId;
    console.log("APPLICATION User ID: ", userId);
    console.log("Job ID: ", jobId);

    const appliedJob = await Application.findOne({ userId, jobId});
    console.log(appliedJob);

    if (appliedJob) {
      res.status(200).json({ message: "Job is applied", applied: true });
    } else {
      res.status(200).json({ message: "Job is not applied", applied: false });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

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