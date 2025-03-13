# Pipedrive MCP Server

A Model Context Protocol (MCP) server that connects to Pipedrive CRM using the official Pipedrive API v2 Node.js client. This server allows AI assistants like Claude, Cursor, or other MCP-compatible clients to interact with your Pipedrive data through the MCP protocol.

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

## Connecting to the MCP Server

This MCP server uses the `StdioServerTransport` from the MCP SDK, which means it communicates via standard input/output (stdin/stdout). The server requires the Pipedrive API token to be available as an environment variable named `PIPEDRIVE_API_TOKEN`.

### Using the Server with Claude Desktop

To connect Claude Desktop to this MCP server:

1. Create a `claude_desktop_config.json` file in the appropriate location:
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
   - Linux: `~/.config/Claude/claude_desktop_config.json`

2. Add the following configuration (replace paths with your actual paths):
   ```json
   {
     "mcpServers": {
       "pipedrive": {
         "command": "node",
         "args": ["/absolute/path/to/pipedrive-mcp-server/src/index.js"],
         "cwd": "/absolute/path/to/pipedrive-mcp-server",
         "env": {
           "PIPEDRIVE_API_TOKEN": "your_api_token_here"
         }
       }
     }
   }
   ```

   **Important**: The server requires the API token to be passed as an environment variable named `PIPEDRIVE_API_TOKEN`. In Claude Desktop, this is done using the `env` property in the configuration as shown above.

   **Security Note**: 
   - Storing API keys directly in this file is convenient but not secure for shared environments.
   - For better security, consider using a secure credential manager and only accessing the configuration file from trusted devices.

3. Restart Claude Desktop to load the configuration.

4. Click on the plugin icon in Claude Desktop to verify the Pipedrive server is connected.

### Using the Server with npx and JSON Configuration

For quick usage or in environments where you prefer not to set environment variables, you can use the `npx` command with a JSON configuration string:

1. First, publish your server to npm or make it available in a registry.

2. Then, you can run it using one of these approaches:

   Direct npx with config parameter:
   ```bash
   npx -y @your-org/pipedrive-mcp-server@latest --config "{\"pipedriveApiToken\":\"your_api_token_here\"}"
   ```

   Or using the Smithery CLI pattern:
   ```bash
   npx -y @smithery/cli@latest run @your-org/pipedrive-mcp-server --config "{\"pipedriveApiToken\":\"your_api_token_here\"}"
   ```

3. To use these approaches with Claude Desktop, update your `claude_desktop_config.json`:

   Using direct npx:
   ```json
   {
     "mcpServers": {
       "pipedrive": {
         "command": "npx",
         "args": [
           "-y", 
           "@your-org/pipedrive-mcp-server@latest", 
           "--config", 
           "{\"pipedriveApiToken\":\"your_api_token_here\"}"
         ]
       }
     }
   }
   ```

   Or using the Smithery CLI pattern:
   ```json
   {
     "mcpServers": {
       "pipedrive": {
         "command": "npx",
         "args": [
           "-y", 
           "@smithery/cli@latest", 
           "run", 
           "@your-org/pipedrive-mcp-server", 
           "--config", 
           "{\"pipedriveApiToken\":\"your_api_token_here\"}"
         ]
       }
     }
   }
   ```

**Note**: To implement this approach, you'll need to modify your server code to accept and parse the `--config` argument. Here's a simple example of how to do this:

```javascript
// Add this to your server initialization code
const configArgIndex = process.argv.indexOf('--config');
if (configArgIndex > -1 && configArgIndex < process.argv.length - 1) {
  try {
    const config = JSON.parse(process.argv[configArgIndex + 1]);
    if (config.pipedriveApiToken) {
      process.env.PIPEDRIVE_API_TOKEN = config.pipedriveApiToken;
    }
  } catch (error) {
    console.error('Error parsing config:', error);
  }
}
```

### Using the Server with Claude Web

To connect Claude Web to this MCP server:

