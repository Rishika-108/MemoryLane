import mongoose from "mongoose";
import CapturedContent from "../Models/contentModel.js";
import fetch from "node-fetch";

export const analyzeContent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // 1️⃣ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid content ID." });
    }

    // 2️⃣ Fetch user content
    const content = await CapturedContent.findOne({ _id: id, userId });
    if (!content) {
      return res.status(404).json({ message: "Content not found or unauthorized." });
    }

    const textToAnalyze = `${content.title}\n${content.url || ""}`.trim();
    if (!textToAnalyze) {
      return res.status(400).json({ message: "Content has no text to analyze." });
    }

    // 3️⃣ Prepare Gemini prompt
    const AI_KEY = process.env.GEMINI_API_KEY;
    if (!AI_KEY) {
      return res.status(500).json({ message: "Missing Gemini API key in environment variables." });
    }

    const promptText = `
You are a powerful content analysis assistant. You are given a title and a URL. 
Your task is to analyze the content behind the URL (article, post, tweet, video, or blog) 
and generate a detailed, structured JSON output. 

Follow these instructions exactly:

1. Summarization:
   Condense the captured content into 2–3 sentences that preserve the core meaning. 
   If it is a video, use the title/description and infer the key points.

2. Sentiment & Emotion Analysis:
   Detect the overall sentiment (positive, neutral, negative) and the emotional tone (e.g., inspiring, informative, funny, stressful).

3. Topic Tagging & Categorization:
   Automatically assign 3–5 relevant tags or categories that describe the main topics or themes (e.g., AI, Startups, Mental Health, Productivity, Education).

4. Content Type Identification:
   Identify the content type:
   - Article
   - News piece
   - Tweet / social post
   - Video (transcript)
   - Blog / opinion piece
   - Research / educational material

Return ONLY a single JSON object with the following structure:

{
  "summary": "2–3 sentence concise summary of the content",
  "sentiment": "positive | neutral | negative",
  "emotion": "underlying emotional tone (e.g., inspiring, funny, informative, stressful)",
  "tags": ["3–5 relevant keywords or topics"],
  "category": "main content category (1–2 words)",
  "contentType": "Article | News | Tweet | Video | Blog | Research"
}

Title: "${content.title}"
URL: "${content.url}"
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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${AI_KEY}`,
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
      tags: aiResult.tags || [],
      keywords: aiResult.keywords || aiResult.tags || [],
      category: aiResult.category || "",
    };

    // 7️⃣ Mark as processed and save
    content.status = "processed";
    await content.save();

    return res.status(200).json({
      message: "Content analyzed successfully.",
      aiData: content.aiData,
    });

  } catch (err) {
    console.error("❌ analyzeContent Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
