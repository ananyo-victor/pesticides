import { applyForJobService } from '../../service/userServices/applicationService.js';
import Application from '../../models/application.js';

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
    // console.log("APPLICATION User ID: ", userId);
    // console.log("Job ID: ", jobId);

    const appliedJob = await Application.findOne({ userId, jobId});
   // console.log(appliedJob);

    if (appliedJob) {
      res.status(200).json({ message: "Job is applied", applied: true });
    } else {
      res.status(200).json({ message: "Job is not applied", applied: false });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};