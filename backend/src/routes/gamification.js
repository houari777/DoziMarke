const express = require('express');
const router = express.Router();
const gamificationController = require('../controllers/gamificationController');
const authMiddleware = require('../middleware/auth');

// All gamification routes require authentication
router.use(authMiddleware);

router.get('/me', gamificationController.getGamificationData);
router.post('/event', gamificationController.processEvent);
router.get('/leaderboard', gamificationController.getLeaderboard);

module.exports = router;
