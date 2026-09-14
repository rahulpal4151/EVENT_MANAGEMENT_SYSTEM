import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    bannerImage: {
        type: String, // Yahan hum Cloudinary ya kisi aur image hosting ka URL save karenge
        default: ""
    },
    // Yahan hum event ko Organizer ke account se link kar rahe hain
    organizerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    }
}, { timestamps: true });

const Event = mongoose.model("Event", eventSchema);
export default Event;