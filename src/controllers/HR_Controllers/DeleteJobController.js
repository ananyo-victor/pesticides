import { deleteJobPostService } from "../../service/hrServices/deleteJobService.js";


export const DeleteJobPost = async (req, res) => {
    try {
        const jobId = req.params.Id;
        const hrId = req.user.userId; // Extract HR ID from token

        const result = await deleteJobPostService(jobId, hrId);

        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};