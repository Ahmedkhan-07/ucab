const Car = require('../models/CarSchema');
const fs = require('fs');
const path = require('path');

// @desc    Get all cars
// @route   GET /api/cars
// @access  Public
const getCars = async (req, res) => {
  try {
    const { type, available } = req.query;
    const query = {};
    if (type) query.type = type;
    if (available) query.available = available === 'true';

    const cars = await Car.find(query);
    res.json(cars);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single car
// @route   GET /api/cars/:id
// @access  Public
const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.json(car);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a car
// @route   POST /api/cars
// @access  Private/Admin
const createCar = async (req, res) => {
  try {
    const { name, type, pricePerKm, description, numberPlate } = req.body;

    if (!name || !type || !pricePerKm || !numberPlate) {
      return res.status(400).json({ message: 'Please provide name, type, pricePerKm, and numberPlate' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a car image' });
    }

    const numberPlateExists = await Car.findOne({ numberPlate });
    if (numberPlateExists) {
      return res.status(400).json({ message: 'Car with this number plate already exists' });
    }

    const imagePath = `/uploads/${req.file.filename}`;

    const car = await Car.create({
      name,
      type,
      pricePerKm: Number(pricePerKm),
      description,
      numberPlate,
      image: imagePath,
    });

    res.status(201).json(car);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a car
// @route   PUT /api/cars/:id
// @access  Private/Admin
const updateCar = async (req, res) => {
  try {
    const { name, type, pricePerKm, description, numberPlate, available } = req.body;
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    car.name = name || car.name;
    car.type = type || car.type;
    car.pricePerKm = pricePerKm !== undefined ? Number(pricePerKm) : car.pricePerKm;
    car.description = description || car.description;
    car.numberPlate = numberPlate || car.numberPlate;
    if (available !== undefined) {
      car.available = available === 'true' || available === true;
    }

    if (req.file) {
      // Delete old image if it exists
      if (car.image) {
        const oldImagePath = path.join(__dirname, '..', car.image);
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error('Failed to delete old image file:', err.message);
        });
      }
      car.image = `/uploads/${req.file.filename}`;
    }

    const updatedCar = await car.save();
    res.json(updatedCar);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a car
// @route   DELETE /api/cars/:id
// @access  Private/Admin
const deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    // Delete image file from disk
    if (car.image) {
      const imagePath = path.join(__dirname, '..', car.image);
      fs.unlink(imagePath, (err) => {
        if (err) console.error('Failed to delete image file:', err.message);
      });
    }

    await Car.findByIdAndDelete(req.params.id);
    res.json({ message: 'Car removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
};
