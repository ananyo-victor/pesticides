import Application from '../models/application.js';

export const applyForJob = async (req, res) => {
  try {
    const { userId, jobId, hrId, resume, coverLetter, skills, location, status } = req.body;

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
      skills,
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

