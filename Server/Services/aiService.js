import fetch from "node-fetch";
import { pipeline } from "@xenova/transformers";

/**
 * ================================
 * LOCAL EMBEDDINGS CONFIG
 * ================================
 */
let extractor = null;
const getExtractor = async () => {
  if (!extractor) {
    // Using BGE-Base which is much smaller (~100MB) than MPNet, 
    // fitting within Render's 512MB RAM while still providing 768 dimensions.
    extractor = await pipeline("feature-extraction", "Xenova/bge-base-en-v1.5");
  }
  return extractor;
};

/**
 * ================================
 * ENV CONFIG
 * ================================
 */

// GROQ
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

/**
 * ================================
 * CLEAN TEXT
 * ================================
 */
export const cleanTextForAI = (text = "") => {
  return text
    .replace(/\s+/g, " ")
    .replace(/[^\S\r\n]+/g, " ")
    .trim()
    .slice(0, 8000);
};

/**
 * ================================
 * SAFE JSON EXTRACTION
 * ================================
 */
const extractJSON = (text = "") => {
  try {
    let cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const firstOpen = cleaned.indexOf("{");
    const lastClose = cleaned.lastIndexOf("}");
    if (firstOpen !== -1 && lastClose !== -1) {
      cleaned = cleaned.substring(firstOpen, lastClose + 1);
    }
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("❌ JSON Extraction failed:", text.slice(0, 150));
    return {};
  }
};

/**
 * ================================
 * GROQ AI ANALYSIS
 * ================================
 */
export const generateGroqAIAnalysis = async (text) => {
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  try {
    if (!GROQ_API_KEY) throw new Error("Missing GROQ_API_KEY in environment.");

    const prompt = `
Summarize the following content comprehensively. 
Provide a concise 2-3 sentence summary that captures the main points, not just a snippet or the heading.
Return ONLY valid JSON in the following format:
{
  "summary": "Concise but meaningful summary of the content",
  "sentiment": "positive|neutral|negative",
  "emotion": "Specific emotional tone. Avoid generic 'Professional' or 'Informative'. Instead use descriptive terms like: Curious, Inspiring, Alarming, Humorous, Reflective, Nostalgic, Skeptical, Urgent, or Thought-provoking.",
  "tags": ["relevant-tag1", "relevant-tag2", "relevant-tag3"],
  "category": "Broad category (e.g., Technology, Philosophy, Personal Growth, Science)",
  "contentType": "Article|News|Blog|Tweet|Research|Video"
}

CONTENT:
${text}
`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          {
            role: "system",
            content: "You are a JSON-only AI assistant. Never return markdown.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 500,
        response_format: { type: "json_object" } // Groq supports forced JSON mode
      }),
    });

    if (!response.ok) throw new Error(`Groq API failed with status ${response.status}`);

    const data = await response.json();
    const aiText = data?.choices?.[0]?.message?.content || "";
    return extractJSON(aiText);

  } catch (err) {
    console.error("❌ Groq AI Analysis Error:", err.message);
    return {
      summary: "",
      sentiment: "neutral",
      emotion: "",
      tags: [],
      category: "",
      contentType: "",
    };
  }
};

/**
 * ================================
 * LOCAL TRANSFORMERS EMBEDDINGS
 * ================================
 */
export const generateHFEmbedding = async (text) => {
  try {
    // 🟢 Try Local First (Transformers.js)
    try {
      const generateEmbedding = await getExtractor();
      const output = await generateEmbedding(text, { pooling: 'mean', normalize: true });
      return Array.from(output.data);
    } catch (localErr) {
      console.warn("⚠️ Local embedding failed, falling back to HF API:", localErr.message);
    }

    // 🔵 Fallback to Remote HF API
    const HF_API_KEY = process.env.HF_API_KEY;
    const model = "sentence-transformers/all-mpnet-base-v2"; // This is 768 dims on HF API too
    
    const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      method: "POST",
      headers: { 
        Authorization: `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: text, options: { wait_for_model: true } }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HF API error: ${response.status}`);
    }

    const result = await response.json();
    return Array.isArray(result) ? result : [];

  } catch (err) {
    console.error("❌ All Embedding Methods Failed:", err.message);
    return [];
  }
};
