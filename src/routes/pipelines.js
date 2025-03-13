const express = require('express');
const pipelinesController = require('../controllers/pipelinesController');

const router = express.Router();

/**
 * @route GET /api/pipelines
 * @desc Get all pipelines
 */
router.get('/', pipelinesController.getPipelines);

/**
 * @route GET /api/pipelines/:id
 * @desc Get a pipeline by ID
 */
router.get('/:id', pipelinesController.getPipelineById);

/**
 * @route GET /api/pipelines/:id/deals
 * @desc Get deals for a pipeline
 */
router.get('/:id/deals', pipelinesController.getPipelineDeals);

/**
 * @route GET /api/pipelines/:id/stages
 * @desc Get stages for a pipeline
 */
router.get('/:id/stages', pipelinesController.getPipelineStages);

module.exports = router; 