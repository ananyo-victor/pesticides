import Application from '../../models/application.js';
import multer from 'multer';
import path from 'path';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/resumes'); // Directory to save uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only .pdf files are allowed!'));
    }
  }
}).single('resume'); // 'resume' is the field name for the file

export const applyForJob = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      console.log("Application page is here");
       console.log("Request body: ", req.body);

      const { coverLetter, location, hrId, experience } = req.body;
      const userId = req.user.userId;
      const jobId = req.params.jobId; 

      // console.log("User ID: ", userId);
      // console.log("Job ID: ", jobId);
      // console.log("resume", req.file.path);

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
        resume: req.file ? req.file.path : null, 
        coverLetter,
        location: JSON.parse(location),
        status: 'Pending',
        experience: Number(experience)
      });

      // console.log("new Application : ", newApplication);

      await newApplication.save();

      res.status(201).json({
        message: 'Application submitted successfully!',
        application: newApplication,
      });

    } catch (error) {
      console.error('Error while applying for job:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
};

