const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

router.post('/signup', registerUser);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);

// Admin / User management routes
router.route('/')
  .get(protect, adminOnly, getAllUsers);

router.route('/:id')
  .get(protect, getUserById)
  .put(protect, updateUser)
  .delete(protect, adminOnly, deleteUser);

module.exports = router;
