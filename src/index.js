import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ListResourcesRequestSchema, ListPromptsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import dotenv from "dotenv";
import { setupPipedriveClient, getApiInstance } from "./services/pipedriveService.js";
import logger from "./utils/logger.js";

// Load environment variables
dotenv.config();

// Initialize Pipedrive client
setupPipedriveClient();

// Create an MCP server
const server = new McpServer({
  name: "Pipedrive MCP Server",
  version: "1.0.0",
  description: "MCP server for Pipedrive CRM integration"
});

// Define available resources for discovery
const availableResources = [
  { name: "Deals", uri: "pipedrive://deals", description: "Access Pipedrive deals" },
  { name: "Persons", uri: "pipedrive://persons", description: "Access Pipedrive persons/contacts" },
  { name: "Organizations", uri: "pipedrive://organizations", description: "Access Pipedrive organizations/companies" }
];

// Register a resource registry to help with discovery
server.resource(
  "registry",
  "pipedrive://",
  async (uri) => {
    logger.info(`Resource registry called with URI: ${uri.href}`);
    return {
      contents: [{
        uri: uri.href,
        text: JSON.stringify({
          description: "Pipedrive CRM Resources",
          resources: availableResources
        }, null, 2)
      }]
    };
  }
);

// Register direct handlers for specific methods
server.server.setRequestHandler(
  ListResourcesRequestSchema,
  async (request) => {
    logger.info('Direct resources/list handler called');
    return {
      resources: [
        {
          name: 'Deals',
          description: 'Access Pipedrive deals',
          uri: 'pipedrive://deals'
        },
        {
          name: 'Persons',
          description: 'Access Pipedrive persons/contacts',
          uri: 'pipedrive://persons'
        },
        {
          name: 'Organizations',
          description: 'Access Pipedrive organizations/companies',
          uri: 'pipedrive://organizations'
        }
      ]
    };
  }
);

// Add resources/get handler
const GetResourceRequestSchema = z.object({
  method: z.literal("resources/get"),
  params: z.object({
    uri: z.string()
  })
});

server.server.setRequestHandler(
  GetResourceRequestSchema,
  async (request) => {
    logger.info(`Direct resources/get handler called with URI: ${request.params.uri}`);
    
    // Parse the URI to extract resource type and ID
    const uriParts = request.params.uri.split('://');
    if (uriParts.length !== 2 || uriParts[0] !== 'pipedrive') {
      throw new Error('Invalid URI format. Expected pipedrive://{resource}/{id}');
    }
    
    const pathParts = uriParts[1].split('/');
    const resourceType = pathParts[0];
    const resourceId = pathParts[1];
    
    if (!resourceId) {
      throw new Error('Resource ID is required');
    }
    
    try {
      let result;
      
      switch (resourceType) {
        case 'deals':
          const dealsApi = getApiInstance('DealsApi');
          result = await dealsApi.getDeal(resourceId);
          return {
            resource: {
              uri: request.params.uri,
              contents: [{
                type: "text",
                text: JSON.stringify(result.data, null, 2)
              }]
            }
          };
          
        case 'persons':
          const personsApi = getApiInstance('PersonsApi');
          result = await personsApi.getPerson(resourceId);
          return {
            resource: {
              uri: request.params.uri,
              contents: [{
                type: "text",
                text: JSON.stringify(result.data, null, 2)
              }]
            }
          };
          
        case 'organizations':
          const organizationsApi = getApiInstance('OrganizationsApi');
          result = await organizationsApi.getOrganization(resourceId);
          return {
            resource: {
              uri: request.params.uri,
              contents: [{
                type: "text",
                text: JSON.stringify(result.data, null, 2)
              }]
            }
          };
          
        default:
          throw new Error(`Unsupported resource type: ${resourceType}`);
      }
    } catch (error) {
      logger.error(`Error getting ${resourceType} with ID ${resourceId}: ${error.message}`);
      throw new Error(`Failed to retrieve ${resourceType}: ${error.message}`);
    }
  }
);

// Add resources/list_children handler
const ListChildrenRequestSchema = z.object({
  method: z.literal("resources/list_children"),
  params: z.object({
    uri: z.string()
  })
});

