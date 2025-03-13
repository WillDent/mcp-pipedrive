import Pipedrive from 'pipedrive';
import logger from '../utils/logger.js';

let pipedriveClient = null;

/**
 * Initialize the Pipedrive API client
 */
export const setupPipedriveClient = () => {
  try {
    const apiToken = process.env.PIPEDRIVE_API_TOKEN;
    
    if (!apiToken) {
      throw new Error('Pipedrive API token is not set in environment variables');
    }
    
    // Initialize the Pipedrive client with API v2
    pipedriveClient = new Pipedrive.ApiClient();
    
    // Configure API key authorization
    const apiKey = pipedriveClient.authentications.api_key;
    apiKey.apiKey = apiToken;
    
    logger.info('Pipedrive client initialized successfully');
    return pipedriveClient;
  } catch (error) {
    logger.error(`Failed to initialize Pipedrive client: ${error.message}`);
    throw error;
  }
};

/**
 * Get the initialized Pipedrive client
 * @returns {Object} Pipedrive client instance
 */
export const getPipedriveClient = () => {
  if (!pipedriveClient) {
    throw new Error('Pipedrive client not initialized');
  }
  return pipedriveClient;
};

/**
 * Get an API instance for a specific Pipedrive resource
 * @param {string} resource - The Pipedrive resource (e.g., 'DealsApi', 'PersonsApi')
 * @returns {Object} API instance for the specified resource
 */
export const getApiInstance = (resource) => {
  try {
    if (!pipedriveClient) {
      throw new Error('Pipedrive client not initialized');
    }
    
    if (!Pipedrive[resource]) {
      throw new Error(`Invalid Pipedrive resource: ${resource}`);
    }
    
    return new Pipedrive[resource](pipedriveClient);
  } catch (error) {
    logger.error(`Failed to get API instance for ${resource}: ${error.message}`);
    throw error;
  }
}; 