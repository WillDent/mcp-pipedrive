# Pipedrive MCP Server

A Model Context Protocol (MCP) server that connects to Pipedrive CRM using the official Pipedrive API v2 Node.js client. This server allows AI assistants like Claude, Cursor, or Windsurf to interact with your Pipedrive data through the MCP protocol.

## Features

- Full integration with Pipedrive API v2
- MCP-compatible tools for interacting with Pipedrive data
- MCP-compatible resources for accessing Pipedrive data
- Comprehensive error handling and logging

## Prerequisites

- Node.js 16.x or higher
- npm or yarn
- Pipedrive account with API token

## Installation

1. Clone this repository:
   ```
   git clone <repository-url>
   cd pipedrive-mcp-server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   # Pipedrive API Configuration
   PIPEDRIVE_API_TOKEN=your_pipedrive_api_token

   # Optional: For production deployments
   NODE_ENV=development
   # NODE_ENV=production

   # Optional: For logging
   LOG_LEVEL=info
   ```

4. Start the server:
   ```
   npm start
   ```

   For development with auto-restart:
   ```
   npm run dev
   ```

## MCP Tools

This server exposes the following MCP tools:

- **Deals**
  - `get_deals` - Get deals from Pipedrive
  - `get_deal` - Get a specific deal by ID
  - `create_deal` - Create a new deal
  - `update_deal` - Update an existing deal

- **Persons**
  - `get_persons` - Get persons from Pipedrive
  - `get_person` - Get a specific person by ID
  - `create_person` - Create a new person
  - `update_person` - Update an existing person

- **Organizations**
  - `get_organizations` - Get organizations from Pipedrive
  - `get_organization` - Get a specific organization by ID
  - `create_organization` - Create a new organization
  - `update_organization` - Update an existing organization

- **Activities**
  - `get_activities` - Get activities from Pipedrive
  - `get_activity` - Get a specific activity by ID
  - `create_activity` - Create a new activity
  - `update_activity` - Update an existing activity

- **Pipelines**
  - `get_pipelines` - Get pipelines from Pipedrive
  - `get_pipeline` - Get a specific pipeline by ID

- **Notes**
  - `get_notes` - Get notes from Pipedrive
  - `get_note` - Get a specific note by ID
  - `create_note` - Create a new note
  - `update_note` - Update an existing note

- **Users**
  - `get_users` - Get users from Pipedrive
  - `get_user` - Get a specific user by ID
  - `get_current_user` - Get current user

## MCP Resources

This server exposes the following MCP resources:

- **Deals**: `pipedrive://deals/{id?}`
- **Persons**: `pipedrive://persons/{id?}`
- **Organizations**: `pipedrive://organizations/{id?}`

## Connecting with Claude

To connect Claude to this MCP server:

1. Start the MCP server:
   ```
   npm start
   ```

2. In Claude, use the `/mcp` command to connect to your server:
   ```
   /mcp connect <path-to-your-server-directory>
   ```

3. Once connected, you can use the tools and resources provided by the server:
   ```
   /mcp tool get_deals
   /mcp resource pipedrive://deals
   ```

4. You can also ask Claude to perform actions using natural language:
   ```
   Can you show me my recent deals in Pipedrive?
   ```

## Connecting with Cursor

To connect Cursor to this MCP server:

1. Start the MCP server:
   ```
   npm start
   ```

2. In Cursor, you can connect to the MCP server using the MCP integration feature.
   
3. Once connected, you can use the Pipedrive tools directly in your coding workflow.

## Connecting with Windsurf

To connect Windsurf to this MCP server:

1. Start the MCP server:
   ```
   npm start
   ```

2. In Windsurf, follow their specific instructions for connecting to an MCP server.

3. Once connected, you can use the Pipedrive tools in your Windsurf environment.

## Example Usage

Once connected, you can use the Pipedrive tools in your AI assistant. For example:

```
Can you get a list of my recent deals in Pipedrive?
```

The AI assistant will use the appropriate tool to fetch the data from Pipedrive through the MCP server.

## Security Considerations

- Keep your Pipedrive API token secure
- The MCP server has access to your Pipedrive account, so be careful about who can access it
- Consider implementing additional authentication if needed

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.