server.server.setRequestHandler(
  ListChildrenRequestSchema,
  async (request) => {
    logger.info(`Direct resources/list_children handler called with URI: ${request.params.uri}`);
    
    // Parse the URI to extract resource type
    const uriParts = request.params.uri.split('://');
    if (uriParts.length !== 2 || uriParts[0] !== 'pipedrive') {
      throw new Error('Invalid URI format. Expected pipedrive://{resource}');
    }
    
    const resourceType = uriParts[1];
    
    try {
      let items = [];
      
      switch (resourceType) {
        case 'deals':
          const dealsApi = getApiInstance('DealsApi');
          const dealsResponse = await dealsApi.getDeals({ limit: 100 });
          logger.info(`Deals response structure: ${JSON.stringify(Object.keys(dealsResponse.data))}`);
          
          // Add more detailed logging
          logger.info(`Deals response data: ${JSON.stringify(dealsResponse.data).substring(0, 500)}...`);
          
          if (dealsResponse.data && dealsResponse.data.data && Array.isArray(dealsResponse.data.data)) {
            items = dealsResponse.data.data.map(deal => ({
              name: deal.title,
              description: `${deal.status} deal worth ${deal.formatted_value || 'unknown value'}`,
              uri: `pipedrive://deals/${deal.id}`
            }));
          } else {
            // Check if the response structure is different than expected
            if (dealsResponse.data && Array.isArray(dealsResponse.data)) {
              // Direct array response
              logger.info(`Using direct array response structure for deals`);
              items = dealsResponse.data.map(deal => ({
                name: deal.title,
                description: `${deal.status} deal worth ${deal.formatted_value || 'unknown value'}`,
                uri: `pipedrive://deals/${deal.id}`
              }));
            } else {
              logger.error(`Unexpected deals response structure: ${JSON.stringify(dealsResponse.data)}`);
              items = [];
            }
          }
          break;
          
        case 'persons':
          const personsApi = getApiInstance('PersonsApi');
          const personsResponse = await personsApi.getPersons({ limit: 100 });
          logger.info(`Persons response structure: ${JSON.stringify(Object.keys(personsResponse.data))}`);
          
          // Add more detailed logging
          logger.info(`Persons response data: ${JSON.stringify(personsResponse.data).substring(0, 500)}...`);
          
          if (personsResponse.data && personsResponse.data.data && Array.isArray(personsResponse.data.data)) {
            items = personsResponse.data.data.map(person => ({
              name: person.name,
              description: person.email && Array.isArray(person.email) && person.email.length > 0 
                ? `Email: ${person.email[0]?.value || 'N/A'}` 
                : 'No email provided',
              uri: `pipedrive://persons/${person.id}`
            }));
          } else {
            // Check if the response structure is different than expected
            if (personsResponse.data && Array.isArray(personsResponse.data)) {
              // Direct array response
              items = personsResponse.data.map(person => ({
                name: person.name,
                description: person.email && Array.isArray(person.email) && person.email.length > 0 
                  ? `Email: ${person.email[0]?.value || 'N/A'}`
                  : person.primary_email ? `Email: ${person.primary_email}` : 'No email provided',
                uri: `pipedrive://persons/${person.id}`
              }));
              logger.info(`Using direct array response structure for persons`);
            } else {
              logger.error(`Unexpected persons response structure: ${JSON.stringify(personsResponse.data)}`);
              items = [];
            }
          }
          break;
          
        case 'organizations':
          const organizationsApi = getApiInstance('OrganizationsApi');
          const orgsResponse = await organizationsApi.getOrganizations({ limit: 100 });
          logger.info(`Organizations response structure: ${JSON.stringify(Object.keys(orgsResponse.data))}`);
          
          // Add more detailed logging
          logger.info(`Organizations response data: ${JSON.stringify(orgsResponse.data).substring(0, 500)}...`);
          
          if (orgsResponse.data && orgsResponse.data.data && Array.isArray(orgsResponse.data.data)) {
            items = orgsResponse.data.data.map(org => ({
              name: org.name,
              description: `${org.open_deals_count || 0} open deals`,
              uri: `pipedrive://organizations/${org.id}`
            }));
          } else {
            // Check if the response structure is different than expected
            if (orgsResponse.data && Array.isArray(orgsResponse.data)) {
              // Direct array response
              items = orgsResponse.data.map(org => ({
                name: org.name,
                description: `${org.open_deals_count || 0} open deals`,
                uri: `pipedrive://organizations/${org.id}`
              }));
              logger.info(`Using direct array response structure for organizations`);
            } else {
              logger.error(`Unexpected organizations response structure: ${JSON.stringify(orgsResponse.data)}`);
              items = [];
            }
          }
          break;
          
        default:
          throw new Error(`Unsupported resource type: ${resourceType}`);
      }
      
      logger.info(`Returning ${items.length} resources for ${resourceType}`);
      return {
        resources: items
      };
    } catch (error) {
      logger.error(`Error listing children for ${resourceType}: ${error.message}`);
      throw new Error(`Failed to list children for ${resourceType}: ${error.message}`);
    }
  }
);

