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
    // Using a 768-dimension model to match the existing MongoDB vector index
    extractor = await pipeline("feature-extraction", "Xenova/all-mpnet-base-v2");
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
  "emotion": "primary tone (e.g. Joy, Sadness, Professional, Informative)",
  "tags": ["relevant-tag1", "relevant-tag2", "relevant-tag3"],
  "category": "main category",
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
    const generateEmbedding = await getExtractor();
    
    // pooling: 'mean' and normalize: true are standard for semantic search
    const output = await generateEmbedding(text, { 
      pooling: 'mean', 
      normalize: true 
    });

    // Convert Tensor data to a standard Javascript array
    return Array.from(output.data);

  } catch (err) {
    console.error("❌ Local Embedding Error:", err.message);
    return [];
  }
};
