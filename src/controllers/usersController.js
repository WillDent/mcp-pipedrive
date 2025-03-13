const { getApiInstance } = require('../services/pipedriveService');
const logger = require('../utils/logger');

/**
 * Get all users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getUsers = async (req, res, next) => {
  try {
    const usersApi = getApiInstance('UsersApi');
    
    const response = await usersApi.getUsers();
    
    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    logger.error(`Error getting users: ${error.message}`);
    next(error);
  }
};

/**
 * Get a user by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getUserById = async (req, res, next) => {
  try {
    const usersApi = getApiInstance('UsersApi');
    const { id } = req.params;
    
    const response = await usersApi.getUserById(id);
    
    if (!response.data) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    logger.error(`Error getting user by ID: ${error.message}`);
    next(error);
  }
};

/**
 * Get current user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getCurrentUser = async (req, res, next) => {
  try {
    const usersApi = getApiInstance('UsersApi');
    
    const response = await usersApi.getCurrentUser();
    
    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    logger.error(`Error getting current user: ${error.message}`);
    next(error);
  }
};

/**
 * Get deals for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getUserDeals = async (req, res, next) => {
  try {
    const dealsApi = getApiInstance('DealsApi');
    const { id } = req.params;
    
    const opts = {
      userId: parseInt(id)
    };
    
    const response = await dealsApi.getDeals(opts);
    
    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    logger.error(`Error getting user deals: ${error.message}`);
    next(error);
  }
};

/**
 * Get activities for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getUserActivities = async (req, res, next) => {
  try {
    const activitiesApi = getApiInstance('ActivitiesApi');
    const { id } = req.params;
    
    const opts = {
      userId: parseInt(id)
    };
    
    const response = await activitiesApi.getActivities(opts);
    
    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    logger.error(`Error getting user activities: ${error.message}`);
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  getCurrentUser,
  getUserDeals,
  getUserActivities
}; 