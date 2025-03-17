import { getJobsService, getJobByIdService } from "../../service/userServices/jobGetService.js";

export const getJobs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    // const userId = req.user.userId;
    const jobs = await getJobsService(page, limit);
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
    const userId = req.user.userId;
    const job = await getJobByIdService(id, userId);
    if (!job) {
      return res.status(404).json({ message: "Job not found", key: "error" });
    }

    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};