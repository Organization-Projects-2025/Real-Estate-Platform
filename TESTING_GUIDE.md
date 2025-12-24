# Testing Guide - Developer Properties Feature

## Prerequisites
1. MongoDB running on localhost:27017
2. All microservices running (use `npm run start:all` in microservices folder)
3. Frontend running on localhost:5173

## Step-by-Step Testing

### 1. Register as Developer
1. Go to http://localhost:5173/register
2. Fill in the form
3. **Important**: Select "Property Developer" from Account Type dropdown
4. Click Register

### 2. Create a Project
1. After login, click "My Projects" in navbar
2. Click "Add Project" button
3. Fill in project details:
   - Project Name: e.g., "Sunset Residences"
   - Description: e.g., "Luxury apartments in downtown"
   - Location: e.g., "Downtown, City Center"
   - Start Date: Select a date
   - Expected Completion: Select a future date
4. Upload project images:
   - Click "Choose Files"
   - Select 1-3 images from your device
   - Images will be automatically compressed to ~70% quality
   - Max dimensions: 800x600px
5. Click "Save Project"

### 3. Add Properties to Project
1. From "My Projects" page, click "Properties" button on your project card
2. Click "Add Property" button
3. Fill in property details:
   - Property Title: e.g., "3BR Luxury Apartment"
   - Description: Property description
   - Price: e.g., 250000
   - Listing Type: Sale or Rent
   - Property Type: House, Apartment, Villa, or Land
   - Address: Street, City, State
   - Features: Bedrooms, Bathrooms, Square Feet
4. Upload property images:
   - Click "Choose Files"
   - Select 1-5 images
   - Images will be compressed automatically
5. Click "Save Property"

### 4. View Your Projects and Properties
- Navigate to "My Projects" to see all your projects
- Click "Properties" on any project to see its properties
- Edit or delete projects/properties as needed

## API Endpoints

### Projects
```
POST   /api/projects/user/:userId          - Create project
GET    /api/projects/user/:userId          - Get user's projects
GET    /api/projects/:id                   - Get project by ID
PUT    /api/projects/user/:userId/:projectId - Update project
DELETE /api/projects/user/:userId/:projectId - Delete project
```

### Properties
```
POST   /api/developer-properties/project/:userId/:projectId - Create property in project
GET    /api/developer-properties/project/:projectId         - Get project properties
GET    /api/developer-properties/user/:userId               - Get user's properties
PUT    /api/developer-properties/user/:userId/:propertyId   - Update property
DELETE /api/developer-properties/user/:userId/:propertyId   - Delete property
```

## Image Upload Details

### Compression Settings
- Max Width: 800px
- Max Height: 600px
- Quality: 70%
- Format: JPEG
- Storage: Base64 in MongoDB

### Size Limits
- API Gateway: 50MB per request
- Recommended: Keep images under 5MB each before upload
- After compression: ~100-200KB per image

## Troubleshooting

### "PayloadTooLargeError"
- **Cause**: Images too large
- **Solution**: API Gateway now accepts up to 50MB
- **Prevention**: Images are auto-compressed to 70% quality

### "Missing message handler"
- **Cause**: Microservice not running or not updated
- **Solution**: Restart developerproperties-service
- **Command**: `cd microservices/developerproperties-service && npm run start:dev`

### "Schema hasn't been registered for model User"
- **Cause**: Trying to populate User from different service
- **Solution**: Already fixed - removed User population

### Images not displaying
- **Check**: Browser console for errors
- **Verify**: Images are Base64 strings starting with "data:image"
- **Solution**: Re-upload images if corrupted

## Database Structure

```
User Collection (auth-service)
  └── role: 'developer'

Project Collection (developerproperties-service)
  ├── developerId: ObjectId (ref: User)
  ├── name: string
  ├── description: string
  ├── location: string
  ├── images: string[] (Base64)
  └── dates: startDate, expectedCompletionDate

DeveloperProperty Collection (developerproperties-service)
  ├── developerId: ObjectId (ref: User)
  ├── projectId: ObjectId (ref: Project)
  ├── title: string
  ├── price: number
  ├── address: object
  ├── features: object
  └── images: string[] (Base64)
```

## Success Indicators

✅ User registered with developer role
✅ Project created with images
✅ Properties added to project with images
✅ Images display correctly
✅ Edit/Delete operations work
✅ Navigation between pages works
✅ No console errors