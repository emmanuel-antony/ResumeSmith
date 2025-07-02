import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";

import path from "path";
import { fileURLToPath } from "url";


// Importing Routes
import userRoutes from "./routes/userRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express(); // Creation of Express application
const PORT = process.env.PORT;

app.use(cors()); // Enable CORS for all routes

// Connect to the database
connectDB();

//middleware
app.use(express.json());
// Parse JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use(`/api/auth`, userRoutes);
app.use(`/api/resume`, resumeRoutes);

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads") , {setHeaders : (res, path) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");}
}));


//only for testing purposes
app.get("/", (req, res) => {
  res.send("Welcome to the backend server!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
