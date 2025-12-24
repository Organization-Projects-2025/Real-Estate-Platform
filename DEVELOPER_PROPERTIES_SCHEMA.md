# Developer Properties Schema - New Structure

## Database Schema Hierarchy

```
User (Developer Role)
  └── Projects
        └── Properties
```

## 1. User Model (Auth Service)
```typescript
{
  _id: ObjectId,
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  role: 'user' | 'agent' | 'admin' | 'developer',  // NEW: Added developer role
  phoneNumber: string,
  profilePicture: string,
  // ... other fields
}
```

## 2. Project Model (NEW)
```typescript
{
  _id: ObjectId,
  developerId: ObjectId (ref: 'User'),  // Links to user with developer role
  name: string,                          // Project name
  description: string,
  location: string,
  images: string[],                      // Base64 encoded images from device
  status: 'active' | 'completed',
  startDate: Date,
  expectedCompletionDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 3. DeveloperProperty Model (UPDATED)
```typescript
{
  _id: ObjectId,
  developerId: ObjectId (ref: 'User'),     // Links to developer
  projectId: ObjectId (ref: 'Project'),    // NEW: Links to project
  title: string,
  description: string,
  price: number,
  listingType: 'sale' | 'rent',
  propertyType: string,
  address: {
    street: string,
    city: string,
    state: string,
    country: string,
    zipCode: string
  },
  area: {
    sqft: number,
    sqm: number
  },
  features: {
    bedrooms: number,
    bathrooms: number,
    garage: number,
    pool: boolean,
    yard: boolean,
    pets: boolean,
    furnished: string
  },
  images: string[],                        // CHANGED: from 'media' to 'images', Base64 encoded
  status: 'active' | 'sold',
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints Structure

### Projects
- `POST /api/projects/user/:userId` - Create project for user
- `GET /api/projects/user/:userId` - Get all projects by user
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/user/:userId/:projectId` - Update user's project
- `DELETE /api/projects/user/:userId/:projectId` - Delete user's project

### Properties
- `POST /api/properties/project/:userId/:projectId` - Create property in project
- `GET /api/properties/project/:projectId` - Get all properties in project
- `GET /api/properties/user/:userId` - Get all properties by user
- `PUT /api/properties/user/:userId/:propertyId` - Update user's property
- `DELETE /api/properties/user/:userId/:propertyId` - Delete user's property

## Frontend Pages Structure

### 1. My Projects (`/my-projects`)
- Lists all projects created by the developer
- Add/Edit/Delete projects
- Upload project images from device
- Navigate to project properties

### 2. Project Properties (`/project/:projectId/properties`)
- Shows all properties within a specific project
- Add/Edit/Delete properties for that project
- Upload property images from device
- Breadcrumb: Projects > [Project Name] > Properties

### 3. Public View (`/developer-properties`)
- Shows all developers (users with role='developer')
- Click developer → Shows their projects
- Click project → Shows properties in that project

## Image Upload Flow

1. User selects images from device using `<input type="file" multiple accept="image/*">`
2. Images are converted to Base64 using FileReader API
3. Base64 strings are stored in MongoDB
4. Images are displayed using `<img src="data:image/jpeg;base64,...">`

## Key Changes from Previous Structure

1. **Removed separate Developer entity** - Now uses User with role='developer'
2. **Added Project entity** - Middle layer between Developer and Properties
3. **Changed media to images** - More descriptive field name
4. **Image upload from device** - Base64 encoding instead of URLs
5. **Hierarchical structure** - Developer → Projects → Properties

## Security

- Developers can only manage their own projects and properties
- All operations verify userId matches the resource owner
- Proper authentication required for all CRUD operations