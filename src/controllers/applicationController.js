import Application from '../models/application.js';
import {verifyTokens} from '../middlewares/verifyTokens.js'


export const applyForJob = async (req, res) => {
  try {
    const {  resume, coverLetter, location } = req.body;
    const userId = req.user.id;
    const hrId = req.hr.id;
    const jobId = req.job.id;

    const existingApplication = await Application.findOne({ userId, jobId });

    if (existingApplication) {
      return res.status(400).json({
        message: 'User has already applied for this job.',
        application: existingApplication, 
      });
    }

    
    const newApplication = new Application({
      userId,
      jobId,
      hrId,
      resume,
      coverLetter,
      location,
      status : 'pending',
    });

    await newApplication.save();

    res.status(201).json({
      message: 'Application submitted successfully!',
      application: newApplication,
    });

  } catch (error) {
    console.error('Error while applying for job:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

