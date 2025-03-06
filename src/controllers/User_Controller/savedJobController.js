import SAVED_JOB from "../../models/savedJobs.js";

// 1. Save a job
export const saveJob = async (req, res) => {
    try {
        const { job_id } = req.body;
        const user_id = req.user.userId;
        // Check if already saved
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
        // const { user_id } = req.params;  // User ID from request params
        const user_id = req.user.userId;

        const savedJobs = await SAVED_JOB.find({ user_id }).populate("job_id"); // Populate job details
        res.status(200).json(savedJobs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Remove a saved job
export const removeSavedJob = async (req, res) => {
    try {
        const { job_id } = req.body;
        const user_id = req.user.userId;
        await SAVED_JOB.findOneAndDelete({ user_id, job_id });

        res.status(200).json({ message: "Saved job removed successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
