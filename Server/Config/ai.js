import mongoose from "mongoose";
import CapturedContent from "../Models/contentModel.js";
import {
  generateGroqAIAnalysis,
  generateHFEmbedding,
  cleanTextForAI,
} from "../Services/aiService.js";

// Lightweight queue to avoid API burst/rate limits
let aiQueue = Promise.resolve();

/**
 * Orchestrates the full AI pipeline for a piece of content:
 * 1. Groq (Llama 3.1) for Summarization and Analysis
 * 2. Hugging Face (BGE-Small) for Vector Search Embeddings
 */
export const generateAIForContent = async (id, userId) => {
  return (aiQueue = aiQueue
    .then(async () => {
      try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new Error("Invalid content ID.");
        }

        const content = await CapturedContent.findOne({ _id: id, userId });
        if (!content) {
          throw new Error("Content not found or unauthorized.");
        }

        content.status = "processing";
        await content.save();

        const cleanedContent = cleanTextForAI(content.content || "");
        const textToAnalyze = `Title: ${content.title || "Untitled"}\n\nContent:\n${cleanedContent}`;

        if (!textToAnalyze.trim()) {
          throw new Error("No content available for analysis.");
        }

        // 1️⃣ Run Groq AI Analysis
        const aiResult = await generateGroqAIAnalysis(textToAnalyze);

        content.aiData = {
          summary: aiResult.summary || "",
          sentiment: aiResult.sentiment || "neutral",
          emotion: aiResult.emotion || "",
          tags: aiResult.tags || [],
          keywords: aiResult.tags || [],
          category: aiResult.category || "",
          contentType: aiResult.contentType || "",
        };

        // 2️⃣ Generate Embedding using Hugging Face
        const embeddingText = `Title: ${content.title}\n\nSummary: ${aiResult.summary || ""}`;
        content.embedding = await generateHFEmbedding(embeddingText);

        content.status = "processed";
        await content.save();

        return content;
      } catch (err) {
        console.error("❌ AI Pipeline Error:", err.message);

        try {
          await CapturedContent.findByIdAndUpdate(id, { status: "failed" });
        } catch (dbErr) {
          console.error("❌ Could not update failure status:", dbErr.message);
        }

        throw err;
      }
    })
    .catch((err) => {
      console.error("Queue Task Failed:", err.message);
    }));
};

/**
 * Controller endpoint to manually trigger/re-run AI analysis
 */
export const analyzeContent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id || req.user._id;

    const content = await generateAIForContent(id, userId);

    return res.status(200).json({
      message: "Content analyzed successfully.",
      aiData: content?.aiData || {},
    });
  } catch (err) {
    console.error("❌ analyzeContent Controller Error:", err.message);
    return res.status(500).json({
      message: err.message || "Internal Server Error",
    });
  }
};