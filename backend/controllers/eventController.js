import Event from '../models/Event.models.js';
import mongoose from 'mongoose';

// ==========================================
// 1. CREATE EVENT (Only for Organizers)
// ==========================================
export const createEvent = async (req, res) => {
    try {
        const { title, description, date, location, bannerImage } = req.body;

        // Validation
        if (!title || !description || !date || !location) {
            return res.status(400).json({ success: false, message: "All required fields must be filled" });
        }

        const newEvent = await Event.create({
            title,
            description,
            date,
            location,
            bannerImage: bannerImage || "", 
            organizerId: req.user._id 
        });

        return res.status(201).json({
            success: true,
            message: "Event created successfully",
            event: newEvent
        });
        
    } catch (error) {
        console.error("Create Event Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// ==========================================
// 2. GET ORGANIZER'S EVENTS (For Organizer Dashboard)
// ==========================================
export const getOrganizerEvents = async (req, res) => {
    try {
        // Sirf usi organizer ke events dhoondho jiski ID token me hai
        const events = await Event.find({ organizerId: req.user._id }).sort({ createdAt: -1 });
        
        return res.status(200).json({
            success: true,
            events
        });
    } catch (error) {
        console.error("Fetch Organizer Events Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// ==========================================
// 3. GET ALL EVENTS (For Participants/Home Page)
// ==========================================
export const getAllEvents = async (req, res) => {
    try {
        // .populate() ka use karke hum Organizer ki ID ke sath uska Naam bhi le aayenge
        const events = await Event.find({ status: 'Approved' })
            .populate('organizerId', 'name email')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            events
        });
    } catch (error) {
        console.error("Fetch All Events Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// ==========================================
// 4. GET SINGLE EVENT DETAILS
// ==========================================
export const getEventById = async (req, res) => {
    try {
        // URL path se event ki ID nikalna
        const eventId = req.params.id;

        if (!mongoose.isValidObjectId(eventId)) {
            return res.status(400).json({ success: false, message: "Invalid event ID" });
        }

        // Event dhoondhna aur sath me organizer ka naam/email lana
        const event = await Event.findOne({ _id: eventId, status: 'Approved' }).populate('organizerId', 'name email');

        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }

        return res.status(200).json({
            success: true,
            event
        });
    } catch (error) {
        console.error("Fetch Single Event Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};


