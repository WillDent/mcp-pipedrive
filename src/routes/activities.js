const express = require('express');
const activitiesController = require('../controllers/activitiesController');

const router = express.Router();

/**
 * @route GET /api/activities
 * @desc Get all activities
 */
router.get('/', activitiesController.getActivities);

/**
 * @route GET /api/activities/:id
 * @desc Get an activity by ID
 */
router.get('/:id', activitiesController.getActivityById);

/**
 * @route POST /api/activities
 * @desc Create a new activity
 */
router.post('/', activitiesController.createActivity);

/**
 * @route PUT /api/activities/:id
 * @desc Update an activity
 */
router.put('/:id', activitiesController.updateActivity);

/**
 * @route DELETE /api/activities/:id
 * @desc Delete an activity
 */
router.delete('/:id', activitiesController.deleteActivity);

module.exports = router; 