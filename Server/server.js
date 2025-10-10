import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./Config/db.js";
import userRouter from "./Routes/userRoute.js";
import contentRouter from "./Routes/contentRoute.js";
import fs from "fs";
import path from "path";
import CapturedContent from "./Models/contentModel.js";

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

// app.post("/api/capture", (req, res) => {
//   try {
//     const data = req.body;
//     const id = Date.now() + "-" + Math.random().toString(36).slice(2, 8);
//     const filename = path.join(DB_FOLDER, id + ".json");
//     fs.writeFileSync(filename, JSON.stringify(data, null, 2));
//     console.log("Saved capture", filename);
//     // TODO: kick off async AI processing (summarize, embed, tag)
//     res.json({ ok: true, id });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ ok: false });
//   }
// });

// ---- Capture endpoint (extension) ----
app.post("/api/capture", async (req, res) => {
  try {
    const { url, title, selection, timestamp, reason, screenshot, userId } = req.body;

    if (!userId || !url) {
      return res.status(400).json({ ok: false, message: "Missing required fields" });
    }

    // Save to MongoDB
    const captured = await CapturedContent.create({
      userId,
      url,
      title,
      type: "article", // default
      timestamp: timestamp || new Date(),
      status: "raw",
      aiData: {},      // placeholder for AI processing
      reason,          // optional, store why it was captured
      screenshot       // optional: you can add a field in schema if needed
    });

    res.json({ ok: true, id: captured._id });
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