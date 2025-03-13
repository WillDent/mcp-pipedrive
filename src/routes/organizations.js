const express = require('express');
const organizationsController = require('../controllers/organizationsController');

const router = express.Router();

/**
 * @route GET /api/organizations
 * @desc Get all organizations
 */
router.get('/', organizationsController.getOrganizations);

/**
 * @route GET /api/organizations/:id
 * @desc Get an organization by ID
 */
router.get('/:id', organizationsController.getOrganizationById);

/**
 * @route POST /api/organizations
 * @desc Create a new organization
 */
router.post('/', organizationsController.createOrganization);

/**
 * @route PUT /api/organizations/:id
 * @desc Update an organization
 */
router.put('/:id', organizationsController.updateOrganization);

/**
 * @route DELETE /api/organizations/:id
 * @desc Delete an organization
 */
router.delete('/:id', organizationsController.deleteOrganization);

/**
 * @route GET /api/organizations/:id/deals
 * @desc Get deals for an organization
 */
router.get('/:id/deals', organizationsController.getOrganizationDeals);

/**
 * @route GET /api/organizations/:id/persons
 * @desc Get persons for an organization
 */
router.get('/:id/persons', organizationsController.getOrganizationPersons);

module.exports = router; 