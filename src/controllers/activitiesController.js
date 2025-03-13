const { getApiInstance } = require('../services/pipedriveService');
const logger = require('../utils/logger');

/**
 * Get all activities
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getActivities = async (req, res, next) => {
  try {
    const activitiesApi = getApiInstance('ActivitiesApi');
    const { user_id, limit = 100 } = req.query;
    
    const opts = {
      limit: parseInt(limit),
      start: 0,
      ...(user_id && { userId: parseInt(user_id) })
    };
    
    const response = await activitiesApi.getActivities(opts);
    
    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    logger.error(`Error getting activities: ${error.message}`);
    next(error);
  }
};

/**
 * Get an activity by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getActivityById = async (req, res, next) => {
  try {
    const activitiesApi = getApiInstance('ActivitiesApi');
    const { id } = req.params;
    
    const response = await activitiesApi.getActivitiesById(id);
    
    if (!response.data) {
      return res.status(404).json({
        success: false,
        error: 'Activity not found'
      });
    }
    
    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    logger.error(`Error getting activity by ID: ${error.message}`);
    next(error);
  }
};

/**
 * Create a new activity
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const createActivity = async (req, res, next) => {
  try {
    const activitiesApi = getApiInstance('ActivitiesApi');
    const activityData = req.body;
    
    const response = await activitiesApi.addActivity(activityData);
    
    res.status(201).json({
      success: true,
      data: response.data
    });
  } catch (error) {
    logger.error(`Error creating activity: ${error.message}`);
    next(error);
  }
};

/**
 * Update an activity
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const updateActivity = async (req, res, next) => {
  try {
    const activitiesApi = getApiInstance('ActivitiesApi');
    const { id } = req.params;
    const activityData = req.body;
    
    const response = await activitiesApi.updateActivity(id, activityData);
    
    if (!response.data) {
      return res.status(404).json({
        success: false,
        error: 'Activity not found'
      });
    }
    
    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    logger.error(`Error updating activity: ${error.message}`);
    next(error);
  }
};

/**
 * Delete an activity
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const deleteActivity = async (req, res, next) => {
  try {
    const activitiesApi = getApiInstance('ActivitiesApi');
    const { id } = req.params;
    
    const response = await activitiesApi.deleteActivity(id);
    
    if (!response.data || !response.data.success) {
      return res.status(404).json({
        success: false,
        error: 'Activity not found or could not be deleted'
      });
    }
    
    res.json({
      success: true,
      message: 'Activity deleted successfully'
    });
  } catch (error) {
    logger.error(`Error deleting activity: ${error.message}`);
    next(error);
  }
};

module.exports = {
  getActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity
}; 