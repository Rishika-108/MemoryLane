import mongoose from "mongoose";

const aiDataSchema = new mongoose.Schema({
  summary: { type: String, default: "" },
  sentiment: { type: String, default: ""},
  tags: [{ type: String }],
  keywords: [{ type: String }],
  category: { type: String, default: "" }
}, { _id: false });

const capturedContentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  url: { type: String, required: true },
  title: { type: String, default: "" },
  type: { type: String, enum: ["article", "video"],  default: "article"  },
  timestamp: { type: Date, default: Date.now},
  status: { type: String, enum: ["raw", "processing", "processed", "error"], default: "raw"},
  aiData: { type: aiDataSchema, default: () => ({}) }
}, { timestamps: true });

// Optional: add text index for search
capturedContentSchema.index({
  title: "text", "aiData.summary": "text",  "aiData.tags": "text", "aiData.keywords": "text"});

export default mongoose.model("CapturedContent", capturedContentSchema);
