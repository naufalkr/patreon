const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const creatorProfileController = require('../controllers/creatorProfile.controller');
const tierController = require('../controllers/tier.controller');
const subscriptionController = require('../controllers/subscription.controller');
const paymentController = require('../controllers/payment.controller');

// Initialize creator status
router.post('/user/initialize-creator', userController.initializeCreator);

// User profile routes
router.put('/user/profile', userController.updateUserProfile);

// Creator profile routes
router.put('/creator/profile', creatorProfileController.updateCreatorProfile);

// CRUD for Tiers
router.post('/tier', tierController.createTier);
router.get('/tier/:id', tierController.getTier);
router.put('/tier/:id', tierController.updateTier);
router.delete('/tier/:id', tierController.deleteTier);

// Subscription routes
router.post('/subscription/start', subscriptionController.startSubscription);
router.post('/subscription/cancel', subscriptionController.cancelSubscription);

// Payment log
router.post('/payment', paymentController.createPaymentLog);

module.exports = router;
