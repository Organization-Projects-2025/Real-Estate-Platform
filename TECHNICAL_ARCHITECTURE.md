# Admin Filters System - Technical Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        REAL ESTATE PLATFORM                             │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER (React - Port 5173)                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────────┐    ┌──────────────────────────────┐          │
│  │  ADMIN PAGES         │    │  USER PAGES                  │          │
│  ├──────────────────────┤    ├──────────────────────────────┤          │
│  │ • Dashboard          │    │ • Buy (/buy)                 │          │
│  │ • Users              │    │ • Sell (/sell)               │          │
│  │ • Properties         │    │ • Properties (/properties)   │          │
│  │ • Reviews            │    │ • Rent (/rent)               │          │
│  │ • 🆕 Filters         │    │ • Agent (/agent)             │          │
│  │   - View all         │    │                              │          │
│  │   - Add new          │    │  All fetch dynamic filters   │          │
│  │   - Edit             │    │  from /api/filters endpoint  │          │
│  │   - Delete           │    │                              │          │
│  │   - Manage categories│    │  Display as:                 │          │
│  │   - Reorder          │    │  • Checkboxes (Buy, Props)  │          │
│  │                      │    │  • Dropdown (Sell)           │          │
│  │ Protected by Auth    │    │                              │          │
│  └──────────────────────┘    └──────────────────────────────┘          │
│                                                                          │
│                    ↓ All HTTP Requests ↓                                │
│                                                                          │
│        Communicate via REST API to API Gateway (localhost:3000)         │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
                                    ↓
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                 API GATEWAY LAYER (Port 3000)                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │ REST API Endpoints                                          │       │
│  ├─────────────────────────────────────────────────────────────┤       │
│  │                                                             │       │
│  │ • POST   /api/filters                                      │       │
│  │ • GET    /api/filters                                      │       │
│  │ • GET    /api/filters?category=property-type              │       │
│  │ • GET    /api/filters/:id                                 │       │
│  │ • PUT    /api/filters/:id                                 │       │
│  │ • DELETE /api/filters/:id                                 │       │
│  │ • DELETE /api/filters/category/:category                  │       │
│  │                                                             │       │
│  └────────────────┬──────────────────────────────────────────┘       │
│                   │                                                    │
│  ┌────────────────▼──────────────────────────────────────────┐       │
│  │  AdminService (Gateway)                                  │       │
│  │  - Routes HTTP requests to microservices                │       │
│  │  - Translates REST calls to message patterns             │       │
│  │  - Handles responses                                     │       │
│  └────────────────┬──────────────────────────────────────────┘       │
│                   │                                                    │
│        TCP Connection (localhost:3005)                               │
│                   │                                                    │
└───────────────────┼────────────────────────────────────────────────────┘
                    │
                    │
┌───────────────────▼────────────────────────────────────────────────────┐
│           ADMIN MICROSERVICE (Port 3005) - NEW ✨                      │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │ FilterController                                             │    │
│  ├──────────────────────────────────────────────────────────────┤    │
│  │ @MessagePattern Handlers:                                   │    │
│  │                                                              │    │
│  │ • createFilter                                              │    │
│  │ • getAllFilters                                             │    │
│  │ • getFilterById                                             │    │
│  │ • updateFilter                                              │    │
│  │ • deleteFilter                                              │    │
│  │ • getFiltersByCategory                                      │    │
│  │ • deleteCategoryFilters                                     │    │
│  │                                                              │    │
│  └──────────────────────┬───────────────────────────────────────┘    │
│                         │                                             │
│  ┌──────────────────────▼───────────────────────────────────────┐    │
│  │ FilterService                                                │    │
│  ├──────────────────────────────────────────────────────────────┤    │
│  │                                                              │    │
│  │ Methods:                                                    │    │
│  │ • create()                 - Add new filter                 │    │
│  │ • findAll()                - Get all filters                │    │
│  │ • findById()               - Get by ID                      │    │
│  │ • update()                 - Update filter                  │    │
│  │ • delete()                 - Delete filter                  │    │
│  │ • findByCategory()         - Filter by category             │    │
│  │ • deleteByCategory()       - Delete category filters        │    │
│  │                                                              │    │
│  └──────────────────────┬───────────────────────────────────────┘    │
│                         │                                             │
│  ┌──────────────────────▼───────────────────────────────────────┐    │
│  │ MongooseModule & FilterModel                                │    │
│  ├──────────────────────────────────────────────────────────────┤    │
│  │                                                              │    │
│  │ Schema:                                                     │    │
│  │ {                                                            │    │
│  │   _id: ObjectId,                                            │    │
│  │   name: String (unique, required),                          │    │
│  │   category: String (required),                              │    │
│  │   description: String (optional),                           │    │
│  │   isActive: Boolean (default: true),                        │    │
│  │   order: Number (default: 0),                               │    │
│  │   createdAt: Date,                                          │    │
│  │   updatedAt: Date                                           │    │
│  │ }                                                            │    │
│  │                                                              │    │
│  └──────────────────────┬───────────────────────────────────────┘    │
│                         │                                             │
│  MongoDB Connection: mongodb://localhost:27017/real-estate-admin     │
│                         │                                             │
└─────────────────────────┼─────────────────────────────────────────────┘
                          │
                          │
