import JOB_POST from "../../models/job-post.js";

// GET all job posts
export const getJobs = async (req, res) => {
  try {
    // const {Title,CompanyName,JobType, Location, SkillsReq } = req.query;
    // let query = {};

    // if (Title) query.Title = Title;
    // if (CompanyName) query.CompanyName = CompanyName;
    // if (JobType) query.JobType = JobType;
    // if (Location) query.Location = Location;
    // if (SkillsReq) query.SkillsReq = { $in: [SkillsReq] };

    const jobs = await JOB_POST.find();
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getJobsById = async (req, res) => {
  const id = req.params.Id;
  try {
    const jobs = await JOB_POST.findById(id);
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
