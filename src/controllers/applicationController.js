import Application from '../models/application.js';
import { verifyTokens } from '../middlewares/verifyTokens.js'


export const applyForJob = async (req, res) => {
  try {
    console.log(" Applicatoin page is  hereeeeeeee")
    const {  resume, coverLetter, location , hrId } = req.body;
    const userId = req.user.id;
    // const hrId = req.hr.id;
    const jobId = req.params.jobId;

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
      experience
    });
    console.log(newApplication);

    await newApplication.save();
       
    console.log("Request body: ", req.body);
    console.log("Headers: ", req.headers);

    res.status(201).json({
      message: 'Application submitted successfully!',
      application: newApplication,
    });

  } catch (error) {
    console.error('Error while applying for job:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

