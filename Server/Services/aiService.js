import fetch from "node-fetch";
import "dotenv/config";

/**
 * ================================
 * CLEAN TEXT FOR AI
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
 * GROQ AI ANALYSIS (Summarization)
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
        model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        response_format: { type: "json_object" },
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "Groq API error");

    return extractJSON(data.choices[0]?.message?.content || "{}");
  } catch (err) {
    console.error("❌ Groq Analysis Error:", err.message);
    return { summary: "Analysis failed.", tags: [], sentiment: "neutral" };
  }
};

/**
 * ================================
 * JINA AI EMBEDDINGS
 * ================================
 */
export const generateEmbedding = async (text) => {
  try {
    const JINA_API_KEY = process.env.JINA_API_KEY;
    if (!JINA_API_KEY) {
      console.error("❌ Missing JINA_API_KEY in environment.");
      return [];
    }

    const response = await fetch("https://api.jina.ai/v1/embeddings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${JINA_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "jina-embeddings-v2-base-en",
        input: [text],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.warn("⚠️ Jina Embedding API Error:", errorData.error?.message || response.status);
      return [];
    }

    const result = await response.json();

    // Jina returns { "data": [ { "embedding": [...] } ] }
    if (result.data && result.data[0] && result.data[0].embedding) {
      return result.data[0].embedding;
    }

    return [];

  } catch (err) {
    console.error("❌ Jina Embedding Failed:", err.message);
    return [];
  }
};
