// ⚙️ backend/src/routes/negotiation.js
const express = require('express');
const router = express.Router();
const negotiationController = require('../controllers/negotiationController');
const auth = require('../middleware/auth');

router.use(auth);

// التفاوضات النشطة
router.get('/', negotiationController.getNegotiations);
router.get('/:id', negotiationController.getNegotiation);

// إنشاء تفاوض جديد
router.post('/', negotiationController.createNegotiation);

// الرد على التفاوض
router.post('/:id/respond', negotiationController.respondToNegotiation);

// قبول/رفض التفاوض
router.put('/:id/status', negotiationController.updateNegotiationStatus);

// رسائل التفاوض
router.get('/:id/messages', negotiationController.getMessages);
router.post('/:id/messages', negotiationController.sendMessage);

// اقتراحات الذكاء الاصطناعي
router.get('/:id/ai-suggestions', negotiationController.getAiSuggestions);
router.post(
  '/:id/apply-ai-suggestion',
  negotiationController.applyAiSuggestion,
);

module.exports = router;
