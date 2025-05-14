# EpyTodo API Documentation

This directory contains the OpenAPI (formerly Swagger) specification for the EpyTodo API. The specification defines the RESTful API endpoints, request/response schemas, and authentication requirements for the EpyTodo application.

## 📋 Specification File

- `specs.openapi.yaml`: The main OpenAPI specification file that defines the API structure

## 🔑 API Overview

The EpyTodo API provides endpoints for:

- User authentication (register/login)
- User profile management
- Todo CRUD operations

### Authentication

The API uses JWT (JSON Web Token) Bearer authentication. All protected endpoints require a valid JWT token in the Authorization header.

### Base URL

```
http://localhost:3000
```

## 🛠️ Available Endpoints

### Authentication

- `POST /register` - Register a new user
- `POST /login` - Login and get JWT token

### User

- `GET /user` - Get logged-in user's information

### Todos

- `GET /todos` - Get all todos
- `GET /todos/{id}` - Get a specific todo by ID

## 📦 Data Models

### User

```yaml
id: integer
email: string
password: string
firstname: string
name: string
created_at: string (date-time)
```

### Todo

```yaml
id: integer
title: string
description: string
created_at: string (date-time)
due_time: string (date-time)
user_id: integer
status: string (enum: ['not started', 'todo', 'in progress', 'done'])
```

## 🔧 Using the Specification

### Viewing the Documentation

You can view the API documentation using tools like:

- [Swagger UI](https://swagger.io/tools/swagger-ui/)
- [Redoc](https://github.com/Redocly/redoc)
- [OpenAPI GUI](https://mermade.github.io/openapi-gui/)

### Generating Client Code

The OpenAPI specification can be used to generate client code for various programming languages using tools like:

- [OpenAPI Generator](https://openapi-generator.tech/)
- [Swagger Codegen](https://swagger.io/tools/swagger-codegen/)

## 📝 Error Responses

The API uses standard HTTP status codes and returns error messages in the following format:

```json
{
  "msg": "Error message"
}
```

Common error codes:

- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

## 🤝 Contributing

When making changes to the API:

1. Update the OpenAPI specification
2. Ensure all endpoints are properly documented
3. Include example requests and responses
4. Update this README if necessary
