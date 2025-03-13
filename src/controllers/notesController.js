const { getApiInstance } = require('../services/pipedriveService');
const logger = require('../utils/logger');

/**
 * Get all notes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getNotes = async (req, res, next) => {
  try {
    const notesApi = getApiInstance('NotesApi');
    const { deal_id, person_id, org_id, limit = 100 } = req.query;
    
    const opts = {
      limit: parseInt(limit),
      start: 0,
      ...(deal_id && { dealId: parseInt(deal_id) }),
      ...(person_id && { personId: parseInt(person_id) }),
      ...(org_id && { orgId: parseInt(org_id) })
    };
    
    const response = await notesApi.getNotes(opts);
    
    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    logger.error(`Error getting notes: ${error.message}`);
    next(error);
  }
};

/**
 * Get a note by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getNoteById = async (req, res, next) => {
  try {
    const notesApi = getApiInstance('NotesApi');
    const { id } = req.params;
    
    const response = await notesApi.getNotesById(id);
    
    if (!response.data) {
      return res.status(404).json({
        success: false,
        error: 'Note not found'
      });
    }
    
    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    logger.error(`Error getting note by ID: ${error.message}`);
    next(error);
  }
};

/**
 * Create a new note
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const createNote = async (req, res, next) => {
  try {
    const notesApi = getApiInstance('NotesApi');
    const noteData = req.body;
    
    const response = await notesApi.addNote(noteData);
    
    res.status(201).json({
      success: true,
      data: response.data
    });
  } catch (error) {
    logger.error(`Error creating note: ${error.message}`);
    next(error);
  }
};

/**
 * Update a note
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const updateNote = async (req, res, next) => {
  try {
    const notesApi = getApiInstance('NotesApi');
    const { id } = req.params;
    const noteData = req.body;
    
    const response = await notesApi.updateNote(id, noteData);
    
    if (!response.data) {
      return res.status(404).json({
        success: false,
        error: 'Note not found'
      });
    }
    
    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    logger.error(`Error updating note: ${error.message}`);
    next(error);
  }
};

/**
 * Delete a note
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const deleteNote = async (req, res, next) => {
  try {
    const notesApi = getApiInstance('NotesApi');
    const { id } = req.params;
    
    const response = await notesApi.deleteNote(id);
    
    if (!response.data || !response.data.success) {
      return res.status(404).json({
        success: false,
        error: 'Note not found or could not be deleted'
      });
    }
    
    res.json({
      success: true,
      message: 'Note deleted successfully'
    });
  } catch (error) {
    logger.error(`Error deleting note: ${error.message}`);
    next(error);
  }
};

module.exports = {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote
}; 