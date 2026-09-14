import jwt from "jsonwebtoken";
// Note: Aapne pichle message me userModel.js likha tha, to import wahi rakhein
import User from "../models/User.models.js"; 

// ==========================================
// 1. LOGIN GUARD (Check if user is logged in)
// ==========================================
export const verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized request - Token missing" });
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        
        const user = await User.findById(decodedToken._id).select("-password -refreshToken");

        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid Access Token" });
        }

        req.user = user; // Request me user ki detail daal di
        next(); 
        
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};

// ==========================================
// 2. SUPER ADMIN GUARD (Platform Owner)
// ==========================================
export const isSuperAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'SuperAdmin') {
        next(); // Admin hai, aage jaane do
    } else {
        return res.status(403).json({ success: false, message: "Access denied! Only Admin can access this." });
    }
};

// ==========================================
// 3. ORGANIZER GUARD (Event Creators)
// ==========================================
export const isOrganizer = (req, res, next) => {
    if (req.user && req.user.role === 'Organizer') {
        next(); // Organizer hai, event create/manage karne do
    } else {
        return res.status(403).json({ success: false, message: "Access denied! Only Organizers can perform this action." });
    }
};

// ==========================================
// 4. PARTICIPANT GUARD (Students/Appliers)
// ==========================================
export const isParticipant = (req, res, next) => {
    if (req.user && req.user.role === 'Participant') {
        next(); // Participant hai, event me apply karne do
    } else {
        return res.status(403).json({ success: false, message: "Access denied! Only Participants can apply for events." });
    }
};