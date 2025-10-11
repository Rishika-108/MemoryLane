import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./Config/db.js";
import userRouter from "./Routes/userRoute.js";
import contentRouter from "./Routes/contentRoute.js";
import fs from "fs";
import path from "path";
import CapturedContent from "./Models/contentModel.js";
import { runConnector } from "./Controllers/contentController.js";
import { runAnalyser } from "./Controllers/contentController.js";

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json({ limit: "20mb" })); 

//API Endpoint to connect to user
app.use('/api/user', userRouter)
app.use('/api/content', contentRouter)

// ---- Extension capture endpoint ----
const DB_FOLDER = path.join(process.cwd(), "captures");
if (!fs.existsSync(DB_FOLDER)) fs.mkdirSync(DB_FOLDER);

// ---- Capture endpoint (extension) ----
// app.post("/api/capture", async (req, res) => {
//   try {
//     const { url, title, selection, timestamp, reason, screenshot, userId } = req.body;

//     if (!userId || !url) {
//       return res.status(400).json({ ok: false, message: "Missing required fields" });
//     }

//     // Save to MongoDB
//     const captured = await CapturedContent.create({
//       userId,
//       url,
//       title,
//       type: "article", // default
//       timestamp: timestamp || new Date(),
//       status: "raw",
//       aiData: {},      // placeholder for AI processing
//       reason,          // optional, store why it was captured
//       screenshot       // optional: you can add a field in schema if needed
//     });
//     console.log("Received body:", req.body);
//     await fetch(`http://localhost:5000/api/content/analyze/${captured._id}`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: req.headers.authorization || "", // optional if needed
//       },
//       body: JSON.stringify({ userId }),
//     }).then((r) => console.log("🧠 AI analysis triggered for", captured._id))
//       .catch((e) => console.error("❌ Failed to trigger analyzer:", e));
//     res.json({ ok: true, id: captured._id });
//   } catch (err) {
//     console.error("Capture error:", err);
//     res.status(500).json({ ok: false, message: "Server error" });
//   }
// });
// app.post("/api/capture", async (req, res) => {
//   try {
//     const { url, title, reason, timestamp, userId } = req.body;

//     if (!userId || !url) {
//       return res.status(400).json({ ok: false, message: "Missing required fields" });
//     }

//     // 1️⃣ Save capture in raw state
//     const captured = await CapturedContent.create({
//       userId,
//       url,
//       title,
//       type: "article",
//       timestamp: timestamp || new Date(),
//       status: "raw",
//       aiData: {},
//       reason,
//     });

//     // 2️⃣ Call AI analyzer and update captured.aiData
//     const aiResponse = await fetch(`http://localhost:5000/api/content/analyze/${captured._id}`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ userId }),
//     });

//     const aiResult = await aiResponse.json().catch(() => ({}));

//     // 3️⃣ Reload the captured document with updated aiData
//     const updatedCaptured = await CapturedContent.findById(captured._id);

//     res.json({
//       ok: true,
//       id: captured._id,
//       aiData: updatedCaptured.aiData, // now AI data should be populated
//     });

//   } catch (err) {
//     console.error("Capture error:", err);
//     res.status(500).json({ ok: false, message: "Server error" });
//   }
// });

app.post("/api/capture", async (req, res) => {
  try {
    const { url, title, reason, timestamp, userId } = req.body;

    if (!userId || !url) {
      return res.status(400).json({ ok: false, message: "Missing required fields" });
    }

    // Save capture in raw state
    const captured = await CapturedContent.create({
      userId,
      url,
      title,
      type: "article",
      timestamp: timestamp || new Date(),
      status: "raw",
      aiData: {},
      reason,
    });

    console.log(`💾 Content saved: ${captured._id} (AI processing pending)`);

    // Trigger AI analysis and wait for it to finish
    const updatedContent = await runConnector(captured._id, userId);

    // Respond only after AI is done
    res.json({
      ok: true,
      id: captured._id,
      message: "Content saved and AI analysis completed.",
      aiData: updatedContent.aiData,
    });

  } catch (err) {
    console.error("Capture error:", err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});


app.get("/", (req, res) => {
  res.send("API is running...");
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));