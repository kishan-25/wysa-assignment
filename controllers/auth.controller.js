import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import jwt from 'jsonwebtoken';
import { validateInput, sanitizeInput } from "../utils/validation.js";

export const register = async (req, res) => {
    const { email, password, name } = req.body;

    try {
        // Input validation
        const validationResult = validateInput({
            email: { value: email, type: 'email', required: true },
            password: { value: password, type: 'password', required: true },
            name: { value: name, type: 'name', required: true }
        });

        if (!validationResult.isValid) {
            return res.status(400).json({
                error: "Invalid input data",
                details: validationResult.errors
            });
        }

        // Sanitize inputs
        const sanitizedData = {
            email: sanitizeInput(email, 'email'),
            name: sanitizeInput(name, 'name'),
            password: password // Don't sanitize password, just validate
        };

        const existingUser = await User.findOne({ email: sanitizedData.email });

        if (existingUser) {
            return res.status(400).json({
                error: "User already exists"
            });
        }

        // Strong password hashing with higher cost
        const hashedPassword = await bcrypt.hash(sanitizedData.password, 12);

        const newUser = await User.create({
            email: sanitizedData.email,
            password: hashedPassword,
            name: sanitizedData.name,
            role: "USER"
        });

        const token = jwt.sign(
            { id: newUser._id, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("jwt", token, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development",
            maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
        });

        res.status(201).json({
            message: "User created successfully",
            user: {
                id: newUser._id,
                email: newUser.email,
                name: newUser.name,
                role: newUser.role,
                image: newUser.image
            }
        });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({
            error: "Error creating user"
        });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Input validation
        const validationResult = validateInput({
            email: { value: email, type: 'email', required: true },
            password: { value: password, type: 'password', required: true }
        });

        if (!validationResult.isValid) {
            return res.status(400).json({
                error: "Invalid input data"
            });
        }

        const sanitizedEmail = sanitizeInput(email, 'email');
        const user = await User.findOne({ email: sanitizedEmail });

        if (!user) {
            return res.status(401).json({
                error: "Invalid credentials"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                error: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("jwt", token, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development",
            maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
        });

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                image: user.image
            }
        });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({
            error: "Error logging in user"
        });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development"
        });

        res.status(200).json({
            success: true,
            message: "User logged out successfully"
        });
    } catch (error) {
        console.error("Error logging out user:", error);
        res.status(500).json({
            error: "Error logging out user"
        });
    }
};

export const check = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: "User authenticated successfully",
            user: {
                id: req.user.id,
                email: req.user.email,
                name: req.user.name,
                role: req.user.role,
                image: req.user.image
            }
        });
    } catch (error) {
        console.error("Error checking user:", error);
        res.status(500).json({
            error: "Error checking user"
        });
    }
};