┌─────────────────────────▼─────────────────────────────────────────────┐
│                      DATABASE LAYER                                   │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │  MongoDB - real-estate-admin Database                        │    │
│  ├──────────────────────────────────────────────────────────────┤    │
│  │                                                              │    │
│  │  Collection: filters                                        │    │
│  │                                                              │    │
│  │  Example Documents:                                         │    │
│  │  {                                                           │    │
│  │    "_id": ObjectId(...),                                    │    │
│  │    "name": "Apartment",                                     │    │
│  │    "category": "property-type",                             │    │
│  │    "description": "Apartment properties",                   │    │
│  │    "isActive": true,                                        │    │
│  │    "order": 1,                                              │    │
│  │    "createdAt": ISODate("2025-12-23T..."),                 │    │
│  │    "updatedAt": ISODate("2025-12-23T...")                  │    │
│  │  }                                                           │    │
│  │                                                              │    │
│  │  {                                                           │    │
│  │    "_id": ObjectId(...),                                    │    │
│  │    "name": "Villa",                                         │    │
│  │    "category": "property-type",                             │    │
│  │    "description": "Villa properties",                       │    │
│  │    "isActive": true,                                        │    │
│  │    "order": 2,                                              │    │
│  │    "createdAt": ISODate("2025-12-23T..."),                 │    │
│  │    "updatedAt": ISODate("2025-12-23T...")                  │    │
│  │  }                                                           │    │
│  │                                                              │    │
│  └──────────────────────────────────────────────────────────────┘    │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### CREATE FILTER FLOW
```
User (Admin)
    │
    ├─ Navigates to /admin/filters
    │
    ├─ Clicks "Add Filter"
    │
    ├─ Form appears with fields:
    │   • Name
    │   • Category (property-type, amenities, etc.)
    │   • Description
    │   • Order
    │   • IsActive (toggle)
    │
    ├─ Fills form and clicks "Create Filter"
    │
    ├─ Frontend: Filters.jsx validates input
    │
    ├─ Frontend: Sends POST to /api/filters
    │   {
    │     "name": "Condo",
    │     "category": "property-type",
    │     "description": "Condominium",
    │     "order": 3,
    │     "isActive": true
    │   }
    │
    ├─ API Gateway: Receives POST /api/filters
    │
    ├─ API Gateway: AdminController routes to AdminService
    │
    ├─ API Gateway: AdminService sends 'createFilter' message
    │   to Admin Microservice via TCP
    │
    ├─ Admin Microservice: FilterController receives message
    │
    ├─ Admin Microservice: FilterService.create() called
    │   • Validates using CreateFilterDto
    │   • Creates new Mongoose document
    │   • Saves to MongoDB
    │
    ├─ Database: Filter saved to 'filters' collection
    │
    ├─ Admin Microservice: Returns new filter object
    │
    ├─ API Gateway: Returns response
    │
    ├─ Frontend: Updates table with new filter
    │
    ├─ Frontend: Shows success message
    │
    └─ Done! Filter available on /buy, /properties, /sell
```

