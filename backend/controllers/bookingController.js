import Booking from '../models/Booking.models.js'; 
import Event from '../models/Event.models.js';

// ==========================================
// 1. BOOK / APPLY FOR AN EVENT (Only for Participants)
// ==========================================
export const bookEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const participantId = req.user._id;

        // 1. Check karna ki event exist karta hai ya nahi
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }
        if (event.status !== 'Approved') {
            return res.status(400).json({ success: false, message: "Applications are only open for approved events" });
        }

        // 2. Check karna ki user ne pehle se toh apply nahi kiya hua
        const existingBooking = await Booking.findOne({ eventId, participantId });
        if (existingBooking) {
            return res.status(400).json({ success: false, message: "You have already applied for this event" });
        }

        // 3. Nayi booking create karna
        const newBooking = await Booking.create({
            eventId,
            participantId,
            status: 'Pending' // Default status
        });

        return res.status(201).json({
            success: true,
            message: "Successfully applied for the event!",
            booking: newBooking
        });

    } catch (error) {
        console.error("Booking Event Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// ==========================================
// 2. GET MY BOOKINGS (For Participant Dashboard)
// ==========================================
export const getMyBookings = async (req, res) => {
    try {
        // Logged-in participant ki saari bookings dhoondho aur Event ki details bhi le aao
        const bookings = await Booking.find({ participantId: req.user._id })
            .populate('eventId', 'title date location bannerImage') // Event ki sirf zaroori details
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            bookings
        });
    } catch (error) {
        console.error("Fetch My Bookings Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// ==========================================
// 3. GET APPLICATIONS FOR ORGANIZER'S EVENTS
// ==========================================
export const getOrganizerApplications = async (req, res) => {
    try {
        const events = await Event.find({ organizerId: req.user._id }).select('_id');
        const eventIds = events.map((event) => event._id);

        const applications = await Booking.find({ eventId: { $in: eventIds } })
            .populate('eventId', 'title date')
            .populate('participantId', 'name email')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            applications
        });
    } catch (error) {
        console.error("Fetch Organizer Applications Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// ==========================================
// 4. ACCEPT OR REJECT AN APPLICATION
// ==========================================
export const updateBookingStatus = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { status } = req.body;

        if (!['Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid application status" });
        }

        const booking = await Booking.findById(bookingId).populate('eventId', 'organizerId');
        if (!booking) {
            return res.status(404).json({ success: false, message: "Application not found" });
        }

        if (!booking.eventId || booking.eventId.organizerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "You can only manage applications for your events" });
        }

        booking.status = status;
        await booking.save();

        return res.status(200).json({
            success: true,
            message: `Application ${status.toLowerCase()} successfully`,
            booking
        });
    } catch (error) {
        console.error("Update Booking Status Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};