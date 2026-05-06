import { generateAIForContent } from "../Config/ai.js";
import CapturedContent from "../Models/contentModel.js";

export const saveCapturedData = async (req, res) => {
  try {
    const { url, title, type, content, aiData } = req.body;
    const userId = req.user.id || req.user._id;

    if (!url) {
      return res.status(400).json({ message: "URL is required." });
    }

    // 1️⃣ Privacy Protection Logic
    if (req.user && req.user.blacklistedDomains) {
      try {
        const urlObj = new URL(url);
        const isBlacklisted = req.user.blacklistedDomains.some(domain => urlObj.hostname.includes(domain));
        if (isBlacklisted) {
          return res.status(403).json({ message: "Capture blocked: Domain is blacklisted for privacy." });
        }
      } catch (e) {
        console.warn("Invalid URL format parsed checking privacy blacklist:", url);
      }
    }

    // 2️⃣ Advanced Deduplication Logic (URL + Title)
    const duplicateQuery = { userId, $or: [{ url }] };
    if (title && title.trim() !== "") {
      duplicateQuery.$or.push({ title });
    }
    
    let savedContent = await CapturedContent.findOne(duplicateQuery);

    if (!savedContent) {
      const newContent = new CapturedContent({
        userId,
        url,
        title,
        content, // Save raw text
        type,
        status: "processing", // Setting status explicitly
        aiData: aiData || {},
        screenshot: req.body.screenshot || "",
        reason: req.body.reason || ""
      });
      savedContent = await newContent.save();
    }

    // --- Trigger AI analysis immediately & await result to send back ---
    try {
      const processedContent = await generateAIForContent(savedContent._id, userId);
      return res.status(201).json({
        ok: true,
        id: processedContent._id,
        message: "Content saved successfully and AI analysis complete.",
        aiData: processedContent.aiData,
        data: processedContent
      });
    } catch (err) {
      console.error("❌ AI analysis failed during capture:", err);
      // Return the saved raw content even if AI fails
      savedContent.status = "error";
      await savedContent.save();
      
      return res.status(201).json({
        ok: true,
        id: savedContent._id,
        message: "Content saved, but AI analysis failed or is pending.",
        data: savedContent
      });
    }

  } catch (error) {
    console.error("Error saving content:", error);
    return res.status(500).json({ message: "Server error while saving content." });
  }
};

// Get all the content data for the web dashboard
export const getUserContent = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id; // from JWT middleware
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

