import CapturedContent from "../Models/contentModel.js";
export const searchContent = async (req, res) => {
  try {
    const userId = req.user.id; // from authMiddleware
    const { keyword, tag, mood, startDate, endDate } = req.body;

    const query = { userId };

    if (keyword && keyword.trim() !== "") {
      query.$text = { $search: keyword.trim() };
    }

    if (tag && tag.trim() !== "") {
      query["aiData.tags"] = { $in: [tag.trim()] };
    }

    if (mood && mood.trim() !== "") {
      query["aiData.sentiment"] = mood.trim();
    }


    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const results = await CapturedContent.find(query)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: results.length,
      data: results,
    });

  } catch (error) {
    console.error("Error searching content:", error);
    return res.status(500).json({
      message: "Server error while searching content.",
    });
  }
};
