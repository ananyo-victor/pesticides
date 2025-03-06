import jwt from "jsonwebtoken";
import JOB_POST from "../../models/job-post.js";
import dotenv from "dotenv";
dotenv.config();

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
            LastDate
        } = req.body;
        
        if (!CompanyName || !Title || !JobType || !Location || !JobDescription || !Salary || !Experience || !SkillsReq || !Vacancy || !LastDate) {
            console.log("Missing fields:", {
                CompanyName: CompanyName || "Missing",
                Title: Title || "Missing",
                JobType: JobType || "Missing",
                Location: Location || "Missing",
                JobDescription: JobDescription || "Missing",
                Salary: Salary || "Missing",
                Experience: Experience || "Missing",
                SkillsReq: SkillsReq || "Missing",
                Vacancy: Vacancy || "Missing",
                LastDate: LastDate || "Missing"
            });
            return res.status(400).json({ message: "All fields are required", key: "error" });
        }
        
        // Creating a new job post
        const newJob = new JOB_POST({
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
            HRId : req.user.userId
        });

        await newJob.save();

        res.status(200).json({ message: "Job posted successfully", job: newJob,key:"success" });
    } catch (error) {
        res.status(500).json({ message: "Error creating job post", error: error.message });
    }
};