1. First, ensure your API token is available as an environment variable:
   ```bash
   # Set the environment variable
   export PIPEDRIVE_API_TOKEN=your_api_token_here
   
   # Then start the server
   npm start
   ```

2. In Claude Web, use the `/mcp` command to connect to the server:
   ```
   /mcp connect <command>
   ```
   
   Where `<command>` is the command to start the server. For example:
   ```
   /mcp connect node /path/to/pipedrive-mcp-server/src/index.js
   ```

   Or using the direct npx approach:
   ```
   /mcp connect npx -y @your-org/pipedrive-mcp-server@latest --config "{\"pipedriveApiToken\":\"your_api_token_here\"}"
   ```

   Or using the Smithery CLI pattern:
   ```
   /mcp connect npx -y @smithery/cli@latest run @your-org/pipedrive-mcp-server --config "{\"pipedriveApiToken\":\"your_api_token_here\"}"
   ```

3. Once connected, you can use the tools and resources provided by the server:
   ```
   /mcp tool get_deals
   /mcp resource pipedrive://deals
   ```

### Using the Server with Cursor

To connect Cursor to this MCP server:

1. In Cursor, open the command palette (Cmd+Shift+P or Ctrl+Shift+P).

2. Select "Connect to MCP Server".

3. Enter the command to start the server, using one of these approaches:

   Using environment variables:
   ```
   PIPEDRIVE_API_TOKEN=your_api_token_here node /path/to/pipedrive-mcp-server/src/index.js
   ```

   Or using the direct npx approach:
   ```
   npx -y @your-org/pipedrive-mcp-server@latest --config "{\"pipedriveApiToken\":\"your_api_token_here\"}"
   ```
   
   Or using the Smithery CLI pattern:
   ```
   npx -y @smithery/cli@latest run @your-org/pipedrive-mcp-server --config "{\"pipedriveApiToken\":\"your_api_token_here\"}"
   ```

4. Once connected, you can use the Pipedrive tools directly in your coding workflow.

### Using the Server with Other MCP Clients

For other MCP clients that support stdin/stdout communication:

1. Start the server using one of these approaches:

   Using environment variables:
   ```bash
   PIPEDRIVE_API_TOKEN=your_api_token_here node /path/to/pipedrive-mcp-server/src/index.js
   ```

   Or using the direct npx approach:
   ```bash
   npx -y @your-org/pipedrive-mcp-server@latest --config "{\"pipedriveApiToken\":\"your_api_token_here\"}"
   ```
   
   Or using the Smithery CLI pattern:
   ```bash
   npx -y @smithery/cli@latest run @your-org/pipedrive-mcp-server --config "{\"pipedriveApiToken\":\"your_api_token_here\"}"
   ```

2. Configure your MCP client to communicate with the server via stdin/stdout.

### Using the Server Programmatically

You can also use the server programmatically by piping JSON-RPC requests to it:

Using environment variables:
```bash
# Set the API token as an environment variable
PIPEDRIVE_API_TOKEN=your_api_token_here echo '{"jsonrpc":"2.0","id":1,"method":"resources/list_children","params":{"uri":"pipedrive://organizations"}}' | node src/index.js
```

Or using the direct npx approach:
```bash
echo '{"jsonrpc":"2.0","id":1,"method":"resources/list_children","params":{"uri":"pipedrive://organizations"}}' | npx -y @your-org/pipedrive-mcp-server@latest --config "{\"pipedriveApiToken\":\"your_api_token_here\"}"
```

Or using the Smithery CLI pattern:
```bash
echo '{"jsonrpc":"2.0","id":1,"method":"resources/list_children","params":{"uri":"pipedrive://organizations"}}' | npx -y @smithery/cli@latest run @your-org/pipedrive-mcp-server --config "{\"pipedriveApiToken\":\"your_api_token_here\"}"
```

This will return a JSON-RPC response with the requested resources.

### Using the MCP Inspector for Testing

The MCP Inspector is a useful tool for testing your server:

1. Install the MCP Inspector:
   ```
   npm install -g @modelcontextprotocol/inspector
   ```

