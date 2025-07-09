import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized - No token provided"
            });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (jwtError) {
            return res.status(401).json({
                message: "Unauthorized - Invalid token"
            });
        }

        const user = await User.findById(decoded.id).select("id image name email role");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Error authenticating user:", error);
        res.status(500).json({ message: "Error authenticating user" });
    }
};

export const checkAdmin = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("role");

        if (!user || user.role !== 'ADMIN') {
            return res.status(403).json({
                message: "Access denied - Admins only"
            });
        }

        next();
    } catch (error) {
        console.error("Error checking admin role:", error);
        res.status(500).json({
            message: "Error checking admin role"
        });
    }
};
