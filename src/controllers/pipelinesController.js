const { getApiInstance } = require('../services/pipedriveService');
const logger = require('../utils/logger');

/**
 * Get all pipelines
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getPipelines = async (req, res, next) => {
  try {
    const pipelinesApi = getApiInstance('PipelinesApi');
    
    const response = await pipelinesApi.getPipelines();
    
    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    logger.error(`Error getting pipelines: ${error.message}`);
    next(error);
  }
};

/**
 * Get a pipeline by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getPipelineById = async (req, res, next) => {
  try {
    const pipelinesApi = getApiInstance('PipelinesApi');
    const { id } = req.params;
    
    const response = await pipelinesApi.getPipelineById(id);
    
    if (!response.data) {
      return res.status(404).json({
        success: false,
        error: 'Pipeline not found'
      });
    }
    
    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    logger.error(`Error getting pipeline by ID: ${error.message}`);
    next(error);
  }
};

/**
 * Get deals for a pipeline
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getPipelineDeals = async (req, res, next) => {
  try {
    const dealsApi = getApiInstance('DealsApi');
    const { id } = req.params;
    
    const opts = {
      pipelineId: parseInt(id)
    };
    
    const response = await dealsApi.getDeals(opts);
    
    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    logger.error(`Error getting pipeline deals: ${error.message}`);
    next(error);
  }
};

/**
 * Get stages for a pipeline
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getPipelineStages = async (req, res, next) => {
  try {
    const stagesApi = getApiInstance('StagesApi');
    const { id } = req.params;
    
    const opts = {
      pipelineId: parseInt(id)
    };
    
    const response = await stagesApi.getStages(opts);
    
    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    logger.error(`Error getting pipeline stages: ${error.message}`);
    next(error);
  }
};

module.exports = {
  getPipelines,
  getPipelineById,
  getPipelineDeals,
  getPipelineStages
}; 