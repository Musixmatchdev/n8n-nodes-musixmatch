## Project Overview

This is an n8n community node package for integrating the Musixmatch API with n8n workflows. It's built using the n8n-node-cli toolchain and follows n8n's community node standards.

## Development Commands

### Building
```bash
npm run build          # Compile TypeScript to dist/
npm run build:watch    # Compile with watch mode (uses tsc --watch)
```

### Development
```bash
npm run dev           # Run in development mode with n8n-node-cli
```

### Linting
```bash
npm run lint          # Check for linting errors
npm run lint:fix      # Automatically fix linting errors
```

### Release
```bash
npm run release       # Create a new release (uses release-it)
npm run prepublishOnly # Pre-release checks (automatically runs before publishing)
```

## Architecture

### Node Structure

The project follows n8n's community node architecture:

- **nodes/Musixmatch/Musixmatch.node.ts** - Main node implementation
  - Implements `INodeType` interface from n8n-workflow
  - Contains node description (properties, inputs/outputs, display configuration)
  - `execute()` method processes workflow items
  - Error handling uses `NodeOperationError` and respects `continueOnFail` setting
  - Currently implements a simple string parameter demonstration

- **nodes/Musixmatch/Musixmatch.node.json** - Node metadata
  - Defines node categories (Development, Developer Tools)
  - Contains documentation URLs and resource links

### Build Output

- TypeScript compiles to CommonJS in `dist/` directory
- The package publishes only the `dist/` folder (see package.json `files` array)
- n8n loads the compiled node from `dist/nodes/Musixmatch/Musixmatch.node.js`

### TypeScript Configuration

- Target: ES2019 with CommonJS modules
- Strict mode enabled with full type checking
- Includes nodes, credentials, and package.json in compilation
- Source maps and declarations generated for debugging

## Code Style

### Formatting (Prettier)
- Uses tabs (width: 2) for indentation
- Single quotes for strings
- Semicolons required
- Trailing commas in all multi-line structures
- Line width: 100 characters
- Arrow function parentheses: always

### Linting
- Uses @n8n/node-cli eslint configuration
- Configuration in eslint.config.mjs

## Node Development Guidelines

### Adding Node Properties
Node properties are defined in the `description.properties` array. Each property represents a user-configurable field in the n8n UI.

### Implementing Operations
The `execute()` method:
1. Receives input data via `this.getInputData()`
2. Iterates over items (workflows can process multiple items in a batch)
3. Retrieves parameters using `this.getNodeParameter(propertyName, itemIndex)`
4. Must handle errors appropriately (respect `continueOnFail()` setting)
5. Returns array of arrays: `INodeExecutionData[][]`

### Error Handling Pattern
```typescript
try {
  // Node logic
} catch (error) {
  if (this.continueOnFail()) {
    items.push({ json: this.getInputData(itemIndex)[0].json, error, pairedItem: itemIndex });
  } else {
    throw new NodeOperationError(this.getNode(), error, { itemIndex });
  }
}
```

## n8n Integration

- Node uses n8n API version 1 (`n8nNodesApiVersion: 1`)
- Strict mode enabled in package.json n8n config
- Node is usable as a tool in AI Agent workflows (`usableAsTool: true`)
- Connections: Accepts and outputs Main connection type

## Node Version

Currently requires Node.js v22.15.1 (see .nvmrc)
