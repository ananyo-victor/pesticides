import Application from "../../models/application.js";  // Assuming this is the Application model

// Aggregation pipeline to get HR dashboard data
const hrDash = async () => {
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

    // console.log("Aggregation result:", result); // Log the aggregation result

    // Transform the aggregated data to return it in a usable format for the frontend
    const monthsApplications = Array(12).fill(0); // Initialize array with 12 zeros
    const monthsHireStatus = Array(12).fill(0); // Initialize array with 12 zeros

    result.forEach(item => {
      const month = item._id.month - 1; // Mongo months are 1-indexed (1 = January), JS array is 0-indexed
      monthsApplications[month] = item.totalApplications;
      monthsHireStatus[month] = item.hiredApplications;
    });

    // console.log("Months Applications:", monthsApplications); // Log the transformed data
    // console.log("Months Hire Status:", monthsHireStatus); // Log the transformed data

    return { monthsApplications, monthsHireStatus }; // Return the formatted data
  } catch (error) {
    console.error("Error aggregating applications:", error);
    throw new Error("Error aggregating applications");
  }
};

// Route handler for HR dashboard data
const hrDashboard = async (req, res) => {
  try {
    // Call the hrDash function to get aggregated data
    const data = await hrDash();
    res.status(200).json(data); // Send the aggregated data as a JSON response
  } catch (error) {
    console.error("Error fetching HR dashboard data:", error);
    res.status(500).json({ message: "Error fetching HR dashboard data" }); // Handle errors gracefully
  }
};

export default hrDashboard;