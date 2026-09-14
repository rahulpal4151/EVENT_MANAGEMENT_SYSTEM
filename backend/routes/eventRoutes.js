import express from 'express';
import {
	createEvent,
	getOrganizerEvents,
	getAllEvents,
	getEventById
} from '../controllers/eventController.js';
import { verifyJWT, isOrganizer } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/all-events').get(getAllEvents);
router.route('/create-events').post(verifyJWT, isOrganizer, createEvent);
router.route('/my-events').get(verifyJWT, isOrganizer, getOrganizerEvents);
router.get('/:id', getEventById);


export default router;