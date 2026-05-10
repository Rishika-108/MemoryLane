import CapturedContent from "../Models/contentModel.js";
import { generateEmbedding } from "../Services/aiService.js";
import mongoose from "mongoose";

export const searchContent = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id; // from authMiddleware
    const { keyword, tag, mood, startDate, endDate, semanticQuery } = req.body;

    // --- Vector Search Execution ---
    const isSemantic = semanticQuery && semanticQuery.trim() !== "";
    const isEmotionSearch = mood && mood.trim() !== "";

    if (isSemantic || isEmotionSearch) {
      const actualQuery = isSemantic ? semanticQuery.trim() : `Emotion: ${mood.trim()}`;
      const queryEmbedding = await generateEmbedding(actualQuery);

      if (!queryEmbedding || queryEmbedding.length === 0) {
        return res.status(200).json({ count: 0, data: [], message: "Could not generate AI embedding for search." });
      }

      const pipeline = [
        {
          $vectorSearch: {
            index: "vector_index",
            path: "embedding",
            queryVector: queryEmbedding,
            numCandidates: 100,
            limit: 20
          }
        },
        {
          $set: {
            score: { $meta: "vectorSearchScore" }
          }
        },
        {
          $match: {
            score: { $gt: 0.6 } // Threshold to filter out irrelevant results
          }
        },
        {
          $sort: { score: -1 }
        }
      ];

      // Add $match to filter securely by user and additional metrics
      const matchFilter = { userId: new mongoose.Types.ObjectId(userId) };

      if (tag && tag.trim() !== "") matchFilter["aiData.tags"] = { $in: [tag.trim()] };

      // If it's a semantic search but NOT explicitly an emotion search, 
      // we can still apply the mood filter if the user provided one in addition to the semantic query.
      if (!isEmotionSearch && mood && mood.trim() !== "") {
        const moodVal = mood.trim();
        matchFilter.$or = [
          { "aiData.sentiment": { $regex: moodVal, $options: "i" } },
          { "aiData.emotion": { $regex: moodVal, $options: "i" } }
        ];
      }
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
      const moodVal = mood.trim();
      query.$or = query.$or || [];
      query.$or.push(
        { "aiData.sentiment": { $regex: moodVal, $options: "i" } },
        { "aiData.emotion": { $regex: moodVal, $options: "i" } }
      );
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