### FILTER USAGE FLOW (User)
```
User (Customer)
    │
    ├─ Navigates to /buy
    │
    ├─ Page loads
    │
    ├─ Frontend: Buy.jsx runs useEffect
    │   • Fetches GET /api/filters?category=property-type
    │
    ├─ API Gateway: Receives request
    │
    ├─ API Gateway: Routes to AdminService
    │
    ├─ Admin Microservice: FilterController handles 'getAllFilters'
    │
    ├─ FilterService: Queries MongoDB
    │   db.filters.find({ category: 'property-type', isActive: true })
    │
    ├─ Returns array of filters:
    │   [
    │     { _id: "...", name: "Apartment", ... },
    │     { _id: "...", name: "Villa", ... },
    │     { _id: "...", name: "Condo", ... }
    │   ]
    │
    ├─ Frontend: Renders checkboxes for each filter
    │   ☐ Apartment
    │   ☐ Villa
    │   ☐ Condo
    │
    ├─ User: Checks "Apartment" and "Villa"
    │
    ├─ Frontend: Updates selectedFilters state
    │   { propertyType: ["Apartment", "Villa"] }
    │
    ├─ Frontend: Filters properties array
    │   properties.filter(p => 
    │     ["Apartment", "Villa"].includes(p.propertyType)
    │   )
    │
    ├─ Frontend: Updates filteredProperties state
    │
    ├─ Render: Only Apartment and Villa properties show
    │
    └─ User: Can see only properties matching selected filters
```

### UPDATE FILTER FLOW
```
Admin
    │
    ├─ On /admin/filters page
    │
    ├─ Clicks pencil icon on filter row
    │
    ├─ Form populates with current filter data
    │
    ├─ Modifies field (e.g., changes name from "Apt" to "Apartment")
    │
    ├─ Clicks "Update Filter"
    │
    ├─ Frontend: Validates updated data
    │
    ├─ Frontend: Sends PUT to /api/filters/:id
    │   {
    │     "name": "Apartment",
    │     "category": "property-type",
    │     ...
    │   }
    │
    ├─ API Gateway → Admin Microservice (via TCP)
    │   'updateFilter' message pattern
    │
    ├─ FilterService: Queries by ID
    │
    ├─ Database: Updates filter document
    │
    ├─ Returns updated filter
    │
    ├─ Frontend: Table refreshes
    │
    └─ Success! Changes visible immediately on user pages
```

### DELETE FILTER FLOW
```
Admin
    │
    ├─ Hovers over filter row
    │
    ├─ Clicks trash icon (delete button)
    │
    ├─ Confirmation dialog appears
    │   "Are you sure you want to delete this filter?"
    │
    ├─ Clicks "OK"
    │
    ├─ Frontend: Sends DELETE to /api/filters/:id
    │
    ├─ API Gateway → Admin Microservice
    │   'deleteFilter' message pattern
    │
    ├─ FilterService: Calls findByIdAndDelete()
    │
    ├─ Database: Removes document
    │
    ├─ Frontend: Removes row from table
    │
    ├─ Shows success message
    │
    └─ Filter no longer appears on user pages
```

## Component Interaction Map

```
App.jsx
├── Routes to /admin/filters
│
└── ProtectedAdminRoute (checks authentication)
    │
    └── AdminLayout
        │
        └── Sidebar.jsx
        │   ├── Displays navigation items
        │   └── "Filters" link → /admin/filters
        │
        └── Filters.jsx (NEW - Main Component)
            │
            ├── State:
            │   ├── filters: []
            │   ├── formData: { name, category, description, ... }
            │   ├── editingId: null
            │   ├── loading: false
            │   └── showForm: false
            │
            ├── useEffect (mount)
            │   └── fetchFilters() → GET /api/filters
            │
            ├── Rendered Elements:
            │   ├── Header with "Add Filter" button
            │   ├── Form (shown when showForm = true)
            │   │   ├── Input: name
            │   │   ├── Select: category
            │   │   ├── Input: order
            │   │   ├── Checkbox: isActive
            │   │   ├── Textarea: description
            │   │   └── Buttons: Submit, Cancel
            │   │
            │   └── Table
            │       ├── Headers: Name, Category, Description, Order, Status, Actions
            │       └── Rows: One per filter
            │           ├── Data columns
            │           └── Action buttons: Edit, Delete
            │
            └── Event Handlers:
                ├── handleInputChange()
                ├── handleSubmit() → POST/PUT /api/filters
                ├── handleEdit()
                ├── handleDelete() → DELETE /api/filters/:id
                └── handleCancel()
```

