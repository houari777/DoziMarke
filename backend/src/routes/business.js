// ⚙️ backend/src/routes/business.js
const express = require('express');
const router = express.Router();
const businessController = require('../controllers/businessController');
const auth = require('../middleware/auth');

// جميع المسارات تتطلب مصادقة
router.use(auth);

// معلومات التاجر
router.get('/profile', businessController.getProfile);
router.put('/profile', businessController.updateProfile);

// المنتجات
router.get('/products', businessController.getProducts);
router.get('/products/:id', businessController.getProduct);
router.post('/products', businessController.createProduct);
router.put('/products/:id', businessController.updateProduct);
router.delete('/products/:id', businessController.deleteProduct);

// الطلبات
router.get('/orders', businessController.getOrders);
router.get('/orders/:id', businessController.getOrder);
router.put('/orders/:id/status', businessController.updateOrderStatus);

// الإحصائيات
router.get('/stats', businessController.getStats);
router.get('/analytics', businessController.getAnalytics);

// المخزون
router.get('/inventory', businessController.getInventory);
router.post('/inventory/update', businessController.updateInventory);

// الشحن والتوصيل
router.get('/shipping', businessController.getShippingMethods);
router.post('/shipping', businessController.addShippingMethod);
router.put('/shipping/:id', businessController.updateShippingMethod);

module.exports = router;
