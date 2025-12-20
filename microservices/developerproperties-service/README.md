# Developer Properties Microservice

This microservice manages developers and their properties in the real estate platform.

## Features

- Developer CRUD operations
- Developer Property CRUD operations
- Get properties by developer

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=3006
MONGODB_URI=mongodb://localhost:27017/developerproperties
```

## Running the Service

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

## API Endpoints (via API Gateway)

### Developers
- POST `/api/developers` - Create a new developer
- GET `/api/developers` - Get all developers
- GET `/api/developers/:id` - Get developer by ID
- PUT `/api/developers/:id` - Update developer
- DELETE `/api/developers/:id` - Delete developer

### Developer Properties
- POST `/api/developer-properties` - Create a new property
- GET `/api/developer-properties` - Get all properties
- GET `/api/developer-properties/:id` - Get property by ID
- PUT `/api/developer-properties/:id` - Update property
- DELETE `/api/developer-properties/:id` - Delete property
- GET `/api/developer-properties/developer/:developerId` - Get properties by developer

## Port

Default port: 3006
