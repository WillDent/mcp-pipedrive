const { getApiInstance } = require('../services/pipedriveService');
const logger = require('../utils/logger');

/**
 * Get all organizations
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getOrganizations = async (req, res, next) => {
  try {
    const organizationsApi = getApiInstance('OrganizationsApi');
    const { filter_id, limit = 100 } = req.query;
    
    const opts = {
      limit: parseInt(limit),
      start: 0,
      ...(filter_id && { filterId: parseInt(filter_id) })
    };
    
    const response = await organizationsApi.getOrganizations(opts);
    
    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    logger.error(`Error getting organizations: ${error.message}`);
    next(error);
  }
};

/**
 * Get an organization by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getOrganizationById = async (req, res, next) => {
  try {
    const organizationsApi = getApiInstance('OrganizationsApi');
    const { id } = req.params;
    
    const response = await organizationsApi.getOrganizationsById(id);
    
    if (!response.data) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found'
      });
    }
    
    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    logger.error(`Error getting organization by ID: ${error.message}`);
    next(error);
  }
};

/**
 * Create a new organization
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const createOrganization = async (req, res, next) => {
  try {
    const organizationsApi = getApiInstance('OrganizationsApi');
    const organizationData = req.body;
    
    const response = await organizationsApi.addOrganization(organizationData);
    
    res.status(201).json({
      success: true,
      data: response.data
    });
  } catch (error) {
    logger.error(`Error creating organization: ${error.message}`);
    next(error);
  }
};

/**
 * Update an organization
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const updateOrganization = async (req, res, next) => {
  try {
    const organizationsApi = getApiInstance('OrganizationsApi');
    const { id } = req.params;
    const organizationData = req.body;
    
    const response = await organizationsApi.updateOrganization(id, organizationData);
    
    if (!response.data) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found'
      });
    }
    
    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    logger.error(`Error updating organization: ${error.message}`);
    next(error);
  }
};

/**
 * Delete an organization
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const deleteOrganization = async (req, res, next) => {
  try {
    const organizationsApi = getApiInstance('OrganizationsApi');
    const { id } = req.params;
    
    const response = await organizationsApi.deleteOrganization(id);
    
    if (!response.data || !response.data.success) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found or could not be deleted'
      });
    }
    
    res.json({
      success: true,
      message: 'Organization deleted successfully'
    });
  } catch (error) {
    logger.error(`Error deleting organization: ${error.message}`);
    next(error);
  }
};

/**
 * Get deals for an organization
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getOrganizationDeals = async (req, res, next) => {
  try {
    const organizationsApi = getApiInstance('OrganizationsApi');
    const { id } = req.params;
    
    const response = await organizationsApi.getOrganizationDeals(id);
    
    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    logger.error(`Error getting organization deals: ${error.message}`);
    next(error);
  }
};

/**
 * Get persons for an organization
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getOrganizationPersons = async (req, res, next) => {
  try {
    const organizationsApi = getApiInstance('OrganizationsApi');
    const { id } = req.params;
    
    const response = await organizationsApi.getOrganizationPersons(id);
    
    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    logger.error(`Error getting organization persons: ${error.message}`);
    next(error);
  }
};

module.exports = {
  getOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  getOrganizationDeals,
  getOrganizationPersons
}; 