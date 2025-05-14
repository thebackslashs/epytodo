# EpyTodo API Documentation

This directory contains the auto-generated API documentation for the EpyTodo application. The documentation is generated from an OpenAPI specification and is presented in a user-friendly HTML format using ReDoc.

## Contents

- `index.html`: The main documentation file that contains all API endpoints, request/response schemas, and examples.

## How to Use

1. Open `index.html` in any modern web browser to view the API documentation
2. The documentation provides:
   - Detailed information about all available API endpoints
   - Request and response schemas
   - Authentication requirements
   - Example requests and responses
   - Interactive API testing capabilities

## Features

- Interactive documentation with collapsible sections
- Request/response examples
- Schema definitions
- Authentication details
- Search functionality
- Mobile-responsive design

## Technical Details

The documentation is generated using ReDoc (version 2.5.0), which is a popular OpenAPI/Swagger-generated API Reference Documentation tool. The documentation is static HTML, meaning it can be hosted anywhere and doesn't require a server to run.

## Updating the Documentation

If you need to update the API documentation:

1. Update the OpenAPI specification file
2. Regenerate the documentation using ReDoc

```bash
npx @redocly/cli build-docs specs.openapi.yaml
```

3. Replace the existing `index.html` file with the newly generated one

## Note

This documentation is automatically generated and should not be edited manually. Any changes to the API should be made in the OpenAPI specification file and then regenerated.

```

```
