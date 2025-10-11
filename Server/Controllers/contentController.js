import { analyzeContent } from "../Config/ai.js";
import CapturedContent from "../Models/contentModel.js";

// Saves the captured content from browser extension and AI processing to the database
// export const saveCapturedData = async (req, res) => {
//   try {
//     const { url, title, type, aiData } = req.body;

//     // Basic validation
//     if (!url) {
//       return res.status(400).json({ message: "URL is required." });
//     }

//     const newContent = new CapturedContent({
//       userId: req.user.id, // from auth middleware
//       url,
//       title,
//       type,
//       aiData: aiData || {},
//       screenshot: req.body.screenshot || "",
//       reason: req.body.reason || ""

//     });

//     const savedContent = await newContent.save();
//     return res.status(201).json({
//       message: "Content saved successfully.",
//       data: savedContent,
//     });
//   } catch (error) {
//     console.error("Error saving content:", error);
//     return res.status(500).json({ message: "Server error while saving content." });
//   }
// };

export const saveCapturedData = async (req, res) => {
  try {
    const { url, title, type, aiData } = req.body;

    if (!url) {
      return res.status(400).json({ message: "URL is required." });
    }

    const newContent = new CapturedContent({
      userId: req.user.id,
      url,
      title,
      type,
      aiData: aiData || {},
      screenshot: req.body.screenshot || "",
      reason: req.body.reason || ""
    });

    const savedContent = await newContent.save();

    // --- Trigger AI analysis immediately ---
    // Call the runAnalyser logic directly (without HTTP request)
    analyzeContent(savedContent._id, req.user.id).catch(err => {
      console.error("❌ AI analysis failed:", err);
    });

    return res.status(201).json({
      message: "Content saved successfully and AI analysis triggered.",
      data: savedContent,
    });
  } catch (error) {
    console.error("Error saving content:", error);
    return res.status(500).json({ message: "Server error while saving content." });
  }
};


// Get all the content data for the web dashboard
export const getUserContent = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT middleware
    const { type, status } = req.query; // optional filters

    const filter = { userId };
    if (type) filter.type = type;
    if (status) filter.status = status;

    const content = await CapturedContent.find(filter)
      .sort({ createdAt: -1 }); // newest first

    return res.status(200).json({
      count: content.length,
      data: content,
    });
  } catch (error) {
    console.error("Error fetching user content:", error);
    return res.status(500).json({ message: "Server error while fetching content." });
  }
};

export const runAnalyser = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid content ID." });
    }

    // 1️⃣ Fetch the content
    const content = await CapturedContent.findOne({ _id: id, userId });
    if (!content) {
      return res.status(404).json({ message: "Content not found or unauthorized." });
    }

    const textToAnalyze = `${content.title}\n${content.url || ""}`;
    if (!textToAnalyze.trim()) {
      return res.status(400).json({ message: "Content has no text to analyze." });
    }

    // 2️⃣ Call AI service
    const payload = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
You are a cognitive coach. Analyze the following content and generate exactly one object with:
- "summary": 2–3 sentence summary
- "sentiment": positive / neutral / negative
- "tags": 3–6 relevant keywords
- "category": 1–2 words classification

Content:
"${textToAnalyze}"
              `,
            },
          ],
        },
      ],
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const rawText = await response.text();

    // 3️⃣ Parse AI response safely
    let parsedData = [];
    try {
      // Extract JSON array/object from the text
      const jsonMatch = rawText.match(/\{[\s\S]*\}/) || rawText.match(/\[\s*{[\s\S]*}\s*\]/);
      const jsonString = jsonMatch ? jsonMatch[0] : rawText;
      parsedData = JSON.parse(jsonString);
    } catch (err) {
      console.error("❌ Failed to parse AI response:", err);
    }

    // 4️⃣ Map AI output to aiData
    const aiResult = parsedData || {};
    content.aiData = {
      summary: aiResult.summary || "",
      sentiment: aiResult.sentiment || "",
      emotion: aiResult.emotion || "",
      tags: aiResult.tags || [],
      keywords: aiResult.tags || [], // reuse tags as keywords if not provided
      category: aiResult.category || "",
    };

    content.status = "processed"; // update processing status
    await content.save();

    res.status(200).json({
      message: "Content analyzed successfully.",
      aiData: content.aiData,
    });

  } catch (err) {
    console.error("❌ runAnalyser Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const analyzeContentById = async (contentId, userId) => {
  try {
    const content = await CapturedContent.findOne({ _id: contentId, userId });
    if (!content) throw new Error("Content not found for analysis");

    const textToAnalyze = `${content.title}\n${content.url || ""}`.trim();
    if (!textToAnalyze) throw new Error("Content has no text to analyze");

    // --- Gemini prompt ---
    const AI_KEY = process.env.GEMINI_API_KEY;
    if (!AI_KEY) throw new Error("Missing Gemini API key");

    const promptText = `... same prompt as in analyzeContent ...`;

    const payload = { contents: [{ role: "user", parts: [{ text: promptText }] }] };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${AI_KEY}`,
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }
    );

    const rawText = await response.text();

    let aiResult = {};
    try {
      const result = JSON.parse(rawText);
      const textResponse = result?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) aiResult = JSON.parse(jsonMatch[0]);
    } catch (err) {
      console.error("❌ Failed to parse Gemini response:", err);
    }

    content.aiData = {
      summary: aiResult.summary || "",
      sentiment: aiResult.sentiment || "",
      emotion: aiResult.emotion || "",
      tags: aiResult.tags || [],
      keywords: aiResult.keywords || aiResult.tags || [],
      category: aiResult.category || "",
    };
    content.status = "processed";
    await content.save();

    console.log(`✅ AI analysis finished for ${contentId}`);
    return content;
  } catch (err) {
    console.error("❌ analyzeContentById error:", err);
    throw err;
  }
};
export const runConnector = async (contentId, userId) => {
  const updatedContent = await analyzeContentById(contentId, userId);
  console.log("📊 Updated AI Data:", updatedContent.aiData);
  return updatedContent;
};
