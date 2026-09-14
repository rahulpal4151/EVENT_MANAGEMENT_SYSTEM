import express from 'express';
import { getAdminEvents, updateEventStatus } from '../controllers/adminController.js';
import { verifyJWT, isSuperAdmin } from '../middlewares/authMiddleware.js';


const router = express.Router();

router.get('/events', verifyJWT, isSuperAdmin, getAdminEvents);
router.put('/event-status/:eventId', verifyJWT, isSuperAdmin, updateEventStatus);

export default router;