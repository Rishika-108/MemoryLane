import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./Config/db.js";
import userRouter from "./Routes/userRoute.js";
import contentRouter from "./Routes/contentRoute.js";
import fs from "fs";
import path from "path";
import CapturedContent from "./Models/contentModel.js";
import { analyzeContent } from "./Config/ai.js";


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
app.post("/api/capture", async (req, res) => {
  try {
    const { url, title, userId } = req.body;
    if (!url || !userId) return res.status(400).json({ ok: false, message: "Missing required fields" });

    // 1️⃣ Save in DB
    const captured = await CapturedContent.create({
      userId,
      url,
      title,
      type: "article",
      status: "raw",
      aiData: {},
    });

    console.log(`💾 Content saved: ${captured._id} (AI processing)`);

    // 2️⃣ Call AI route handler internally
    // Create a mock req/res object for analyzeContent
    const mockReq = {
      params: { id: captured._id.toString() },
      user: { id: userId },
    };

    // We can pass a dummy res object with only status/json
    const mockRes = {
      status: (code) => {
        return { json: (data) => data }; // ignore sending response, just return data
      },
      json: (data) => data, // fallback
    };

    await analyzeContent(mockReq, mockRes); // AI will run and save to DB

    // 3️⃣ Reload the content to get AI data
    const updatedContent = await CapturedContent.findById(captured._id);

    console.log(`✅ AI analysis finished for ${captured._id}`);
    console.log("📊 Updated AI Data:", updatedContent.aiData);

    // 4️⃣ Send response including AI data
    res.json({ ok: true, id: captured._id, aiData: updatedContent.aiData });

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