const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  storeName: { type: String, required: true },
  category: { type: String },
  description: { type: String },

  // Gamification fields
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  coins: { type: Number, default: 0 },
  gems: { type: Number, default: 0 },

  // Stats
  totalSales: { type: Number, default: 0 },
  totalRevenue: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },

  // Achievements and badges
  achievements: [
    {
      id: String,
      name: String,
      description: String,
      icon: String,
      unlockedAt: Date,
    },
  ],

  badges: [
    {
      id: String,
      name: String,
      description: String,
      icon: String,
      earnedAt: Date,
    },
  ],

  // Daily challenges progress
  dailyChallenges: [
    {
      challengeId: String,
      progress: { type: Number, default: 0 },
      completed: { type: Boolean, default: false },
      completedAt: Date,
    },
  ],

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
  loginStreak: { type: Number, default: 0 },
});

// Update the updatedAt field on save
businessSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Business', businessSchema);
