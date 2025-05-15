# EPytodo

A full-stack todo application with a Node.js backend, Next.js frontend, and TypeScript SDK.

## Quick Explanation

EPytodo is a modern todo application with three main components:

1. **Backend API** (Node.js + Express)

   - RESTful API with JWT authentication
   - MySQL database for data storage
   - OpenAPI specification for API documentation
   - Built with rspack for optimal performance

2. **Frontend** (Next.js + React)

   - Modern UI built with Next.js 15.3.2
   - React 19 with TypeScript
   - Radix UI components for accessible design
   - TailwindCSS 4 for styling
   - Drag and drop support with dnd-kit
   - Form handling with react-hook-form and zod

3. **SDK** (TypeScript)
   - Type-safe API client
   - Auto-generated from OpenAPI spec
   - Published as npm package (version 1.1.0)
   - Built with rspack

### Quick Start

```bash
# Using Docker (recommended)
docker compose up
```

The application will be available at:

- Frontend: http://localhost
- Backend API: http://localhost:3000 (internal only)

## Architecture

### Docker Services

The application runs in Docker containers with the following architecture:

1. **MySQL Database** (port 3306, internal)

   - Persistent storage using Docker volume
   - Not exposed to host machine
   - Used by backend and migration services

2. **Migration Service**

   - Runs database migrations
   - Executes after MySQL is healthy
   - Ensures database schema is up to date

3. **Backend API** (port 3000, internal)

   - Express server with JWT authentication
   - Connected to MySQL database
   - Not exposed to host machine by default
   - Health check endpoint for container orchestration

4. **Frontend** (port 80, exposed)
   - Next.js application
   - Exposed to host machine
   - Communicates with backend through Docker network
   - Serves as the main entry point for users

### Network Architecture

```
[Host Machine]
    │
    ├── Frontend (port 80) ─────┐
    │                           │
    └── Backend (port 3000) ──────── MySQL (port 3306)
                                            |
                                        Migration
```

All services communicate through a Docker bridge network (`epytodo-network`), ensuring secure internal communication while only exposing the frontend to the host machine.

## Prerequisites

- Node.js and npm installed
- Docker and Docker Compose installed

## Quick Start with Docker Compose

The easiest way to run the entire application (backend, frontend, and database) is using Docker Compose:

```bash
docker compose up
```

This will start all services in the following order:

1. MySQL database (port 3306)
2. Database migration service
3. Backend API server (port 3000, but not exposed by default exposed)
4. Frontend application (port 80)

### Services Overview

#### MySQL Database

- Version: MySQL 8.0
- Database name: `epytodo`
- Root password: `superstrongpassword`
- User: `epytodo` / Password: `epytodo`
- Data persistence through Docker volume: `mysql_data`

#### Backend API

- Built from `bonus/docker/backend.Dockerfile`
- Exposed on port 3000
- Includes health check endpoint
- Pre-configured admin user:
  - Username: `admin`
  - Password: `admin`

#### Frontend

- Built from `bonus/docker/frontend.Dockerfile`
- Exposed on port 80 (mapped to container port 4000)
- Automatically connects to backend API
- Includes health check

#### Migration Service

- Runs database migrations automatically
- Ensures database schema is up to date
- Runs after MySQL is healthy and before backend starts

### Accessing the Services

Once all services are up and running, you can access:

- Frontend: http://localhost
- Backend API: http://localhost:3000
- MySQL: localhost:3306

### Health Checks

All services include health checks to ensure proper startup order:

- MySQL: Checks database connectivity
- Backend: Verifies API health endpoint
- Frontend: Confirms web server is responding

### Networks

All services are connected through a bridge network `epytodo-network` for secure internal communication.

## Manual Setup

### Setup MySQL

1. Pull the mysql docker image

```bash
docker pull mysql:latest
```

2. Create a docker volume

```bash
docker volume create mysql-data
```

3. Start the docker container

```bash
docker run --name mysql-container \
-e MYSQL_ROOT_PASSWORD=password \
 -v mysql-data:/var/lib/mysql \
 -p 3306:3306 \
 -d mysql:latest
```

4. Start a shell in the docker

```bash
docker exec -it mysql-container mysql -u root -p
```

5. Create the database and the appropriate user

```sql
CREATE DATABASE epytodo;
CREATE USER 'epytodo'@'%' IDENTIFIED BY 'superstrongpassword';
GRANT ALL PRIVILEGES ON epytodo.* TO 'epytodo'@'%';
```

## Installation

1. Clone the repository:

```bash
git clone https://github.com/thebackslashs/epytodo.git
cd epytodo
```

2. Install dependencies:

```bash
npm install
```

3. Create a .env file in the root directory and configure your environment variables.

```bash
MYSQL_DATABASE=
MYSQL_HOST=
MYSQL_USER=
MYSQL_ROOT_PASSWORD=
PORT=
SECRET=
ADMIN_USERNAME=
ADMIN_HASH_PASSWORD=
```

4. Run database migration

```bash
npm run migrate
```

## Get Started

```bash
npm run start:dev
```

## Build

```bash
npm run build
```

## Bonus Components

### Frontend

The frontend is a Next.js application located in the `bonus/frontend` directory. It provides a modern user interface for the todo application.

To run the frontend separately:

```bash
cd bonus/frontend
pnpm install
pnpm run dev
```

Key features:

- Next.js 15.3.2 with Turbopack
- React 19 with TypeScript
- Radix UI component library
- TailwindCSS 4 for styling
- Drag and drop functionality
- Form validation with Zod
- Dark mode support

### SDK

The project includes a TypeScript SDK (`bonus/sdk`) that provides type-safe access to the API. The SDK is automatically generated from the OpenAPI specification.

To use the SDK:

```bash
cd bonus/sdk
pnpm install
pnpm run generate  # Generates SDK from OpenAPI spec
pnpm run build     # Builds the SDK
```

The SDK can be published to npm and used in other projects:

```bash
pnpm publish
```

## Development

### Backend Development

The backend API is built with Express and includes:

- JWT authentication
- MySQL database integration
- OpenAPI specification
- TypeScript support

### Frontend Development

The frontend is built with:

- Next.js 15.3.2
- React 19
- TypeScript
- Radix UI components
- TailwindCSS 4
- Various React hooks and utilities

### SDK Development

The SDK is built with:

- TypeScript
- OpenAPI TypeScript Codegen
- ESLint and Prettier for code quality
- Rspack for building

## License

This project is licensed under the ISC License.

```
ISC License

Copyright (c) 2024, Ely Delva and Dimitri Collineau

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
```

### License Files

- Backend: `LICENSE` (ISC)
- Frontend: `bonus/frontend/LICENSE` (ISC)
- SDK: `bonus/sdk/LICENSE` (ISC)