## File Dependencies

```
Admin Filters System Dependencies:

Client:
├── App.jsx
│   └── imports Filters.jsx
│       └── uses fetch to call /api/filters
├── Buy.jsx
│   └── uses fetch to call /api/filters?category=property-type
├── Sell.jsx
│   └── uses fetch to call /api/filters?category=property-type
├── Properties.jsx
│   └── uses fetch to call /api/filters?category=property-type
└── Sidebar.jsx
    └── links to /admin/filters

API Gateway:
├── app.module.ts
│   └── imports AdminService, AdminController
├── admin/admin.controller.ts
│   └── imports AdminService
│       └── uses ClientProxy to send messages
└── admin/admin.service.ts
    └── communicates with Admin Microservice

Admin Microservice:
├── main.ts
│   └── imports AdminModule
│       └── creates microservice on port 3005
├── admin.module.ts
│   ├── imports MongooseModule
│   └── provides FilterController, FilterService
├── filter.controller.ts
│   └── injects FilterService
├── filter.service.ts
│   └── injects Model<Filter>
├── filter.model.ts
│   └── defines schema
└── filter.dto.ts
    └── used for validation
```

## API Contract

### Request/Response Examples

#### Create Filter
```
REQUEST:
POST /api/filters HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "name": "House",
  "category": "property-type",
  "description": "Single family house",
  "isActive": true,
  "order": 4
}

RESPONSE (201):
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "House",
  "category": "property-type",
  "description": "Single family house",
  "isActive": true,
  "order": 4,
  "createdAt": "2025-12-23T10:30:00Z",
  "updatedAt": "2025-12-23T10:30:00Z"
}
```

#### Get Filters
```
REQUEST:
GET /api/filters?category=property-type HTTP/1.1
Host: localhost:3000

RESPONSE (200):
[
  {
    "_id": "507f1f77bcf86cd799439001",
    "name": "Apartment",
    "category": "property-type",
    "order": 1,
    "isActive": true
  },
  {
    "_id": "507f1f77bcf86cd799439002",
    "name": "Villa",
    "category": "property-type",
    "order": 2,
    "isActive": true
  }
]
```

#### Update Filter
```
REQUEST:
PUT /api/filters/507f1f77bcf86cd799439001 HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "name": "Modern Apartment",
  "order": 2
}

RESPONSE (200):
{
  "_id": "507f1f77bcf86cd799439001",
  "name": "Modern Apartment",
  "category": "property-type",
  "description": "Apartment properties",
  "isActive": true,
  "order": 2,
  "createdAt": "2025-12-23T10:30:00Z",
  "updatedAt": "2025-12-23T10:35:00Z"
}
```

#### Delete Filter
```
REQUEST:
DELETE /api/filters/507f1f77bcf86cd799439001 HTTP/1.1
Host: localhost:3000

RESPONSE (200):
{
  "success": true
}
```

## Performance Considerations

```
Optimization Opportunities:

1. Caching Layer
   Client Cache:
   ├── Cache filters in localStorage
   ├── Invalidate on changes
   └── Reduce API calls

   Server Cache (Redis):
   ├── Cache filter lists by category
   ├── TTL: 1 hour
   └── Invalidate on create/update/delete

2. Database Optimization
   ├── Index on 'category' field
   ├── Index on 'name' field (unique)
   └── Index on 'isActive' field

3. API Optimization
   ├── Pagination for large filter sets
   ├── Compression (gzip)
   └── Query optimization

4. Frontend Optimization
   ├── Memoization of components
   ├── Lazy loading of admin UI
   └── Virtual scrolling for large tables
```

---

This architecture is designed to be:
- ✅ **Scalable** - Easy to add more services
- ✅ **Maintainable** - Clear separation of concerns
- ✅ **Extensible** - Easy to add features
- ✅ **Reliable** - Error handling at each layer
- ✅ **Performant** - Optimized data flow
