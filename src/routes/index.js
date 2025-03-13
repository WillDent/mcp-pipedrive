const express = require('express');
const dealsRoutes = require('./deals');
const personsRoutes = require('./persons');
const organizationsRoutes = require('./organizations');
const activitiesRoutes = require('./activities');
const pipelinesRoutes = require('./pipelines');
const notesRoutes = require('./notes');
const usersRoutes = require('./users');

const router = express.Router();

// MCP specific endpoint for listing available tools
router.get('/tools', (req, res) => {
  res.json({
    tools: [
      {
        name: 'pipedrive',
        description: 'Pipedrive CRM API integration',
        methods: [
          {
            name: 'get_deals',
            description: 'Get deals from Pipedrive',
            parameters: {
              filter_id: 'Optional filter ID to filter deals',
              user_id: 'Optional user ID to filter deals by owner',
              stage_id: 'Optional stage ID to filter deals by stage',
              status: 'Optional status to filter deals (open, won, lost)',
              limit: 'Optional limit for the number of deals to return'
            }
          },
          {
            name: 'get_deal',
            description: 'Get a specific deal by ID',
            parameters: {
              deal_id: 'The ID of the deal to retrieve'
            }
          },
          {
            name: 'create_deal',
            description: 'Create a new deal',
            parameters: {
              title: 'The title of the deal',
              value: 'The value of the deal',
              currency: 'The currency of the deal',
              person_id: 'Optional person ID to associate with the deal',
              org_id: 'Optional organization ID to associate with the deal',
              stage_id: 'Optional stage ID for the deal',
              status: 'Optional status of the deal (open, won, lost)'
            }
          },
          {
            name: 'update_deal',
            description: 'Update an existing deal',
            parameters: {
              deal_id: 'The ID of the deal to update',
              title: 'Optional new title for the deal',
              value: 'Optional new value for the deal',
              currency: 'Optional new currency for the deal',
              person_id: 'Optional new person ID to associate with the deal',
              org_id: 'Optional new organization ID to associate with the deal',
              stage_id: 'Optional new stage ID for the deal',
              status: 'Optional new status for the deal (open, won, lost)'
            }
          },
          {
            name: 'get_persons',
            description: 'Get persons from Pipedrive',
            parameters: {
              filter_id: 'Optional filter ID to filter persons',
              limit: 'Optional limit for the number of persons to return'
            }
          },
          {
            name: 'get_organizations',
            description: 'Get organizations from Pipedrive',
            parameters: {
              filter_id: 'Optional filter ID to filter organizations',
              limit: 'Optional limit for the number of organizations to return'
            }
          },
          {
            name: 'get_activities',
            description: 'Get activities from Pipedrive',
            parameters: {
              user_id: 'Optional user ID to filter activities by owner',
              limit: 'Optional limit for the number of activities to return'
            }
          },
          {
            name: 'get_pipelines',
            description: 'Get pipelines from Pipedrive',
            parameters: {}
          }
        ]
      }
    ]
  });
});

// Register routes
router.use('/deals', dealsRoutes);
router.use('/persons', personsRoutes);
router.use('/organizations', organizationsRoutes);
router.use('/activities', activitiesRoutes);
router.use('/pipelines', pipelinesRoutes);
router.use('/notes', notesRoutes);
router.use('/users', usersRoutes);

module.exports = router; 