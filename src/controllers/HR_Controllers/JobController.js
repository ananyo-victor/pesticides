import dotenv from "dotenv";
import {
  createJobPostService,
  getJobsService,
  getJobByIdService,
} from "../../service/hrServices/jobpostService.js";

dotenv.config();
/**
 * Controller to create a job post
 */
export const createJobPost = async (req, res) => {
  try {
    const {
      CompanyName,
      Title,
      JobType,
      Location,
      JobDescription,
      Salary,
      Experience,
      SkillsReq,
      Vacancy,
      LastDate,
    } = req.body;

    if (
      !CompanyName ||
      !Title ||
      !JobType ||
      !Location ||
      !JobDescription ||
      !Salary ||
      !Experience ||
      !SkillsReq ||
      !Vacancy ||
      !LastDate
    ) {
      return res
        .status(400)
        .json({ message: "All fields are required", key: "error" });
    }

    const result = await createJobPostService(req.body, req.user.userId);
    res
      .status(200)
      .json({
        message: "Job posted successfully",
        job: result.job,
        key: "success",
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating job post", error: error.message });
  }
};

/**
 * Controller to fetch all job posts
 */
export const getJobs = async (req, res) => {
  try {
    const jobs = await getJobsService();
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Controller to fetch a job post by ID
 */
export const getJobById = async (req, res) => {
  try {
    const id = req.params.Id;
    const job = await getJobByIdService(id);
    if (!job) {
      return res.status(404).json({ message: "Job not found", key: "error" });
    }

    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
