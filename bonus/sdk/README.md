# Epytodo SDK

A TypeScript SDK for interacting with the Epytodo backend API. This SDK is automatically generated from the OpenAPI specification and provides type-safe methods to interact with the Epytodo backend.

## Features

- Full TypeScript support with type definitions
- Automatically generated from OpenAPI specification
- Easy-to-use API client for Epytodo backend
- Built-in error handling and request cancellation support

## Installation

```bash
npm install epytodo-sdk
# or
yarn add epytodo-sdk
# or
pnpm add epytodo-sdk
```

## Usage

```typescript
import { DefaultService, OpenAPI } from 'epytodo-sdk';

// Configure the base URL for the API
OpenAPI.BASE = 'http://localhost:3000';

// Example: Login
const login = async () => {
  try {
    const response = await DefaultService.login({
      email: 'user@example.com',
      password: 'password123',
    });
    console.log('Login successful:', response);
  } catch (error) {
    console.error('Login failed:', error);
  }
};

// Example: Get todos
const getTodos = async () => {
  try {
    const todos = await DefaultService.getTodos();
    console.log('Todos:', todos);
  } catch (error) {
    console.error('Failed to fetch todos:', error);
  }
};
```

## Available Models

The SDK includes the following TypeScript interfaces and types:

- `User` - User information
- `Todo` - Todo item structure
- `Token` - Authentication token
- `Message` - API response messages

## Development

### Prerequisites

- Node.js
- pnpm (recommended) or npm

### Setup

1. Install dependencies:

```bash
pnpm install
```

2. Generate SDK from OpenAPI specification:

```bash
pnpm run generate
```

3. Build the SDK:

```bash
pnpm run build
```

### Scripts

- `pnpm run generate` - Generates the SDK from the OpenAPI specification
- `pnpm run build` - Builds the TypeScript code
- `pnpm run prepare` - Runs the build script (automatically runs on install)

## License

ISC

## Authors

- Ely Delva
- Dimitri Collineau
