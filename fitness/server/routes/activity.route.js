const express = require('express');
const router = express.Router();
const ActivityController = require('../controllers/activity.controller');
const { authenticate } = require('../config/jwt.config');

// All routes require authentication
router.use(authenticate);

// Create new activity
router.post('/', ActivityController.createActivity);

// Get all activities for logged-in user
router.get('/', ActivityController.getAllActivities);

// Get activity statistics
router.get('/stats', ActivityController.getActivityStats);

// Get one activity by id
router.get('/:id', ActivityController.getOneActivity);

// Update activity
router.put('/:id', ActivityController.updateActivity);

// Delete activity
router.delete('/:id', ActivityController.deleteActivity);

module.exports = router; 
