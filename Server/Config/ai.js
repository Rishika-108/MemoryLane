import mongoose from "mongoose";
import CapturedContent from "../Models/contentModel.js";
import fetch from "node-fetch";

export const generateEmbedding = async (text) => {
  try {
    const AI_KEY = process.env.GEMINI_API_KEY  // Keep fallback for test execution
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${AI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "models/text-embedding-004",
          content: { parts: [{ text }] },
        }),
      }
    );

    const data = await response.json();
    return data?.embedding?.values || [];
  } catch (err) {
    console.error("❌ Embedding generation failed:", err);
    return [];
  }
};

export const generateAIForContent = async (id, userId) => {
  try {
    // 1️⃣ Validate ObjectId (skip if just internal, but good for safety)
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid content ID.");
    }

    // 2️⃣ Fetch user content
    const content = await CapturedContent.findOne({ _id: id, userId });
    if (!content) {
      throw new Error("Content not found or unauthorized.");
    }

    const textToAnalyze = `${content.title}\n${content.content || ""}`.trim();
    if (!textToAnalyze) {
      throw new Error("Content has no text to analyze.");
    }

    // 3️⃣ Prepare Gemini prompt
    const AI_KEY = process.env.GEMINI_API_KEY;
    if (!AI_KEY) {
      throw new Error("Missing Gemini API key in environment variables.");
    }

    const promptText = `
You are a powerful content analysis assistant. You are given a title and the raw text content of a webpage. 
Your task is to analyze the text and generate a detailed, structured JSON output. 

Follow these instructions exactly:

1. Summarization:
   Condense the text into 2–3 sentences that preserve the core meaning. 

2. Sentiment & Emotion Analysis:
   Detect the overall sentiment (positive, neutral, negative) and the emotional tone (e.g., inspiring, informative, funny, stressful).

3. Topic Tagging & Categorization:
   Automatically assign 3–5 relevant tags or categories that describe the main topics or themes.

4. Content Type Identification:
   Identify the content type: Article, News, Tweet, Video (if transcript provided), Blog, or Research.

Return ONLY a single JSON object with the following structure:

{
  "summary": "2–3 sentence concise summary",
  "sentiment": "positive | neutral | negative",
  "emotion": "emotional tone",
  "tags": ["3–5 keywords"],
  "category": "main category",
  "contentType": "Article | News | Tweet | Video | Blog | Research"
}

Title: "${content.title}"
Raw Text Content:
---
${content.content ? content.content.slice(0, 15000) : "No content provided"}
---
`;



    const payload = {
      contents: [
        {
          role: "user",
          parts: [{ text: promptText }],
        },
      ],
    };

    // 4️⃣ Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${AI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const rawText = await response.text();
    console.log("🔍 Gemini raw response:\n", rawText);

    // 5️⃣ Parse Gemini response safely
    let aiResult = {};
    try {
      const result = JSON.parse(rawText);
      const textResponse = result?.candidates?.[0]?.content?.parts?.[0]?.text || "";

      // Extract JSON object from Gemini text output
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiResult = JSON.parse(jsonMatch[0]);
      } else {
        console.warn("⚠️ No valid JSON found in Gemini response text.");
      }
    } catch (err) {
      console.error("❌ Failed to parse Gemini response:", err);
    }

    // 6️⃣ Update aiData fields
    content.aiData = {
      summary: aiResult.summary || "",
      sentiment: aiResult.sentiment || "",
      emotion: aiResult.emotion || "",
      tags: aiResult.tags || [],
      keywords: aiResult.keywords || aiResult.tags || [],
      category: aiResult.category || "",
    };

    // 6.5️⃣ Generate Atlas Vector Search Embedding
    const textToEmbed = `Title: ${content.title}. Summary: ${aiResult.summary || ""} Tags: ${(aiResult.tags || []).join(", ")}`;
    content.embedding = await generateEmbedding(textToEmbed);

    // 7️⃣ Mark as processed and save
    content.status = "processed";
    await content.save();

    return content;

  } catch (err) {
    console.error("❌ generateAIForContent Error:", err);
    throw err;
  }
};

export const analyzeContent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id || req.user._id;

    const content = await generateAIForContent(id, userId);

    return res.status(200).json({
      message: "Content analyzed successfully.",
      aiData: content.aiData,
    });
  } catch (err) {
    console.error("❌ analyzeContent Response Error:", err);
    return res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
