import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import profileRoutes from './routes/profileRoutes.js'
import communityRoutes from "./routes/communityRoutes.js";
import discussionRoutes from "./routes/discussionRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";



dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect DB
connectDB();

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // ✅ important


// Routes
app.get("/", (req, res) => res.json({ message: "Discussify API running 🚀" }));
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/profile",profileRoutes);


app.use("/api/v1/communities", communityRoutes);
app.use("/api/v1/discussions", discussionRoutes);

app.use("/api/v1/resources", resourceRoutes);
app.use("/uploads/resources", express.static(path.join(process.cwd(), "uploads/resources")));

app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/notifications", notificationRoutes);



// Error Handling
app.use(notFound);
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5010;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
