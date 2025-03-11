import Application from "../../models/application.js";
import { AppliedJobsService } from "../../service/userServices/appliedJobService.js";


export const AppliedJobs = async (req, res) => {
    try {
        const response = await AppliedJobsService(req, res);
        if (response) {
            return res.status(response.status).json(response);
        } else {
            res.status(400).json({ message: 'Failed to submit application.' });
        }
    } catch (error) {
        console.error('Error fetching applied jobs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

