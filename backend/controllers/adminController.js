import Event from '../models/Event.models.js';

// Admin dashboard ke liye approved aur pending events lana
export const getAdminEvents = async (req, res) => {
    try {
        const events = await Event.find({ status: { $in: ['Approved', 'Pending'] } })
            .populate('organizerId', 'name email')
            .sort({ createdAt: -1 });

        return res.status(200).json({ success: true, events });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Event ko Approve ya Reject karna
export const updateEventStatus = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { status } = req.body; 

        if (!['Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status" });
        }

        const event = await Event.findByIdAndUpdate(
            eventId, 
            { status }, 
            { new: true }
        );

        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }

        return res.status(200).json({ 
            success: true, 
            message: `Event successfully ${status}`, 
            event 
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};