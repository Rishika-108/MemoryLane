import CapturedContent from "../Models/contentModel.js";
import { generateEmbedding } from "../Config/ai.js";
import mongoose from "mongoose";

export const searchContent = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id; // from authMiddleware
    const { keyword, tag, mood, startDate, endDate, semanticQuery } = req.body;

    // --- Vector Search Execution ---
    if (semanticQuery && semanticQuery.trim() !== "") {
      const queryEmbedding = await generateEmbedding(semanticQuery.trim());
      
      const pipeline = [
        {
          $vectorSearch: {
            index: "vector_index", // Must match your Atlas App Services Vector Index name exactly
            path: "embedding",
            queryVector: queryEmbedding,
            numCandidates: 100, 
            limit: 20
          }
        }
      ];

      // Add $match to filter securely by user and additional metrics
      const matchFilter = { userId: new mongoose.Types.ObjectId(userId) };
      
      if (tag && tag.trim() !== "") matchFilter["aiData.tags"] = { $in: [tag.trim()] };
      if (mood && mood.trim() !== "") matchFilter["aiData.sentiment"] = mood.trim();
      if (startDate || endDate) {
        matchFilter.timestamp = {};
        if (startDate) matchFilter.timestamp.$gte = new Date(startDate);
        if (endDate) matchFilter.timestamp.$lte = new Date(endDate);
      }

      pipeline.push({ $match: matchFilter });

      const results = await CapturedContent.aggregate(pipeline);
      return res.status(200).json({ count: results.length, data: results });
    }

    // --- Standard MongoDB Query Execution ---
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
