# Real Estate Platform - Developer Properties Feature

## Project Structure
```
Real-Estate-Platform/
├── client/                          # React Frontend (Port 5173)
├── server/                          # Main Server (Port varies)
├── microservices/                   # Microservices Architecture
│   ├── api-gateway/                 # API Gateway (Port 3000)
│   ├── auth-service/                # Authentication (Port 3001)
│   ├── property-service/            # Properties (Port 3002)
│   ├── review-service/              # Reviews (Port 3003)
│   ├── agent-service/               # Agents (Port 3004)
│   └── developerproperties-service/ # Developer Properties (Port 3006)
└── docs/                           # Documentation
```

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (running on localhost:27017)
- npm or yarn

## Installation & Setup

### 1. Install Dependencies

#### Frontend (React)
```bash
cd client
npm install
```

#### Microservices (All at once)
```bash
cd microservices
npm install
npm run install:all
```

#### Or install individually:
```bash
# API Gateway
cd microservices/api-gateway
npm install

# Auth Service
cd microservices/auth-service
npm install

# Property Service
cd microservices/property-service
npm install

# Review Service
cd microservices/review-service
npm install

# Agent Service
cd microservices/agent-service
npm install

# Developer Properties Service
cd microservices/developerproperties-service
npm install
```

### 2. Environment Configuration

Create `.env` files in each microservice directory:

#### API Gateway (.env)
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
DEVELOPERPROPERTIES_SERVICE_HOST=127.0.0.1
DEVELOPERPROPERTIES_SERVICE_PORT=3006
```

#### Auth Service (.env)
```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/real-estate-auth
JWT_SECRET=your-jwt-secret-key
```

#### Property Service (.env)
```
PORT=3002
MONGODB_URI=mongodb://localhost:27017/real-estate-property
```

#### Review Service (.env)
```
PORT=3003
MONGODB_URI=mongodb://localhost:27017/real-estate-review
```

#### Agent Service (.env)
```
PORT=3004
MONGODB_URI=mongodb://localhost:27017/real-estate-agent
```

#### Developer Properties Service (.env)
```
PORT=3006
MONGODB_URI=mongodb://localhost:27017/developerproperties
```

### 3. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# Windows (if installed as service)
net start MongoDB

# macOS (with Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

## Running the Project

### Option 1: Start All Services at Once
```bash
cd microservices
npm run start:all
```

### Option 2: Start Services Individually

#### Terminal 1 - API Gateway
```bash
cd microservices/api-gateway
npm run start:dev
```

#### Terminal 2 - Auth Service
```bash
cd microservices/auth-service
npm run start:dev
```

#### Terminal 3 - Property Service
```bash
cd microservices/property-service
npm run start:dev
```

#### Terminal 4 - Review Service
```bash
cd microservices/review-service
npm run start:dev
```

#### Terminal 5 - Agent Service
```bash
cd microservices/agent-service
npm run start:dev
```

#### Terminal 6 - Developer Properties Service
```bash
cd microservices/developerproperties-service
npm run start:dev
```

#### Terminal 7 - Frontend
```bash
cd client
npm run dev
```

## Access Points

- **Frontend**: http://localhost:5173
- **API Gateway**: http://localhost:3000/api
- **Developer Properties API**: http://localhost:3000/api/developers
- **Developer Properties Management**: http://localhost:5173/manage-developer-properties

## New Features Added

### Frontend Pages:
1. **Properties by Developers** (`/developer-properties`) - Browse all developers
2. **Developer Details** (`/developer-properties/:id`) - View properties by specific developer  
3. **Manage Developer Properties** (`/manage-developer-properties`) - Admin CRUD interface

### API Endpoints:
- `GET /api/developers` - Get all developers
- `POST /api/developers` - Create developer
- `GET /api/developers/:id` - Get developer by ID
- `PUT /api/developers/:id` - Update developer
- `DELETE /api/developers/:id` - Delete developer
- `GET /api/developer-properties` - Get all developer properties
- `POST /api/developer-properties` - Create property
- `GET /api/developer-properties/:id` - Get property by ID
- `PUT /api/developer-properties/:id` - Update property
- `DELETE /api/developer-properties/:id` - Delete property
- `GET /api/developer-properties/developer/:developerId` - Get properties by developer

## Troubleshooting

### Common Issues:

1. **Port conflicts**: Make sure no other services are running on ports 3000-3006, 5173
2. **MongoDB connection**: Ensure MongoDB is running and accessible
3. **CORS errors**: API Gateway is configured for frontend on port 5173
4. **Module not found**: Run `npm install` in each service directory

### Service Health Check:
- API Gateway: http://localhost:3000/api
- Each microservice should log "running on port X" when started successfully

## Development Notes

- Frontend uses Vite (default port 5173)
- All API calls go through API Gateway (port 3000)
- Microservices communicate via TCP
- MongoDB databases are separated by service
- CORS is enabled for localhost:5173