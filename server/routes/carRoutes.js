const express = require('express');
const router = express.Router();
const { getCars, getCarById, createCar, updateCar, deleteCar } = require('../controllers/carController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/multer');

router.route('/')
  .get(getCars)
  .post(protect, adminOnly, upload.single('image'), createCar);

router.route('/:id')
  .get(getCarById)
  .put(protect, adminOnly, upload.single('image'), updateCar)
  .delete(protect, adminOnly, deleteCar);

module.exports = router;
