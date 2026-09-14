import express from 'express';
import {
	bookEvent,
	getMyBookings,
	getOrganizerApplications,
	updateBookingStatus
} from '../controllers/bookingController.js';
import { verifyJWT, isOrganizer, isParticipant } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/apply/:eventId').post(verifyJWT, isParticipant, bookEvent);

router.route('/my-bookings').get(verifyJWT, isParticipant, getMyBookings);
router.route('/organizer-applications').get(verifyJWT, isOrganizer, getOrganizerApplications);
router.route('/:bookingId/status').put(verifyJWT, isOrganizer, updateBookingStatus);

export default router;