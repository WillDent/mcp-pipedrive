const express = require('express');
const dealsController = require('../controllers/dealsController');

const router = express.Router();

/**
 * @route GET /api/deals
 * @desc Get all deals
 */
router.get('/', dealsController.getDeals);

/**
 * @route GET /api/deals/:id
 * @desc Get a deal by ID
 */
router.get('/:id', dealsController.getDealById);

/**
 * @route POST /api/deals
 * @desc Create a new deal
 */
router.post('/', dealsController.createDeal);

/**
 * @route PUT /api/deals/:id
 * @desc Update a deal
 */
router.put('/:id', dealsController.updateDeal);

/**
 * @route DELETE /api/deals/:id
 * @desc Delete a deal
 */
router.delete('/:id', dealsController.deleteDeal);

/**
 * @route GET /api/deals/:id/activities
 * @desc Get activities for a deal
 */
router.get('/:id/activities', dealsController.getDealActivities);

/**
 * @route GET /api/deals/:id/notes
 * @desc Get notes for a deal
 */
router.get('/:id/notes', dealsController.getDealNotes);

module.exports = router; 