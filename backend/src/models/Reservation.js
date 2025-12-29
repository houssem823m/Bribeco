const mongoose = require('mongoose');
const { reservations_status_enum, partner_assignment_status } = require('./enums');

const reservationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: [true, 'Service is required'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    postal_code: {
      type: String,
      required: [true, 'Postal code is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    urgent: {
      type: Boolean,
      default: false,
    },
    date_requested: {
      type: Date,
    },
    time_slot: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: reservations_status_enum,
      default: 'nouvelle',
    },
    assigned_partner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Partner',
    },
    partner_status: {
      type: String,
      enum: partner_assignment_status,
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
    },
  },
  {
    timestamps: true,
  }
);

reservationSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Reservation', reservationSchema);

