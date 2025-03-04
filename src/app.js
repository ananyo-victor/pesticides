import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import HR_Routes from "./routes/HR_Routes.js";

const app = express();
const corsOptions = {
    origin: '*',
    methods: 'GET, POST, PUT, DELETE',
    // credentials: true,
    // optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions)); // Add CORS middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
connectDB();

// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/hr', HR_Routes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});