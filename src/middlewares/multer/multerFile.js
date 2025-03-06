import multer from "multer";


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      if (file.fieldname === 'profilePic') {
        console.log("profile");
        cb(null, 'uploads/profile/'); // Directory where profile images will be stored
      } else if (file.fieldname === 'resume') {
        console.log("resume");

        cb(null, 'uploads/resumes/'); // Directory where resumes will be stored
      }
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
    },
  });
  
export const upload = multer({ storage: storage }).fields([
    { name: 'profilePic', maxCount: 1 },
    { name: 'resume', maxCount: 1 }
  ]);