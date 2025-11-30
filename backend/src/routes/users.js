import express from 'express';
import auth from '../middleware/auth.js';
import role from '../middleware/role.js';
import { getProfile, getAllUsers } from '../controllers/users.js';
const router = express.Router();
router.get('/me', auth, getProfile);
router.get('/', auth, role('admin'), getAllUsers);
export default router;
