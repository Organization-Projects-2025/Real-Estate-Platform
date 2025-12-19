# Real Estate Platform - Microservices Architecture

This is the microservices backend for the Real Estate Platform, built with NestJS.

## Architecture Overview

```
                    ┌─────────────────────────────────────────────────────────┐
                    │                    Frontend (React)                      │
                    │                  http://localhost:5173                   │
                    └─────────────────────────────────────────────────────────┘
                                              │
                                              ▼
                    ┌─────────────────────────────────────────────────────────┐
                    │                     API Gateway                          │
                    │                  http://localhost:3000/api               │
                    └─────────────────────────────────────────────────────────┘
                         │              │              │              │
            ┌────────────┘    ┌────────┘    ┌────────┘    ┌────────┘
            ▼                 ▼             ▼             ▼
    ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐
    │ Auth Service  │ │Property Service│ │ Review Service│ │ Agent Service │
    │   Port 3001   │ │   Port 3002   │ │   Port 3003   │ │   Port 3004   │
    └───────────────┘ └───────────────┘ └───────────────┘ └───────────────┘
            │                 │              │              │
            ▼                 ▼              ▼              ▼
    ┌───────────────────────────────────────────────────────────────────────┐
    │                         MongoDB Databases                              │
    └───────────────────────────────────────────────────────────────────────┘
```

## Microservices

| Service          | Port | Description                           |
|------------------|------|---------------------------------------|
| API Gateway      | 3000 | Routes requests to microservices      |
| Auth Service     | 3001 | User authentication & authorization   |
| Property Service | 3002 | Property CRUD operations              |
| Review Service   | 3003 | Review CRUD operations                |
| Agent Service    | 3004 | Agent CRUD operations                 |

## Prerequisites

- Node.js (v18 or higher)
- MongoDB running locally or connection string
- npm or yarn

## Installation

### Option 1: Install all at once
```bash
cd microservices
npm install
npm run install:all
```

### Option 2: Install individually
```bash
# Install API Gateway
cd api-gateway && npm install

# Install Auth Service
cd auth-service && npm install

# Install Property Service
cd property-service && npm install

# Install Review Service
cd review-service && npm install

# Install Agent Service
cd agent-service && npm install
```

## Running the Services

### Option 1: Run all services with one command
```bash
cd microservices
npm run start:all
```

### Option 2: Run services individually (in separate terminals)
```bash
# Terminal 1 - Auth Service
cd auth-service && npm run start:dev

# Terminal 2 - Property Service
cd property-service && npm run start:dev

# Terminal 3 - Review Service
cd review-service && npm run start:dev

# Terminal 4 - Agent Service
cd agent-service && npm run start:dev

# Terminal 5 - API Gateway (run this AFTER all services are running)
cd api-gateway && npm run start:dev
```

## API Endpoints

All requests go through the API Gateway at `http://localhost:3000/api`

### Auth Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/me` - Update current user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password
- `PUT /api/auth/update-password` - Update password
- `GET /api/auth/users` - Get all users (admin)
- `GET /api/auth/users/:id` - Get user by ID
- `DELETE /api/auth/users/:id` - Delete user

### Property Endpoints
- `GET /api/properties` - Get all properties
- `GET /api/properties/featured` - Get featured properties
- `GET /api/properties/search` - Search properties with filters
- `GET /api/properties/:id` - Get property by ID
- `GET /api/properties/user/:userId` - Get properties by user
- `GET /api/properties/type/:listingType` - Get properties by listing type
- `POST /api/properties` - Create property
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property

### Review Endpoints
- `GET /api/reviews` - Get all reviews
- `GET /api/reviews/random` - Get random reviews
- `GET /api/reviews/:id` - Get review by ID
- `GET /api/reviews/agent/:agentId` - Get reviews by agent
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### Agent Endpoints
- `GET /api/agents` - Get all agents
- `GET /api/agents/:id` - Get agent by ID
- `GET /api/agents/:id/phone` - Get agent phone number
- `GET /api/agents/email/:email` - Get agent by email
- `POST /api/agents` - Create agent
- `PUT /api/agents/:id` - Update agent
- `DELETE /api/agents/:id` - Delete agent

## Environment Variables

Each service has its own `.env` file. Update these with your configuration:

### API Gateway (.env)
```
PORT=3000
AUTH_SERVICE_HOST=127.0.0.1
AUTH_SERVICE_PORT=3001
PROPERTY_SERVICE_HOST=127.0.0.1
PROPERTY_SERVICE_PORT=3002
REVIEW_SERVICE_HOST=127.0.0.1
REVIEW_SERVICE_PORT=3003
AGENT_SERVICE_HOST=127.0.0.1
AGENT_SERVICE_PORT=3004
```

### Auth Service (.env)
```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/real-estate-auth
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
```

### Property Service (.env)
```
PORT=3002
MONGODB_URI=mongodb://localhost:27017/real-estate-property
```

### Review Service (.env)
```
PORT=3003
MONGODB_URI=mongodb://localhost:27017/real-estate-review
```

### Agent Service (.env)
```
PORT=3004
MONGODB_URI=mongodb://localhost:27017/real-estate-agent
```

## Frontend Integration

The frontend should connect to `http://localhost:3000/api` (the API Gateway).

Update the frontend service files to use the new API URL:
```javascript
const API_URL = 'http://localhost:3000/api';
```
