const express = require('express');
const usersController = require('../controllers/usersController');

const router = express.Router();

/**
 * @route GET /api/users
 * @desc Get all users
 */
router.get('/', usersController.getUsers);

/**
 * @route GET /api/users/:id
 * @desc Get a user by ID
 */
router.get('/:id', usersController.getUserById);

/**
 * @route GET /api/users/me
 * @desc Get current user
 */
router.get('/me', usersController.getCurrentUser);

/**
 * @route GET /api/users/:id/deals
 * @desc Get deals for a user
 */
router.get('/:id/deals', usersController.getUserDeals);

/**
 * @route GET /api/users/:id/activities
 * @desc Get activities for a user
 */
router.get('/:id/activities', usersController.getUserActivities);

module.exports = router; 