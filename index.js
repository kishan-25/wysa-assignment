import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import { connectDB } from "./libs/db.js";
import assessmentRoutes from "./routes/assessment.routes.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

// Trust proxy
app.set('trust proxy', 1);

// Parsers
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());


app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/assessment", assessmentRoutes);

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!'
    });
});

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
