// ⚙️ backend/src/models/Gamification.js
const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  icon: { type: String },
  xpReward: { type: Number, default: 0 },
  unlockedAt: { type: Date, default: Date.now },
  category: {
    type: String,
    enum: ['sales', 'quality', 'engagement', 'growth'],
  },
});

const badgeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  icon: { type: String },
  earnedAt: { type: Date, default: Date.now },
  tier: { type: String, enum: ['bronze', 'silver', 'gold', 'platinum'] },
});

const challengeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['daily', 'weekly', 'monthly', 'special'] },
  goal: { type: Number, required: true },
  progress: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date },
  rewards: {
    xp: { type: Number, default: 0 },
    coins: { type: Number, default: 0 },
    gems: { type: Number, default: 0 },
  },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
});

const gamificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true,
  },
  userType: { type: String, enum: ['vendor', 'customer'], required: true },

  // XP System
  xp: {
    total: { type: Number, default: 0 },
    current: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    nextLevelXp: { type: Number, default: 1000 },
  },

  // Currency
  currency: {
    coins: { type: Number, default: 0 },
    gems: { type: Number, default: 0 },
  },

  // Streaks
  streaks: {
    login: { type: Number, default: 0 },
    sales: { type: Number, default: 0 },
    activity: { type: Number, default: 0 },
  },

  // Achievements & Badges
  achievements: [achievementSchema],
  badges: [badgeSchema],

  // Challenges
  activeChallenges: [challengeSchema],
  completedChallenges: [challengeSchema],

  // Statistics
  statistics: {
    totalSales: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    responseTime: { type: Number, default: 0 }, // in minutes
    completionRate: { type: Number, default: 0 }, // percentage
  },

  // Leaderboard
  leaderboardRank: { type: Number },
  categoryRank: { type: Number },

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastActivity: { type: Date, default: Date.now },
});

// Update the updatedAt field on save
gamificationSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Methods
gamificationSchema.methods.addXp = function (amount, reason) {
  this.xp.total += amount;
  this.xp.current += amount;

  // Check for level up
  const oldLevel = this.xp.level;
  const newLevel = Math.floor(this.xp.total / this.xp.nextLevelXp) + 1;

  if (newLevel > oldLevel) {
    this.xp.level = newLevel;
    // Increase XP needed for next level (progressive difficulty)
    this.xp.nextLevelXp = newLevel * 1000;

    return {
      levelUp: true,
      oldLevel,
      newLevel,
      xpEarned: amount,
      reason,
    };
  }

  return {
    levelUp: false,
    xpEarned: amount,
    reason,
  };
};

gamificationSchema.methods.unlockAchievement = function (achievement) {
  const exists = this.achievements.some(a => a.id === achievement.id);
  if (!exists) {
    this.achievements.push({
      ...achievement,
      unlockedAt: new Date(),
    });

    // Add XP reward
    this.addXp(achievement.xpReward || 0, `إنجاز: ${achievement.name}`);

    return true;
  }
  return false;
};

const Gamification = mongoose.model('Gamification', gamificationSchema);

module.exports = Gamification;
