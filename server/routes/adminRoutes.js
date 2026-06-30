const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin, getAdminProfile } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

router.post('/signup', registerAdmin);
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/profile', protect, adminOnly, getAdminProfile);

module.exports = router;
