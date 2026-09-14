import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    participantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    teamName: {
        type: String,
        // Hackathons mein team banani hoti hai, isliye yeh helpful rahega
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    }
}, { timestamps: true });

bookingSchema.index({ eventId: 1, participantId: 1 }, { unique: true });

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
