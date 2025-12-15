// ⚙️ backend/src/routes/gamification.js
const express = require('express');
const router = express.Router();
const gamificationController = require('../controllers/gamificationController');
const auth = require('../middleware/auth');

router.use(auth);

// بيانات النظام التلعبيبي
router.get('/:userId', gamificationController.getUserData);

// كسب XP
router.post('/:userId/xp', gamificationController.addXp);

// لوحة المتصدرين
router.get('/leaderboard', gamificationController.getLeaderboard);

// التحديات
router.get(
  '/:userId/challenges/daily',
  gamificationController.getDailyChallenges,
);
router.put(
  '/:userId/challenges/:challengeId',
  gamificationController.updateChallengeProgress,
);

// الإنجازات
router.get('/:userId/achievements', gamificationController.getAchievements);

// المكافآت
router.post('/:userId/rewards/claim', gamificationController.claimReward);

module.exports = router;
