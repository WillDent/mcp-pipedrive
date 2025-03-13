const express = require('express');
const notesController = require('../controllers/notesController');

const router = express.Router();

/**
 * @route GET /api/notes
 * @desc Get all notes
 */
router.get('/', notesController.getNotes);

/**
 * @route GET /api/notes/:id
 * @desc Get a note by ID
 */
router.get('/:id', notesController.getNoteById);

/**
 * @route POST /api/notes
 * @desc Create a new note
 */
router.post('/', notesController.createNote);

/**
 * @route PUT /api/notes/:id
 * @desc Update a note
 */
router.put('/:id', notesController.updateNote);

/**
 * @route DELETE /api/notes/:id
 * @desc Delete a note
 */
router.delete('/:id', notesController.deleteNote);

module.exports = router; 