// Register prompts capability
server.server.registerCapabilities({
  prompts: {}
});

// Add a direct handler for prompts/list
server.server.setRequestHandler(
  ListPromptsRequestSchema,
  async () => {
    logger.info("Direct prompts/list handler called");
    return { prompts: [] };
  }
);

// Register resources for Pipedrive data
setupDealsResources(server);
setupPersonsResources(server);
setupOrganizationsResources(server);

// Add tools for Pipedrive operations
setupDealsTools(server);
setupPersonsTools(server);
setupOrganizationsTools(server);
setupActivitiesTools(server);
setupPipelinesTools(server);
setupNotesTools(server);
setupUsersTools(server);

// Start the server with stdio transport
const transport = new StdioServerTransport();
await server.connect(transport);

logger.info("Pipedrive MCP Server started");

// Resource setup functions
function setupDealsResources(server) {
  // Register the resource for individual deals
  server.resource(
    "deals",
    new ResourceTemplate("pipedrive://deals/{id}"),
    async (uri, { id }) => {
      try {
        const dealsApi = getApiInstance('DealsApi');
        
        const response = await dealsApi.getDealsById(id);
        
        if (!response.data) {
          return {
            contents: []
          };
        }
        
        return {
          contents: [{
            uri: uri.href,
            text: JSON.stringify(response.data, null, 2)
          }]
        };
      } catch (error) {
        logger.error(`Error getting deal resource: ${error.message}`);
        return {
          contents: [{
            uri: uri.href,
            text: `Error: ${error.message}`
          }]
        };
      }
    }
  );
  
  // Register a separate resource for listing all deals
  server.resource(
    "deals-list",
    "pipedrive://deals",
    async (uri) => {
      try {
        const dealsApi = getApiInstance('DealsApi');
        
        const response = await dealsApi.getDeals({ limit: 100 });
        
        return {
          contents: [{
            uri: uri.href,
            text: JSON.stringify(response.data, null, 2)
          }]
        };
      } catch (error) {
        logger.error(`Error getting deals list resource: ${error.message}`);
        return {
          contents: [{
            uri: uri.href,
            text: `Error: ${error.message}`
          }]
        };
      }
    }
  );
}

function setupPersonsResources(server) {
  // Register the resource for individual persons
  server.resource(
    "persons",
    new ResourceTemplate("pipedrive://persons/{id}"),
    async (uri, { id }) => {
      try {
        const personsApi = getApiInstance('PersonsApi');
        
        const response = await personsApi.getPersonsById(id);
        
        if (!response.data) {
          return {
            contents: []
          };
        }
        
        return {
          contents: [{
            uri: uri.href,
            text: JSON.stringify(response.data, null, 2)
          }]
        };
      } catch (error) {
        logger.error(`Error getting person resource: ${error.message}`);
        return {
          contents: [{
            uri: uri.href,
            text: `Error: ${error.message}`
          }]
        };
      }
    }
  );
  
  // Register a separate resource for listing all persons
  server.resource(
    "persons-list",
    "pipedrive://persons",
    async (uri) => {
      try {
        const personsApi = getApiInstance('PersonsApi');
        
        const response = await personsApi.getPersons({ limit: 100 });
        
        return {
          contents: [{
            uri: uri.href,
            text: JSON.stringify(response.data, null, 2)
          }]
        };
      } catch (error) {
        logger.error(`Error getting persons list resource: ${error.message}`);
        return {
          contents: [{
            uri: uri.href,
            text: `Error: ${error.message}`
          }]
        };
      }
    }
  );
}

