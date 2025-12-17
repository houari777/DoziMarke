// ⚙️ backend/src/controllers/gamificationController.js
const Gamification = require('../models/Gamification');
const XPCalculator = require('../services/xpCalculator');
const LevelManager = require('../services/levelManager');

class GamificationController {
  // Get user's gamification data
  async getUserData(req, res) {
    try {
      const { userId } = req.params;

      let gamificationData = await Gamification.findOne({ userId });

      if (!gamificationData) {
        // Create new gamification profile
        gamificationData = new Gamification({
          userId,
          userType: req.query.userType || 'vendor',
        });
        await gamificationData.save();
      }

      // Calculate level progress
      const levelInfo = LevelManager.calculateLevel(
        gamificationData.xp.total,
        gamificationData.userType,
      );

      res.json({
        success: true,
        data: {
          xp: gamificationData.xp,
          currency: gamificationData.currency,
          streaks: gamificationData.streaks,
          achievements: gamificationData.achievements,
          badges: gamificationData.badges,
          activeChallenges: gamificationData.activeChallenges,
          statistics: gamificationData.statistics,
          leaderboardRank: gamificationData.leaderboardRank,
          levelInfo,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Add XP for an action
  async addXp(req, res) {
    try {
      const { userId } = req.params;
      const { action, data } = req.body;

      const gamificationData = await Gamification.findOne({ userId });
      if (!gamificationData) {
        return res.status(404).json({
          success: false,
          error: 'Gamification data not found',
        });
      }

      // Calculate XP earned
      const xpEarned = XPCalculator.calculateXp(
        action,
        data,
        gamificationData.userType,
      );

      // Add XP
      const result = gamificationData.addXp(xpEarned, action);

      // Update statistics based on action
      this.updateStatistics(gamificationData, action, data);

      // Check for achievements
      const unlockedAchievements = await this.checkAchievements(
        gamificationData,
        action,
        data,
      );

      // Update streaks
      this.updateStreaks(gamificationData, action);

      await gamificationData.save();

      res.json({
        success: true,
        data: {
          xpEarned,
          newTotalXp: gamificationData.xp.total,
          level: gamificationData.xp.level,
          levelUp: result.levelUp,
          unlockedAchievements,
          currentStreak: gamificationData.streaks.login,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Get leaderboard
  async getLeaderboard(req, res) {
    try {
      const { category = 'xp', limit = 50, page = 1 } = req.query;

      const sortCriteria = {};
      switch (category) {
        case 'xp':
          sortCriteria['xp.total'] = -1;
          break;
        case 'sales':
          sortCriteria['statistics.totalSales'] = -1;
          break;
        case 'revenue':
          sortCriteria['statistics.totalRevenue'] = -1;
          break;
        default:
          sortCriteria['xp.total'] = -1;
      }

      const skip = (page - 1) * limit;

      const [leaderboard, total] = await Promise.all([
        Gamification.find()
          .sort(sortCriteria)
          .skip(skip)
          .limit(parseInt(limit))
          .populate('userId', 'name storeName'),
        Gamification.countDocuments(),
      ]);

      // Add rank to each entry
      const rankedLeaderboard = leaderboard.map((item, index) => ({
        rank: skip + index + 1,
        userId: item.userId._id,
        name: item.userId.name,
        storeName: item.userId.storeName,
        xp: item.xp.total,
        level: item.xp.level,
        sales: item.statistics.totalSales,
        revenue: item.statistics.totalRevenue,
        rating: item.statistics.averageRating,
      }));

      res.json({
        success: true,
        data: {
          leaderboard: rankedLeaderboard,
          total,
          page: parseInt(page),
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Get daily challenges
  async getDailyChallenges(req, res) {
    try {
      const { userId } = req.params;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const gamificationData = await Gamification.findOne({ userId });

      if (!gamificationData) {
        return res.status(404).json({
          success: false,
          error: 'Gamification data not found',
        });
      }

      // Filter today's challenges
      const todayChallenges = gamificationData.activeChallenges.filter(
        challenge => {
          const challengeDate = new Date(challenge.startDate);
          challengeDate.setHours(0, 0, 0, 0);
          return (
            challengeDate.getTime() === today.getTime() && !challenge.completed
          );
        },
      );

      // If no challenges for today, generate new ones
      if (todayChallenges.length === 0) {
        const newChallenges = this.generateDailyChallenges(gamificationData);
        gamificationData.activeChallenges.push(...newChallenges);
        await gamificationData.save();

        res.json({
          success: true,
          data: newChallenges,
        });
      } else {
        res.json({
          success: true,
          data: todayChallenges,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Update challenge progress
  async updateChallengeProgress(req, res) {
    try {
      const { userId, challengeId } = req.params;
      const { progress } = req.body;

      const gamificationData = await Gamification.findOne({ userId });

      if (!gamificationData) {
        return res.status(404).json({
          success: false,
          error: 'Gamification data not found',
        });
      }

      const challenge = gamificationData.activeChallenges.id(challengeId);

      if (!challenge) {
        return res.status(404).json({
          success: false,
          error: 'Challenge not found',
        });
      }

      challenge.progress = progress;

      if (progress >= challenge.goal) {
        challenge.completed = true;
        challenge.completedAt = new Date();

        // Award rewards
        gamificationData.addXp(challenge.rewards.xp, `تحدي: ${challenge.name}`);
        gamificationData.currency.coins += challenge.rewards.coins;
        gamificationData.currency.gems += challenge.rewards.gems;

        // Move to completed challenges
        gamificationData.completedChallenges.push(challenge.toObject());
        gamificationData.activeChallenges.pull(challengeId);
      }

      await gamificationData.save();

      res.json({
        success: true,
        data: {
          challenge,
          completed: challenge.completed,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Get achievements
  async getAchievements(req, res) {
    try {
      const { userId } = req.params;
      const gamificationData = await Gamification.findOne({ userId });

      if (!gamificationData) {
        return res.status(404).json({
          success: false,
          error: 'Gamification data not found',
        });
      }

      res.json({
        success: true,
        data: gamificationData.achievements,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Claim reward
  async claimReward(req, res) {
    try {
      const { userId } = req.params;
      const { rewardId } = req.body;

      const gamificationData = await Gamification.findOne({ userId });

      if (!gamificationData) {
        return res.status(404).json({
          success: false,
          error: 'Gamification data not found',
        });
      }

      // Placeholder for reward claiming logic
      // In a real app, you'd verify the reward, ensure it's claimable, etc.
      gamificationData.currency.coins += 100; // Example reward
      await gamificationData.save();

      res.json({
        success: true,
        message: `Reward ${rewardId} claimed successfully!`,
        data: {
          newCoins: gamificationData.currency.coins,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Helper methods
  updateStatistics(gamificationData, action, data) {
    switch (action) {
      case 'sale_completed':
        gamificationData.statistics.totalSales += 1;
        gamificationData.statistics.totalRevenue += data.amount || 0;
        break;

      case 'review_received':
        const oldTotal =
          gamificationData.statistics.averageRating *
          (gamificationData.statistics.totalSales - 1);
        const newAverage =
          (oldTotal + data.rating) / gamificationData.statistics.totalSales;
        gamificationData.statistics.averageRating = newAverage;
        break;

      case 'response_sent':
        gamificationData.statistics.responseTime = data.responseTime;
        break;
    }
  }

  async checkAchievements(gamificationData, action, data) {
    const unlocked = [];
    const AchievementChecker = require('../services/achievementChecker');

    const achievements = await AchievementChecker.checkAchievements(
      gamificationData,
      action,
      data,
    );

    achievements.forEach(achievement => {
      if (gamificationData.unlockAchievement(achievement)) {
        unlocked.push(achievement);
      }
    });

    return unlocked;
  }

  updateStreaks(gamificationData, action) {
    const today = new Date();
    const lastActivity = gamificationData.lastActivity;

    switch (action) {
      case 'login':
        if (lastActivity) {
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          yesterday.setHours(0, 0, 0, 0);

          const lastActivityDate = new Date(lastActivity);
          lastActivityDate.setHours(0, 0, 0, 0);

          if (lastActivityDate.getTime() === yesterday.getTime()) {
            // Consecutive day
            gamificationData.streaks.login += 1;
          } else if (lastActivityDate.getTime() !== today.getTime()) {
            // Broken streak
            gamificationData.streaks.login = 1;
          }
        } else {
          gamificationData.streaks.login = 1;
        }
        break;

      case 'sale_completed':
        gamificationData.streaks.sales += 1;
        break;
    }

    gamificationData.lastActivity = today;
  }

  generateDailyChallenges(gamificationData) {
    const challenges = [];
    const today = new Date();

    // Sales challenge
    challenges.push({
      id: `daily_sales_${today.getTime()}`,
      name: 'إكمال 5 مبيعات اليوم',
      description: 'أكمل 5 عمليات بيع لتحصل على مكافأة',
      type: 'daily',
      goal: 5,
      progress: 0,
      rewards: {
        xp: 100,
        coins: 50,
        gems: 0,
      },
      startDate: today,
    });

    // Engagement challenge
    challenges.push({
      id: `daily_engagement_${today.getTime()}`,
      name: 'الرد على 10 استفسارات',
      description: 'رد على 10 استفسارات من العملاء',
      type: 'daily',
      goal: 10,
      progress: 0,
      rewards: {
        xp: 75,
        coins: 30,
        gems: 0,
      },
      startDate: today,
    });

    // Quality challenge
    challenges.push({
      id: `daily_quality_${today.getTime()}`,
      name: 'الحصول على 3 تقييمات 5 نجوم',
      description: 'احصل على 3 تقييمات بخمس نجوم من العملاء',
      type: 'daily',
      goal: 3,
      progress: 0,
      rewards: {
        xp: 150,
        coins: 75,
        gems: 1,
      },
      startDate: today,
    });

    return challenges;
  }
}

module.exports = new GamificationController();
