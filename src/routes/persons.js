const express = require('express');
const personsController = require('../controllers/personsController');

const router = express.Router();

/**
 * @route GET /api/persons
 * @desc Get all persons
 */
router.get('/', personsController.getPersons);

/**
 * @route GET /api/persons/:id
 * @desc Get a person by ID
 */
router.get('/:id', personsController.getPersonById);

/**
 * @route POST /api/persons
 * @desc Create a new person
 */
router.post('/', personsController.createPerson);

/**
 * @route PUT /api/persons/:id
 * @desc Update a person
 */
router.put('/:id', personsController.updatePerson);

/**
 * @route DELETE /api/persons/:id
 * @desc Delete a person
 */
router.delete('/:id', personsController.deletePerson);

/**
 * @route GET /api/persons/:id/deals
 * @desc Get deals for a person
 */
router.get('/:id/deals', personsController.getPersonDeals);

/**
 * @route GET /api/persons/:id/activities
 * @desc Get activities for a person
 */
router.get('/:id/activities', personsController.getPersonActivities);

module.exports = router; 