import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { submitAssessment, getAssessments } from "../controllers/assessment.controller.js";

const router = express.Router();

router.post("/submit-assessment", authMiddleware, submitAssessment);
router.get("/get-assessment", authMiddleware, getAssessments);

export default router;
