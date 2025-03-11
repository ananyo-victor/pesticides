import JOB_POST from "../../models/job-post.js";

// GET all job posts
export const getJobs = async (req, res) => {
  try {
    const jobs = await JOB_POST.find();
    // jobs.map((job) => {

    // });

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getJobsById = async (req, res) => {
  const id = req.params.Id;
  try {
    const jobs = await JOB_POST.findById(id);
    // const jobs = await JOB_POST.aggregate([
    //   { $match: { _id: id } },
    //   {
    //     $lookup: {
    //       from: "hr",
    //       localField: "hrId",
    //       foreignField: "_id",
    //       as: "hrDetails",
    //     },
    //   },
    //   {
    //     $unwind: "$hrDetails",
    //   },

    //   {
    //     $project: {
    //       _id: 1,
    //       Title: 1,
    //       JobType: 1,
    //       Location: 1,
    //       Salary: 1,
    //       Experience: 1,
    //       Description: 1,
    //       "hrDetails.name": 1,
    //       "hrDetails.companyName": 1,
    //       "hrDetails.email": 1,
    //       "hrDetails.phoneNumber": 1,
    //     },
    //   },
    // ]);
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
