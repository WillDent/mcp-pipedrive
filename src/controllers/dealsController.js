const { getApiInstance } = require('../services/pipedriveService');
const logger = require('../utils/logger');

/**
 * Get all deals
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getDeals = async (req, res, next) => {
  try {
    const dealsApi = getApiInstance('DealsApi');
    const { filter_id, user_id, stage_id, status, limit = 100 } = req.query;
    
    const opts = {
      limit: parseInt(limit),
      start: 0,
      ...(filter_id && { filterId: parseInt(filter_id) }),
      ...(user_id && { userId: parseInt(user_id) }),
      ...(stage_id && { stageId: parseInt(stage_id) }),
      ...(status && { status })
    };
    
    const response = await dealsApi.getDeals(opts);
    
    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    logger.error(`Error getting deals: ${error.message}`);
    next(error);
  }
};

/**
 * Get a deal by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getDealById = async (req, res, next) => {
  try {
    const dealsApi = getApiInstance('DealsApi');
    const { id } = req.params;
    
    const response = await dealsApi.getDealsById(id);
    
    if (!response.data) {
      return res.status(404).json({
        success: false,
        error: 'Deal not found'
      });
    }
    
    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    logger.error(`Error getting deal by ID: ${error.message}`);
    next(error);
  }
};

/**
 * Create a new deal
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const createDeal = async (req, res, next) => {
  try {
    const dealsApi = getApiInstance('DealsApi');
    const dealData = req.body;
    
    const response = await dealsApi.addDeal(dealData);
    
    res.status(201).json({
      success: true,
      data: response.data
    });
  } catch (error) {
    logger.error(`Error creating deal: ${error.message}`);
    next(error);
  }
};

/**
 * Update a deal
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const updateDeal = async (req, res, next) => {
  try {
    const dealsApi = getApiInstance('DealsApi');
    const { id } = req.params;
    const dealData = req.body;
    
    const response = await dealsApi.updateDeal(id, dealData);
    
    if (!response.data) {
      return res.status(404).json({
        success: false,
        error: 'Deal not found'
      });
    }
    
    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    logger.error(`Error updating deal: ${error.message}`);
    next(error);
  }
};

/**
 * Delete a deal
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const deleteDeal = async (req, res, next) => {
  try {
    const dealsApi = getApiInstance('DealsApi');
    const { id } = req.params;
    
    const response = await dealsApi.deleteDeal(id);
    
    if (!response.data || !response.data.success) {
      return res.status(404).json({
        success: false,
        error: 'Deal not found or could not be deleted'
      });
    }
    
    res.json({
      success: true,
      message: 'Deal deleted successfully'
    });
  } catch (error) {
    logger.error(`Error deleting deal: ${error.message}`);
    next(error);
  }
};

/**
 * Get activities for a deal
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getDealActivities = async (req, res, next) => {
  try {
    const dealsApi = getApiInstance('DealsApi');
    const { id } = req.params;
    
    const response = await dealsApi.getDealActivities(id);
    
    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    logger.error(`Error getting deal activities: ${error.message}`);
    next(error);
  }
};

/**
 * Get notes for a deal
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getDealNotes = async (req, res, next) => {
  try {
    const notesApi = getApiInstance('NotesApi');
    const { id } = req.params;
    
    const opts = {
      dealId: id
    };
    
    const response = await notesApi.getNotes(opts);
    
    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    logger.error(`Error getting deal notes: ${error.message}`);
    next(error);
  }
};

module.exports = {
  getDeals,
  getDealById,
  createDeal,
  updateDeal,
  deleteDeal,
  getDealActivities,
  getDealNotes
}; 