import multer from "multer";
import path from "path";

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

const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'profilePic') {
        // Accept only jpg, jpeg, png files for profilePic
        const filetypes = /jpg|jpeg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only .jpg, .jpeg, .png files are allowed for profilePic!'));
        }
    } else if (file.fieldname === 'resume') {
        // Accept only pdf files for resume
        const filetypes = /pdf/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only .pdf files are allowed for resume!'));
        }
    }
};

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB
}).fields([
    { name: 'profilePic', maxCount: 1 },
    { name: 'resume', maxCount: 1 }
]);