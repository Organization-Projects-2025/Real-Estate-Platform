# Real Estate Platform - Access & Authorization Guide

## 🔐 User Credentials

### Admin User
- **Email**: `admin@realestate.com`
- **Password**: `Admin@123456`
- **Role**: Admin
- **Permissions**: 
  - Access admin dashboard
  - Add/manage developers
  - Manage all users
  - Manage properties and reviews

### Test Developer User
- **Email**: `developer@realestate.com`
- **Password**: `Developer@123456`
- **Role**: Developer
- **Permissions**:
  - View all projects/developers
  - Create own properties
  - Edit only own properties
  - Delete only own properties

### Test Regular User
- **Email**: `user@realestate.com`
- **Password**: `User@123456`
- **Role**: User
- **Permissions**:
  - Browse properties
  - View developer projects
  - Save properties

---

## 🚀 How to Access

### Admin Dashboard
1. Go to: **http://localhost:5173**
2. Click **Login**
3. Enter admin credentials:
   - Email: `admin@realestate.com`
   - Password: `Admin@123456`
4. After login, click **Admin Dashboard** button in top navbar
5. Or navigate directly to: **http://localhost:5173/admin**

### Admin Dashboard Features
- **Dashboard**: Overview stats and recent activities
- **Users**: View and manage all users (edit roles, deactivate/reactivate)
- **Properties**: View and manage properties
- **Reviews**: View and manage reviews
- **Settings**: System configuration

---

## 👥 User Role Management

### Admin Features
- ✅ Add new developers (only admin can create developers)
- ✅ Manage user roles (user, agent, admin, developer)
- ✅ Deactivate/reactivate users
- ✅ View system analytics
- ✅ Access admin dashboard at `/admin`

### Developer Features
- ✅ Create new projects/properties
- ✅ View all developer projects (public)
- ✅ **Edit only their own projects** (ownership restriction)
- ✅ **Delete only their own projects** (ownership restriction)
- ❌ Cannot create other developers
- ❌ Cannot access admin dashboard

### Regular User Features
- ✅ Browse all properties
- ✅ View developer projects
- ✅ Save favorite properties
- ✅ Write reviews
- ❌ Cannot create properties
- ❌ Cannot manage developers

---

## 🔒 Authorization Implementation

### 1. Developer Creation (Admin-Only)
**Endpoint**: `POST /api/developers`

**Protection**: `@UseGuards(AdminGuard)`

Only users with `role: 'admin'` can create developers.

```typescript
@Post('developers')
@UseGuards(AdminGuard)
async createDeveloper(@Body() data: any) {
  return this.service.createDeveloper(data);
}
```

**Response (if not admin)**:
```json
{
  "statusCode": 403,
  "message": "Forbidden - admin access required"
}
```

### 2. Developer Property Ownership
**Endpoints**: 
- `PUT /api/developer-properties/:id` (Update)
- `DELETE /api/developer-properties/:id` (Delete)

**Protection**: `@UseGuards(AuthGuard)` + Ownership Check

Developers can only edit/delete their own properties.

```typescript
@Put('developer-properties/:id')
@UseGuards(AuthGuard)
async updateProperty(@Param('id') id: string, @Body() data: any, @Req() req: Request) {
  return this.service.updateProperty(id, data, req.user?.id);
}
```

**Database Field**: `createdBy` stores the user ID who created the property

**Response (if not owner)**:
```json
{
  "statusCode": 403,
  "message": "You can only edit your own properties"
}
```

---

## 🔄 API Authentication

### Token-Based Auth
All protected endpoints require a JWT token via:
- **Cookie**: `jwt` (automatically set on login)
- **Header**: `Authorization: Bearer <token>`

### Login Response
```json
{
  "status": "success",
  "data": {
    "user": {
      "_id": "user_id",
      "firstName": "Admin",
      "lastName": "User",
      "email": "admin@realestate.com",
      "role": "admin",
      "active": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 📝 Database Migrations

### New Developer Property Field
Added `createdBy` field to track property ownership:

```typescript
@Prop({ type: String })
createdBy: string; // User ID who created this property
```

### New User Role
Added `'developer'` to user role enum:
```typescript
@Prop({ enum: ['user', 'agent', 'admin', 'developer'], default: 'user' })
role: string;
```

---

## 🔗 Available Endpoints

### Developer Management (Admin-Only)
- `POST /api/developers` - Create developer (admin only)
- `GET /api/developers` - Get all developers
- `GET /api/developers/:id` - Get developer by ID
- `PUT /api/developers/:id` - Update developer
- `DELETE /api/developers/:id` - Delete developer

### Developer Properties
- `GET /api/developer-properties` - Get all properties
- `GET /api/developer-properties/:id` - Get property by ID
- `GET /api/developer-properties/developer/:developerId` - Get properties by developer

**With Restrictions**:
- `POST /api/developer-properties` - Create property (auth required)
- `PUT /api/developer-properties/:id` - Update (auth + ownership)
- `DELETE /api/developer-properties/:id` - Delete (auth + ownership)

---

## 🧪 Testing the Implementation

### Test 1: Admin Creates Developer
```bash
curl -X POST http://localhost:3000/api/developers \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"New Developer","description":"..."}'
```

### Test 2: Regular User Tries to Create Developer (Should Fail)
```bash
curl -X POST http://localhost:3000/api/developers \
  -H "Authorization: Bearer <user_token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"New Developer","description":"..."}'
```
**Expected**: 403 Forbidden

### Test 3: Developer Edits Own Property (Should Succeed)
```bash
curl -X PUT http://localhost:3000/api/developer-properties/property_id \
  -H "Authorization: Bearer <developer_token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Title"}'
```

### Test 4: Developer Edits Another's Property (Should Fail)
```bash
curl -X PUT http://localhost:3000/api/developer-properties/other_property_id \
  -H "Authorization: Bearer <developer_token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Title"}'
```
**Expected**: 403 Forbidden - "You can only edit your own properties"

---

## 📱 Frontend Notes

### Admin Dashboard
- Located at: `client/src/pages/admin/`
- Protected route: `ProtectedAdminRoute` component
- Accessible only to users with `role: 'admin'`

### Developer Pages
- Developer listing: `/developer-properties`
- Developer detail: `/developer-properties/:developerId`
- Developer management: `/manage-developer-properties`

---

## 🛠️ Troubleshooting

### Can't Access Admin Dashboard?
- ✓ Confirm you're logged in as admin
- ✓ Check browser console for token errors
- ✓ Clear cookies and re-login
- ✓ Verify JWT is not expired (set to 7 days)

### Properties Not Showing?
- ✓ Ensure MongoDB connection is working
- ✓ Check that developerproperties-service is running on port 3006
- ✓ Verify API Gateway is routing requests correctly

### Developer Can Edit Other Properties?
- ✓ Check `createdBy` field is being set on property creation
- ✓ Verify userId is being passed in update/delete requests
- ✓ Check authorization middleware is applied

---

## 🔄 Microservices Architecture

**API Gateway** (Port 3000)
- Routes all API requests
- Authenticates users
- Enforces authorization

**Auth Service** (Port 3001)
- User registration/login
- Token validation
- User management

**Developer Properties Service** (Port 3006)
- Developer CRUD operations
- Developer Property CRUD operations
- Ownership validation

---

## 📊 Data Flow

```
Client Request
    ↓
API Gateway (validates token)
    ↓
Auth Guard (checks role)
    ↓
Developer Properties Service
    ↓
Ownership Check (for edit/delete)
    ↓
Database Update/Response
```

---

**Last Updated**: December 20, 2025
**Version**: 1.0.0
