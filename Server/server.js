import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./Config/db.js";
import userRouter from "./Routes/userRoute.js";

dotenv.config();

const app = express();
//Connect Database
connectDB();

app.use(cors());
app.use(express.json()); 

//API Endpoint to connect to user
app.use('/api/user', userRouter)

app.get("/", (req, res) => {
  res.send("API is running...");
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));