function setupOrganizationsResources(server) {
  // Register the resource for individual organizations
  server.resource(
    "organizations",
    new ResourceTemplate("pipedrive://organizations/{id}"),
    async (uri, { id }) => {
      try {
        const organizationsApi = getApiInstance('OrganizationsApi');
        
        const response = await organizationsApi.getOrganizationsById(id);
        
        if (!response.data) {
          return {
            contents: []
          };
        }
        
        return {
          contents: [{
            uri: uri.href,
            text: JSON.stringify(response.data, null, 2)
          }]
        };
      } catch (error) {
        logger.error(`Error getting organization resource: ${error.message}`);
        return {
          contents: [{
            uri: uri.href,
            text: `Error: ${error.message}`
          }]
        };
      }
    }
  );
  
  // Register a separate resource for listing all organizations
  server.resource(
    "organizations-list",
    "pipedrive://organizations",
    async (uri) => {
      try {
        const organizationsApi = getApiInstance('OrganizationsApi');
        
        const response = await organizationsApi.getOrganizations({ limit: 100 });
        
        return {
          contents: [{
            uri: uri.href,
            text: JSON.stringify(response.data, null, 2)
          }]
        };
      } catch (error) {
        logger.error(`Error getting organizations list resource: ${error.message}`);
        return {
          contents: [{
            uri: uri.href,
            text: `Error: ${error.message}`
          }]
        };
      }
    }
  );
}

