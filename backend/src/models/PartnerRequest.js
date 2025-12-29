const mongoose = require('mongoose');
const { partner_request_status } = require('./enums');

const partnerRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    service_type: {
      type: String,
      required: [true, 'Service type is required'],
      trim: true,
    },
    experience_years: {
      type: Number,
      min: 0,
    },
    cv_file: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: partner_request_status,
      default: 'en attente',
    },
  },
  {
    timestamps: true,
  }
);

partnerRequestSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('PartnerRequest', partnerRequestSchema);

