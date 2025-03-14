import multer from "multer";
import path from "path";
import cloudinary from "cloudinary";
import { v4 as uuidv4 } from 'uuid';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Temporary storage before uploading to Cloudinary
    },
    filename: (req, file, cb) => {
        cb(null, `${uuidv4()}-${file.originalname}`);
    }
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

export const uploadToCloudinary = async (filePath, folder) => {
    return await cloudinary.v2.uploader.upload(filePath, {
        folder: folder,
        resource_type: 'auto'
    });
};