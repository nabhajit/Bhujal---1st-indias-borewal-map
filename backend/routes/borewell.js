const express = require('express');
const Borewell = require('../models/Borewell');
const Customer = require('../models/Customer');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/borewell/register
// @desc    Register a new borewell
// @access  Private
router.post('/register', auth, async (req, res) => {
  try {
    const {
      latitude,
      longitude,
      wellType,
      depthType,
      wallType,
      supplySystem,
      exactDepth,
      motorOperated,
      authoritiesAware,
      description
    } = req.body;

    // Validation
    if (!latitude || !longitude || !wellType) {
      return res.status(400).json({
        success: false,
        message: 'Please provide latitude, longitude, and well type'
      });
    }

    // Create borewell
    const borewell = await Borewell.create({
      customer: req.customer.id,
      latitude,
      longitude,
      wellType,
      depthType: depthType || '',
      wallType: wallType || '',
      supplySystem: supplySystem || '',
      exactDepth: exactDepth || 0,
      motorOperated: motorOperated || false,
      authoritiesAware: authoritiesAware || false,
      description: description || ''
    });

    // Populate customer data
    await borewell.populate('customer', 'name email phoneNumber address');

    res.status(201).json({
      success: true,
      message: 'Borewell registered successfully',
      data: {
        borewell: {
          latitude: borewell.latitude,
          longitude: borewell.longitude,
          name: borewell.customer.name,
          phoneNumber: borewell.customer.phoneNumber
        }
      }
    });

  } catch (error) {
    console.error('Borewell registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during borewell registration',
      error: error.message
    });
  }
});

// @route   GET /api/borewell/my-borewells
// @desc    Get current customer's borewells
// @access  Private
router.get('/my-borewells', auth, async (req, res) => {
  try {
    const borewells = await Borewell.find({ customer: req.customer.id })
      .populate('customer', 'name email phoneNumber address')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: borewells.length,
      data: { borewells }
    });

  } catch (error) {
    console.error('Get borewells error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/borewell/all
// @desc    Get all borewells (for map display)
// @access  Public
router.get('/all', async (req, res) => {
  try {
    const borewells = await Borewell.find()
      .populate('customer', 'name phoneNumber address email')
      .select('latitude longitude customer')
      .sort({ createdAt: -1 });

    const responseData = borewells.map(borewell => ({
      name: borewell.customer.name,
      address: borewell.customer.address,
      phone: borewell.customer.phoneNumber,
      email: borewell.customer.email,
      latitude: borewell.latitude,
      longitude: borewell.longitude
    }));

    res.json({
      success: true,
      count: responseData.length,
      data: responseData
    });

  } catch (error) {
    console.error('Get all borewells error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/borewell/owners
// @desc    Get all borewell owners (alternative endpoint)
// @access  Public
router.get('/owners', async (req, res) => {
  try {
    const borewells = await Borewell.find()
      .populate('customer', 'name phoneNumber address email')
      .select('latitude longitude customer')
      .sort({ createdAt: -1 });

    const responseData = borewells.map(borewell => ({
      name: borewell.customer.name,
      address: borewell.customer.address,
      phone: borewell.customer.phoneNumber,
      email: borewell.customer.email,
      latitude: borewell.latitude,
      longitude: borewell.longitude
    }));

    res.json(responseData);

  } catch (error) {
    console.error('Get borewell owners error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/borewell/:id
// @desc    Get single borewell
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const borewell = await Borewell.findById(req.params.id)
      .populate('customer', 'name email phoneNumber address');

    if (!borewell) {
      return res.status(404).json({
        success: false,
        message: 'Borewell not found'
      });
    }

    res.json({
      success: true,
      data: { borewell }
    });

  } catch (error) {
    console.error('Get borewell error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/borewell/:id
// @desc    Update borewell
// @access  Private (only owner can update)
router.put('/:id', auth, async (req, res) => {
  try {
    let borewell = await Borewell.findById(req.params.id);

    if (!borewell) {
      return res.status(404).json({
        success: false,
        message: 'Borewell not found'
      });
    }

    // Check if user owns the borewell
    if (borewell.customer.toString() !== req.customer.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this borewell'
      });
    }

    borewell = await Borewell.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('customer', 'name email phoneNumber address');

    res.json({
      success: true,
      message: 'Borewell updated successfully',
      data: { borewell }
    });

  } catch (error) {
    console.error('Update borewell error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during borewell update',
      error: error.message
    });
  }
});

// @route   DELETE /api/borewell/:id
// @desc    Delete borewell
// @access  Private (only owner can delete)
router.delete('/:id', auth, async (req, res) => {
  try {
    const borewell = await Borewell.findById(req.params.id);

    if (!borewell) {
      return res.status(404).json({
        success: false,
        message: 'Borewell not found'
      });
    }

    // Check if user owns the borewell
    if (borewell.customer.toString() !== req.customer.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this borewell'
      });
    }

    await borewell.deleteOne();

    res.json({
      success: true,
      message: 'Borewell deleted successfully'
    });

  } catch (error) {
    console.error('Delete borewell error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during borewell deletion',
      error: error.message
    });
  }
});

module.exports = router;