// Tool setup functions
function setupDealsTools(server) {
  // Get deals tool
  server.tool(
    "get_deals",
    {
      filter_id: z.number().optional().describe("Filter ID to filter deals"),
      user_id: z.number().optional().describe("User ID to filter deals by owner"),
      stage_id: z.number().optional().describe("Stage ID to filter deals by stage"),
      status: z.enum(["open", "won", "lost"]).optional().describe("Status to filter deals"),
      limit: z.number().optional().default(100).describe("Limit for the number of deals to return")
    },
    async ({ filter_id, user_id, stage_id, status, limit }) => {
      try {
        const dealsApi = getApiInstance('DealsApi');
        
        const opts = {
          limit: limit || 100,
          start: 0,
          ...(filter_id && { filterId: filter_id }),
          ...(user_id && { userId: user_id }),
          ...(stage_id && { stageId: stage_id }),
          ...(status && { status })
        };
        
        const response = await dealsApi.getDeals(opts);
        
        return {
          content: [
            { 
              type: "text", 
              text: JSON.stringify(response.data, null, 2)
            }
          ]
        };
      } catch (error) {
        logger.error(`Error getting deals: ${error.message}`);
        return {
          content: [
            { 
              type: "text", 
              text: `Error getting deals: ${error.message}`
            }
          ]
        };
      }
    }
  );

  // Get deal by ID tool
  server.tool(
    "get_deal",
    {
      deal_id: z.number().describe("The ID of the deal to retrieve")
    },
    async ({ deal_id }) => {
      try {
        const dealsApi = getApiInstance('DealsApi');
        
        const response = await dealsApi.getDealsById(deal_id);
        
        if (!response.data) {
          return {
            content: [
              { 
                type: "text", 
                text: "Deal not found"
              }
            ]
          };
        }
        
        return {
          content: [
            { 
              type: "text", 
              text: JSON.stringify(response.data, null, 2)
            }
          ]
        };
      } catch (error) {
        logger.error(`Error getting deal by ID: ${error.message}`);
        return {
          content: [
            { 
              type: "text", 
              text: `Error getting deal by ID: ${error.message}`
            }
          ]
        };
      }
    }
  );

  // Create deal tool
  server.tool(
    "create_deal",
    {
      title: z.string().describe("The title of the deal"),
      value: z.number().optional().describe("The value of the deal"),
      currency: z.string().optional().describe("The currency of the deal"),
      person_id: z.number().optional().describe("Person ID to associate with the deal"),
      org_id: z.number().optional().describe("Organization ID to associate with the deal"),
      stage_id: z.number().optional().describe("Stage ID for the deal"),
      status: z.enum(["open", "won", "lost"]).optional().describe("Status of the deal")
    },
    async ({ title, value, currency, person_id, org_id, stage_id, status }) => {
      try {
        const dealsApi = getApiInstance('DealsApi');
        
        const dealData = {
          title,
          ...(value && { value }),
          ...(currency && { currency }),
          ...(person_id && { person_id }),
          ...(org_id && { org_id }),
          ...(stage_id && { stage_id }),
          ...(status && { status })
        };
        
        const response = await dealsApi.addDeal(dealData);
        
        return {
          content: [
            { 
              type: "text", 
              text: `Deal created successfully: ${JSON.stringify(response.data, null, 2)}`
            }
          ]
        };
      } catch (error) {
        logger.error(`Error creating deal: ${error.message}`);
        return {
          content: [
            { 
              type: "text", 
              text: `Error creating deal: ${error.message}`
            }
          ]
        };
      }
    }
  );

  // Update deal tool
  server.tool(
    "update_deal",
    {
      deal_id: z.number().describe("The ID of the deal to update"),
      title: z.string().optional().describe("New title for the deal"),
      value: z.number().optional().describe("New value for the deal"),
      currency: z.string().optional().describe("New currency for the deal"),
      person_id: z.number().optional().describe("New person ID to associate with the deal"),
      org_id: z.number().optional().describe("New organization ID to associate with the deal"),
      stage_id: z.number().optional().describe("New stage ID for the deal"),
      status: z.enum(["open", "won", "lost"]).optional().describe("New status for the deal")
    },
    async ({ deal_id, title, value, currency, person_id, org_id, stage_id, status }) => {
      try {
        const dealsApi = getApiInstance('DealsApi');
        
        const dealData = {
          ...(title && { title }),
          ...(value && { value }),
          ...(currency && { currency }),
          ...(person_id && { person_id }),
          ...(org_id && { org_id }),
          ...(stage_id && { stage_id }),
          ...(status && { status })
        };
        
        const response = await dealsApi.updateDeal(deal_id, dealData);
        
        if (!response.data) {
          return {
            content: [
              { 
                type: "text", 
                text: "Deal not found"
              }
            ]
          };
        }
        
        return {
          content: [
            { 
              type: "text", 
              text: `Deal updated successfully: ${JSON.stringify(response.data, null, 2)}`
            }
          ]
        };
      } catch (error) {
        logger.error(`Error updating deal: ${error.message}`);
        return {
          content: [
            { 
              type: "text", 
              text: `Error updating deal: ${error.message}`
            }
          ]
        };
      }
    }
  );
}

function setupPersonsTools(server) {
  // Get persons tool
  server.tool(
    "get_persons",
    {
      filter_id: z.number().optional().describe("Filter ID to filter persons"),
      limit: z.number().optional().default(100).describe("Limit for the number of persons to return")
    },
    async ({ filter_id, limit }) => {
      try {
        const personsApi = getApiInstance('PersonsApi');
        
        const opts = {
          limit: limit || 100,
          start: 0,
          ...(filter_id && { filterId: filter_id })
        };
        
        const response = await personsApi.getPersons(opts);
        
        return {
          content: [
            { 
              type: "text", 
              text: JSON.stringify(response.data, null, 2)
            }
          ]
        };
      } catch (error) {
        logger.error(`Error getting persons: ${error.message}`);
        return {
          content: [
            { 
              type: "text", 
              text: `Error getting persons: ${error.message}`
            }
          ]
        };
      }
    }
  );
  
  // Additional person tools would be implemented here
}

