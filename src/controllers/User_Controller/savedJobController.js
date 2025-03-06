import SAVED_JOB from "../../models/savedJobs.js";

// 1. Save a job
export const saveJob = async (req, res) => {
    try {
        const { job_id } = req.body;
        const user_id = req.user.userId;
        const existingSavedJob = await SAVED_JOB.findOne({ user_id, job_id });
        if (existingSavedJob) {
            return res.status(400).json({ message: "Job already saved!" });
        }

        const newSavedJob = new SAVED_JOB({ user_id, job_id });
        await newSavedJob.save();

        res.status(201).json({ message: "Job saved successfully!", savedJob: newSavedJob });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Get all saved jobs for a user
export const getSavedJobs = async (req, res) => {
    try {
        const user_id = req.user.userId;
        const savedJobs = await SAVED_JOB.find({ user_id }).populate("job_id").lean();
        const jobDetails = savedJobs.map(savedJob => savedJob.job_id);
        res.status(200).json(jobDetails);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Remove a saved job
export const removeSavedJob = async (req, res) => {
    try {
        const { job_id } = req.query;
        const user_id = req.user.userId;
        await SAVED_JOB.findOneAndDelete({ user_id, job_id });
        res.status(200).json({ message: "Saved job removed successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. Check if a job is saved by a user
export const isJobSaved = async (req, res) => {
    try {
        const { job_id } = req.query;
        const user_id = req.user.userId;
        const savedJob = await SAVED_JOB.findOne({ user_id, job_id });

        if (savedJob) {
            return res.status(200).json({ message: "Job is saved", saved: true });
        } else {
            return res.status(200).json({ message: "Job is not saved", saved: false });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

