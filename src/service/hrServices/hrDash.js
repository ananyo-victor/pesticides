import mongoose from "mongoose";
import Application from "../../models/application.js";  // Assuming this is the Application model
import HR from "../../models/hr.js";  // Assuming this is the HR model

// Aggregation pipeline to get HR dashboard data
const hrDash = async (hr) => {
  try {
    // MongoDB aggregation pipeline
    const result = await Application.aggregate([
      {
        $match: {
          status: { $in: ["Pending", "Accepted"] }, // Filter by Pending or Accepted status
        },
      },
      {
        $project: {
          hrId: 1,
          status: 1,
          appliedAt: 1,
          month: { $month: "$appliedAt" }, // Extract month from the appliedAt field
          year: { $year: "$appliedAt" },   // Extract year from the appliedAt field
        },
      },
      {
        $group: {
          _id: {
            hrId: "$hrId",   // Group by HR ID
            year: "$year",   // Group by year
            month: "$month", // Group by month
          },
          totalApplications: { $sum: 1 }, // Count total applications
          hiredApplications: {
            $sum: {
              $cond: [{ $eq: ["$status", "Accepted"] }, 1, 0], // Count accepted applications
            },
          },
        },
      },
      {
        $sort: {
          "_id.year": 1,    // Sort by year in ascending order
          "_id.month": 1,   // Then sort by month in ascending order
        },
      },
 
    ]);
    const hrData = await HR.find({ _id: new mongoose.Types.ObjectId(hr) }, { name: 1 });

    // Transform the aggregated data to return it in a usable format for the frontend
    const monthsApplications = Array(12).fill(0); // Initialize array with 12 zeros
    const monthsHireStatus = Array(12).fill(0);

    result.forEach(item => {
      const month = item._id.month - 1; // Mongo months are 1-indexed (1 = January), JS array is 0-indexed
      monthsApplications[month] = item.totalApplications;

    });

    // console.log("Months Applications:", monthsApplications); // Log the transformed data
    // console.log("Months Hire Status:", monthsHireStatus); // Log the transformed data

    return {
      monthsApplications, monthsHireStatus,
      // hrNames: result.map(item => item.hrName),
      hrNames: hrData[0].name
    }; // Return the formatted data
  } catch (error) {
    console.error("Error aggregating applications:", error);
    throw new Error("Error aggregating applications");
  }
};

// Route handler for HR dashboard data
const hrDashboard = async (req, res) => {
  try {
    const hr = req.user.userId;
    // console.log("Fetching HR dashboard data..."); // Log the start of the request
    // Call the hrDash function to get aggregated data

    const data = await hrDash(hr);

    res.status(200).json(data); // Send the aggregated data as a JSON response
  } catch (error) {
    console.error("Error fetching HR dashboard data:", error);
    res.status(500).json({ message: "Error fetching HR dashboard data" }); // Handle errors gracefully
  }
};

export default hrDashboard;