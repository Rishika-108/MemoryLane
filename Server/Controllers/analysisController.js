import CapturedContent from "../Models/contentModel.js";
export const getUserAnalytics = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware (JWT decoded user)

    // Aggregate analytics
    const analytics = await CapturedContent.aggregate([
      // Filter by userId
      { $match: { userId: userId } },

      // Group to get counts per mood and per type
      {
        $facet: {
          moodDistribution: [
            { $match: { "aiData.sentiment": { $ne: "" } } },
            { $group: { _id: "$aiData.sentiment", count: { $sum: 1 } } },
            { $project: { _id: 0, mood: "$_id", count: 1 } }
          ],
          contentTypeDistribution: [
            { $group: { _id: "$type", count: { $sum: 1 } } },
            { $project: { _id: 0, type: "$_id", count: 1 } }
          ],
          totalProcessed: [
            { $match: { status: "processed" } },
            { $count: "totalProcessed" }
          ]
        }
      }
    ]);

    // Extract results cleanly
    const result = analytics[0] || {
      moodDistribution: [],
      contentTypeDistribution: [],
      totalProcessed: []
    };

    res.status(200).json({
      success: true,
      message: "User analytics fetched successfully",
      data: {
        moodDistribution: result.moodDistribution,
        contentTypeDistribution: result.contentTypeDistribution,
        totalProcessed: result.totalProcessed[0]?.totalProcessed || 0
      }
    });

  } catch (error) {
    console.error("Error in getUserAnalytics:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user analytics",
      error: error.message
    });
  }
};
