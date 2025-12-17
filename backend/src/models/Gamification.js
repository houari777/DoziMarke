// ⚙️ backend/src/models/Gamification.js
const mongoose = require('mongoose');

const gamificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  coins: { type: Number, default: 0 },
  gems: { type: Number, default: 0 },
  streaks: {
    login: { type: Number, default: 0 },
    sales: { type: Number, default: 0 },
    activity: { type: Number, default: 0 },
    best_login: { type: Number, default: 0 },
    best_sales: { type: Number, default: 0 },
  },
  achievements: [{
    achievementId: String,
    unlockedAt: Date,
  }],
  badges: [{
    badgeId: String,
    earnedAt: Date,
  }],
  dailyChallenges: [{
    challengeId: String,
    progress: Number,
    completed: Boolean,
    expiresAt: Date,
  }],
  statistics: {
    total_sales: { type: Number, default: 0 },
    total_revenue: { type: Number, default: 0 },
    average_rating: { type: Number, default: 0 },
    response_time: { type: Number, default: 0 },
    completion_rate: { type: Number, default: 0 },
  },
  lastUpdated: { type: Date, default: Date.now },
});

const Gamification = mongoose.model('Gamification', gamificationSchema);

module.exports = Gamification;
