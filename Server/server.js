import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./Config/db.js";
import userRouter from "./Routes/userRoute.js";
import contentRouter from "./Routes/contentRoute.js";
import fs from "fs";
import path from "path";
import CapturedContent from "./Models/contentModel.js";
import { analyzeContent } from "./Config/ai.js";
import authMiddleware from "./middleware/authMiddleware.js";
import { saveCapturedData } from "./Controllers/contentController.js";

const app = express();

connectDB();

app.use(cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

//API Endpoint to connect to user
app.use('/api/user', userRouter)
app.use('/api/content', contentRouter)

// ---- Capture endpoint (extension) ----
app.post("/api/capture", authMiddleware, saveCapturedData);

app.get("/", (req, res) => {
  res.send("API is running...");
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));