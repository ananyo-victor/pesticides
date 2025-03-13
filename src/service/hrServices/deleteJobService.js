import JOB_POST from "../../models/job-post.js";

/**
 * Delete job post by ID (Only HR who created it can delete)
 */
export const deleteJobPostService = async (jobId, hrId) => {
    console.log(jobId,hrId);
    try {
        const job = await JOB_POST.findOne({ _id: jobId, HRId: hrId });

        if (!job) {
            throw new Error("Job not found or you are not authorized to delete it.");
            // console.log(jobId);
            // console.log(hrId);
        }

        job.isActive = false; // Soft delete by setting isActive to false
        await job.save();

        return { success: true, message: "Job post marked as inactive (soft deleted)" };
    } catch (error) {
        throw new Error(error.message);
    }
};

/**
 * Auto-delete expired job posts
 */
export const deleteExpiredJobService = async () => {
    try {
        const currentDate = new Date();
        const result = await JOB_POST.updateMany(
            { LastDate: { $lt: currentDate }, isActive: true },
            { $set: { isActive: false } }
        );

        console.log(`${result.modifiedCount} expired job(s) marked as inactive.`);
    } catch (error) {
        console.error("Error marking expired jobs as inactive:", error.message);
    }
};