function setupOrganizationsTools(server) {
  // Get organizations tool
  server.tool(
    "get_organizations",
    {
      filter_id: z.number().optional().describe("Filter ID to filter organizations"),
      limit: z.number().optional().default(100).describe("Limit for the number of organizations to return")
    },
    async ({ filter_id, limit }) => {
      try {
        const organizationsApi = getApiInstance('OrganizationsApi');
        
        const opts = {
          limit: limit || 100,
          start: 0,
          ...(filter_id && { filterId: filter_id })
        };
        
        const response = await organizationsApi.getOrganizations(opts);
        
        return {
          content: [
            { 
              type: "text", 
              text: JSON.stringify(response.data, null, 2)
            }
          ]
        };
      } catch (error) {
        logger.error(`Error getting organizations: ${error.message}`);
        return {
          content: [
            { 
              type: "text", 
              text: `Error getting organizations: ${error.message}`
            }
          ]
        };
      }
    }
  );
}

function setupActivitiesTools(server) {
  // Get activities tool
  server.tool(
    "get_activities",
    {
      user_id: z.number().optional().describe("User ID to filter activities by owner"),
      limit: z.number().optional().default(100).describe("Limit for the number of activities to return")
    },
    async ({ user_id, limit }) => {
      try {
        const activitiesApi = getApiInstance('ActivitiesApi');
        
        const opts = {
          limit: limit || 100,
          start: 0,
          ...(user_id && { userId: user_id })
        };
        
        const response = await activitiesApi.getActivities(opts);
        
        return {
          content: [
            { 
              type: "text", 
              text: JSON.stringify(response.data, null, 2)
            }
          ]
        };
      } catch (error) {
        logger.error(`Error getting activities: ${error.message}`);
        return {
          content: [
            { 
              type: "text", 
              text: `Error getting activities: ${error.message}`
            }
          ]
        };
      }
    }
  );
}

function setupPipelinesTools(server) {
  // Get pipelines tool
  server.tool(
    "get_pipelines",
    {},
    async () => {
      try {
        const pipelinesApi = getApiInstance('PipelinesApi');
        
        const response = await pipelinesApi.getPipelines();
        
        return {
          content: [
            { 
              type: "text", 
              text: JSON.stringify(response.data, null, 2)
            }
          ]
        };
      } catch (error) {
        logger.error(`Error getting pipelines: ${error.message}`);
        return {
          content: [
            { 
              type: "text", 
              text: `Error getting pipelines: ${error.message}`
            }
          ]
        };
      }
    }
  );
}

function setupNotesTools(server) {
  // Get notes tool
  server.tool(
    "get_notes",
    {
      deal_id: z.number().optional().describe("Deal ID to filter notes"),
      person_id: z.number().optional().describe("Person ID to filter notes"),
      org_id: z.number().optional().describe("Organization ID to filter notes"),
      limit: z.number().optional().default(100).describe("Limit for the number of notes to return")
    },
    async ({ deal_id, person_id, org_id, limit }) => {
      try {
        const notesApi = getApiInstance('NotesApi');
        
        const opts = {
          limit: limit || 100,
          start: 0,
          ...(deal_id && { dealId: deal_id }),
          ...(person_id && { personId: person_id }),
          ...(org_id && { orgId: org_id })
        };
        
        const response = await notesApi.getNotes(opts);
        
        return {
          content: [
            { 
              type: "text", 
              text: JSON.stringify(response.data, null, 2)
            }
          ]
        };
      } catch (error) {
        logger.error(`Error getting notes: ${error.message}`);
        return {
          content: [
            { 
              type: "text", 
              text: `Error getting notes: ${error.message}`
            }
          ]
        };
      }
    }
  );
}

function setupUsersTools(server) {
  // Get users tool
  server.tool(
    "get_users",
    {},
    async () => {
      try {
        const usersApi = getApiInstance('UsersApi');
        
        const response = await usersApi.getUsers();
        
        return {
          content: [
            { 
              type: "text", 
              text: JSON.stringify(response.data, null, 2)
            }
          ]
        };
      } catch (error) {
        logger.error(`Error getting users: ${error.message}`);
        return {
          content: [
            { 
              type: "text", 
              text: `Error getting users: ${error.message}`
            }
          ]
        };
      }
    }
  );
}

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught exception:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
}); 