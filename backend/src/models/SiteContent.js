const mongoose = require('mongoose');

const siteContentSchema = new mongoose.Schema(
  {
    page: {
      type: String,
      required: true,
      unique: true,
      enum: ['home'],
      default: 'home',
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Index pour améliorer les performances
siteContentSchema.index({ page: 1 });

module.exports = mongoose.model('SiteContent', siteContentSchema);