2. Run the inspector with your server, using one of these approaches:

   Using environment variables:
   ```
   PIPEDRIVE_API_TOKEN=your_api_token_here mcp-inspector node /path/to/pipedrive-mcp-server/src/index.js
   ```

   Or using the direct npx approach:
   ```
   mcp-inspector npx -y @your-org/pipedrive-mcp-server@latest --config "{\"pipedriveApiToken\":\"your_api_token_here\"}"
   ```
   
   Or using the Smithery CLI pattern:
   ```
   mcp-inspector npx -y @smithery/cli@latest run @your-org/pipedrive-mcp-server --config "{\"pipedriveApiToken\":\"your_api_token_here\"}"
   ```

3. The inspector provides a web interface to test your server's tools and resources.

## Example Usage

Once connected, you can use the Pipedrive tools in your AI assistant. For example:

```
Can you get a list of my recent deals in Pipedrive?
```

The AI assistant will use the appropriate tool to fetch the data from Pipedrive through the MCP server.

## Troubleshooting

### JSON Parsing Errors

If you encounter JSON parsing errors when using the server, ensure that:

1. No additional output is being sent to stdout that could interfere with the JSON-RPC messages.
2. All logging is properly directed to stderr instead of stdout.
3. The server is properly handling the JSON-RPC protocol.

### Connection Issues

If you have trouble connecting to the server:

1. Ensure the server is running and not throwing any errors.
2. Check that your Pipedrive API token is valid and has the necessary permissions.
3. Verify that the MCP client is correctly configured to communicate with the server.

## Publishing to npm

To make your server available via npx, you'll need to publish it to npm:

1. Update the package.json file with your information:
   - Change the `name` field to your preferred package name (e.g., `@your-org/pipedrive-mcp-server`)
   - Update the `author`, `repository`, `bugs`, and `homepage` fields
   - Adjust the version number as needed

2. Make sure your code is ready for publishing:
   - Test your server thoroughly
   - Ensure all dependencies are correctly listed
   - Check that the shebang line is present at the top of `src/index.js`

3. Login to npm:
   ```bash
   npm login
   ```

4. Publish your package:
   ```bash
   npm publish
   ```

   If you're using a scoped package (e.g., `@your-org/pipedrive-mcp-server`), you'll need to specify that it's public:
   ```bash
   npm publish --access=public
   ```

5. Once published, users can run your server using npx with either of these approaches:

   Direct npx approach:
   ```bash
   npx -y @your-org/pipedrive-mcp-server@latest --config "{\"pipedriveApiToken\":\"your_api_token_here\"}"
   ```

   Smithery CLI pattern:
   ```bash
   npx -y @smithery/cli@latest run @your-org/pipedrive-mcp-server --config "{\"pipedriveApiToken\":\"your_api_token_here\"}"
   ```

### Using with Smithery CLI

The Smithery CLI pattern offers several advantages:

1. **Consistent Interface**: It provides a standardized way to run MCP servers and other tools.

2. **Version Management**: The Smithery CLI can help manage different versions of your server.

3. **Additional Features**: The Smithery CLI may offer additional features like logging, caching, and more.

To make your server compatible with the Smithery CLI:

1. Ensure your server properly handles the `--config` parameter as shown in the code example above.

2. Consider adding Smithery-specific metadata to your package.json:
   ```json
   "smithery": {
     "type": "mcp-server",
     "configSchema": {
       "pipedriveApiToken": {
         "type": "string",
         "description": "Your Pipedrive API token"
       }
     }
   }
   ```

3. Test your server with the Smithery CLI before publishing:
   ```bash
   npx -y @smithery/cli@latest run ./src/index.js --config "{\"pipedriveApiToken\":\"your_api_token_here\"}"
   ```

## Security Considerations

- Keep your Pipedrive API token secure
- The MCP server has access to your Pipedrive account, so be careful about who can access it
- Consider implementing additional authentication if needed
- When using the JSON configuration approach, be aware that command-line arguments may be visible in process listings

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.