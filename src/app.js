import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import HR_Routes from "./routes/HR_Routes.js";
import savedJobRoutes from "./routes/savedJobRoutes.js";
import stripeRoutes from "./routes/stripeRoutes.js"; // Import Stripe routes

const app = express();
const corsOptions = {
    origin: '*',
    methods: 'GET, POST, PUT, DELETE',
    // credentials: true,
    // optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions)); // Add CORS middleware
app.use(express.json()); // Add JSON body parsing middleware
app.use(express.urlencoded({ extended: true })); // Add URL-encoded body parsing middleware
  
// Database connection
connectDB();

// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/hr', HR_Routes);
app.use("/api", savedJobRoutes);
app.use('/stripe', stripeRoutes); // Add Stripe routes

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});