import { Assessment } from "../models/Assessment.js";
import { validateInput, sanitizeInput } from "../utils/validation.js";

export const submitAssessment = async (req, res) => {
    const { goal, struggleWeek, bedInTime, bedOutTime, sleepDuration } = req.body;

    try {
        // Input validation for assessment data
        const validationResult = validateInput({
            goal: { value: goal, type: 'array', required: true },
            struggleWeek: { value: struggleWeek, type: 'string', required: true },
            bedInTime: { value: bedInTime, type: 'time', required: true },
            bedOutTime: { value: bedOutTime, type: 'time', required: true },
            sleepDuration: { value: sleepDuration, type: 'number', required: true, min: 1, max: 24 }
        });

        if (!validationResult.isValid) {
            return res.status(400).json({
                error: "Invalid assessment data",
                details: validationResult.errors
            });
        }

        // Sanitize inputs
        const sanitizedData = {
            goal: goal.map(g => sanitizeInput(g, 'string')),
            struggleWeek: sanitizeInput(struggleWeek, 'string'),
            bedInTime: sanitizeInput(bedInTime, 'time'),
            bedOutTime: sanitizeInput(bedOutTime, 'time'),
            sleepDuration: parseInt(sleepDuration)
        };

        const assessment = await Assessment.create({
            userId: req.user.id,
            ...sanitizedData
        });

        res.status(201).json({ 
            success: true, 
            message: "Assessment submitted successfully",
            assessment: {
                id: assessment._id,
                goal: assessment.goal,
                struggleWeek: assessment.struggleWeek,
                bedInTime: assessment.bedInTime,
                bedOutTime: assessment.bedOutTime,
                sleepDuration: assessment.sleepDuration,
                createdAt: assessment.createdAt
            }
        });
    } catch (err) {
        console.error("Assessment error:", err);
        res.status(500).json({ error: "Error submitting assessment" });
    }
};

export const getAssessments = async (req, res) => {
    try {
        const assessments = await Assessment.find({ userId: req.user.id })
            .select('-__v')
            .sort({ createdAt: -1 });

        res.status(200).json({ 
            success: true, 
            assessments,
            count: assessments.length
        });
    } catch (err) {
        console.error("Assessment fetch error:", err);
        res.status(500).json({ error: "Error fetching assessments" });
    }
};