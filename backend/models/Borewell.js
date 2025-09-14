const mongoose = require('mongoose');

const borewellSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: [true, 'Customer reference is required']
  },
  latitude: {
    type: String,
    required: [true, 'Latitude is required'],
    validate: {
      validator: function(v) {
        return /^-?([1-8]?[0-9]\.{1}\d{1,6}$|90\.{1}0{1,6}$)/.test(v);
      },
      message: 'Please provide a valid latitude'
    }
  },
  longitude: {
    type: String,
    required: [true, 'Longitude is required'],
    validate: {
      validator: function(v) {
        return /^-?([1]?[0-7][0-9]\.{1}\d{1,6}$|180\.{1}0{1,6}$|[1-9]?[0-9]\.{1}\d{1,6}$)/.test(v);
      },
      message: 'Please provide a valid longitude'
    }
  },
  wellType: {
    type: String,
    required: [true, 'Well type is required'],
    enum: ['dug-well', 'drilled-well', 'other'],
    maxlength: [100, 'Well type cannot exceed 100 characters']
  },
  depthType: {
    type: String,
    maxlength: [100, 'Depth type cannot exceed 100 characters'],
    default: ''
  },
  wallType: {
    type: String,
    maxlength: [100, 'Wall type cannot exceed 100 characters'],
    default: ''
  },
  supplySystem: {
    type: String,
    maxlength: [100, 'Supply system cannot exceed 100 characters'],
    default: ''
  },
  exactDepth: {
    type: Number,
    default: 0,
    min: [0, 'Depth cannot be negative']
  },
  motorOperated: {
    type: Boolean,
    default: false
  },
  authoritiesAware: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: ''
  }
}, {
  timestamps: true
});

// Indexes for better query performance
borewellSchema.index({ customer: 1 });
borewellSchema.index({ latitude: 1, longitude: 1 });
borewellSchema.index({ wellType: 1 });

// Virtual for location
borewellSchema.virtual('location').get(function() {
  return {
    latitude: this.latitude,
    longitude: this.longitude
  };
});

// Ensure virtual fields are serialized
borewellSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Borewell', borewellSchema);
