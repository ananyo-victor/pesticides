import jwt from "jsonwebtoken";
import JOB_POST from "../../models/job-post.js";

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

        // Extract token from headers
        const token = req.headers.authorization?.split(" ")[1];
        localStorage.setItem(token);
        console.log("auth " ,req.headers.authorization)
        console.log("token is " ,token);
        if (!token) {
            return res.status(403).json({ message: "Access denied. No token provided." });
           
        }

        // Verify and decode token
        let HRId;
        try {
            const decoded = jwt.verify(token,  "your_jwt_secret"); // Use the same secret from signUpHR
            HRId = decoded.userId;
        } catch (error) {
            return res.status(401).json({ message: "Invalid token" });
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
            HRId
        });

        await newJob.save();

        res.status(201).json({ message: "Job posted successfully", job: newJob });
    } catch (error) {
        res.status(500).json({ message: "Error creating job post", error: error.message });
    }
};
