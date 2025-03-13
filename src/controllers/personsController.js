const { getApiInstance } = require('../services/pipedriveService');
const logger = require('../utils/logger');

/**
 * Get all persons
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getPersons = async (req, res, next) => {
  try {
    const personsApi = getApiInstance('PersonsApi');
    const { filter_id, limit = 100 } = req.query;
    
    const opts = {
      limit: parseInt(limit),
      start: 0,
      ...(filter_id && { filterId: parseInt(filter_id) })
    };
    
    const response = await personsApi.getPersons(opts);
    
    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    logger.error(`Error getting persons: ${error.message}`);
    next(error);
  }
};

/**
 * Get a person by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getPersonById = async (req, res, next) => {
  try {
    const personsApi = getApiInstance('PersonsApi');
    const { id } = req.params;
    
    const response = await personsApi.getPersonsById(id);
    
    if (!response.data) {
      return res.status(404).json({
        success: false,
        error: 'Person not found'
      });
    }
    
    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    logger.error(`Error getting person by ID: ${error.message}`);
    next(error);
  }
};

/**
 * Create a new person
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const createPerson = async (req, res, next) => {
  try {
    const personsApi = getApiInstance('PersonsApi');
    const personData = req.body;
    
    const response = await personsApi.addPerson(personData);
    
    res.status(201).json({
      success: true,
      data: response.data
    });
  } catch (error) {
    logger.error(`Error creating person: ${error.message}`);
    next(error);
  }
};

/**
 * Update a person
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const updatePerson = async (req, res, next) => {
  try {
    const personsApi = getApiInstance('PersonsApi');
    const { id } = req.params;
    const personData = req.body;
    
    const response = await personsApi.updatePerson(id, personData);
    
    if (!response.data) {
      return res.status(404).json({
        success: false,
        error: 'Person not found'
      });
    }
    
    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    logger.error(`Error updating person: ${error.message}`);
    next(error);
  }
};

/**
 * Delete a person
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const deletePerson = async (req, res, next) => {
  try {
    const personsApi = getApiInstance('PersonsApi');
    const { id } = req.params;
    
    const response = await personsApi.deletePerson(id);
    
    if (!response.data || !response.data.success) {
      return res.status(404).json({
        success: false,
        error: 'Person not found or could not be deleted'
      });
    }
    
    res.json({
      success: true,
      message: 'Person deleted successfully'
    });
  } catch (error) {
    logger.error(`Error deleting person: ${error.message}`);
    next(error);
  }
};

/**
 * Get deals for a person
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getPersonDeals = async (req, res, next) => {
  try {
    const personsApi = getApiInstance('PersonsApi');
    const { id } = req.params;
    
    const response = await personsApi.getPersonDeals(id);
    
    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    logger.error(`Error getting person deals: ${error.message}`);
    next(error);
  }
};

/**
 * Get activities for a person
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getPersonActivities = async (req, res, next) => {
  try {
    const personsApi = getApiInstance('PersonsApi');
    const { id } = req.params;
    
    const response = await personsApi.getPersonActivities(id);
    
    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    logger.error(`Error getting person activities: ${error.message}`);
    next(error);
  }
};

module.exports = {
  getPersons,
  getPersonById,
  createPerson,
  updatePerson,
  deletePerson,
  getPersonDeals,
  getPersonActivities
}; 