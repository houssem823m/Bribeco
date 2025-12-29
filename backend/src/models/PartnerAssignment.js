const mongoose = require('mongoose');
const { partner_assignment_status } = require('./enums');

const partnerAssignmentSchema = new mongoose.Schema(
  {
    reservation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reservation',
      required: [true, 'Reservation is required'],
    },
    partner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Partner',
      required: [true, 'Partner is required'],
    },
    status: {
      type: String,
      enum: partner_assignment_status,
      default: 'envoyée',
    },
  },
  {
    timestamps: true,
  }
);

partnerAssignmentSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('PartnerAssignment', partnerAssignmentSchema);

