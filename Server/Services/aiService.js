import fetch from "node-fetch";

/**
 * ================================
 * ENV CONFIG
 * ================================
 */

// GROQ
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

// HUGGING FACE
const HF_EMBEDDING_MODEL = process.env.HF_EMBEDDING_MODEL || "BAAI/bge-small-en-v1.5";

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
Analyze the following content and return ONLY valid JSON.
{
  "summary": "2-3 sentence concise summary",
  "sentiment": "positive|neutral|negative",
  "emotion": "primary tone",
  "tags": ["tag1", "tag2", "tag3"],
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
 * HUGGING FACE EMBEDDINGS
 * ================================
 */
export const generateHFEmbedding = async (text) => {
  const HF_API_KEY = process.env.HF_API_KEY;
  try {
    if (!HF_API_KEY) throw new Error("Missing HF_API_KEY in environment.");

    const response = await fetch(
      `https://api-inference.huggingface.co/models/${HF_EMBEDDING_MODEL}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          inputs: text,
          options: { wait_for_model: true }
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`HF Embedding API failed (${response.status}): ${errorData.error || response.statusText}`);
    }

    const data = await response.json();
    // Some models return nested arrays (mean pooling vs cls token)
    if (Array.isArray(data?.[0])) return data[0];
    return data || [];

  } catch (err) {
    console.error("❌ HuggingFace Embedding Error:", err.message);
    return [];
  }
};
