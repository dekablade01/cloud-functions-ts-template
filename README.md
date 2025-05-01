# Firebase Cloud Functions Template

A scalable and maintainable template for Firebase Cloud Functions using TypeScript, featuring a robust architecture with repository pattern, middleware support, and built-in HTTP handlers.

## Features

- 🏗 **Clean Architecture**
  - Repository Pattern for data access
  - Service-based structure
  - Middleware support
  - Type-safe request/response handling

- 🔒 **Built-in Security**
  - Authentication middleware
  - Role-based access control
  - Client secret management
  - Request validation

- 🛠 **Developer Experience**
  - TypeScript support
  - Modular design
  - Easy to extend
  - Consistent error handling

- 🌐 **HTTP Utilities**
  - Built-in RequestManager for external API calls
  - Automatic timeout handling
  - Query parameter building
  - Type-safe responses

## Project Structure

```
functions/
├── src/
│   ├── paths/                 # HTTP endpoints
│   │   └── client/           # Example client endpoint
│   │       ├── index.ts
│   │       └── methods/      # HTTP methods
│   │           ├── getClient.ts
│   │           ├── postClient.ts
│   │           ├── putClient.ts
│   │           └── deleteClient.ts
│   ├── utils/
│   │   ├── http/            # HTTP handling utilities
│   │   │   ├── http-handler.ts
│   │   │   ├── http-methods.ts
│   │   │   └── adapters.ts
│   │   ├── repositories/    # Data access layer
│   │   │   └── base-repository.ts
│   │   ├── middleware.ts    # Common middleware
│   │   ├── firebase.ts      # Firebase initialization
│   │   └── types.ts         # Common types
│   └── index.ts             # Entry point
```

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- Firebase CLI
- Firebase Project

### Installation

1. Clone this template:
   ```bash
   git clone <your-repo-url>
   cd your-project-name
   ```

2. Install dependencies:
   ```bash
   cd functions
   npm install
   ```

3. Configure Firebase:
   ```bash
   firebase login
   firebase use your-project-id
   ```

### Development

1. Create a new endpoint:
   ```typescript
   // src/paths/your-endpoint/index.ts
   import { ServiceHandler } from "../../utils/types";
   import { BaseWebService } from "../../utils/services/web-service";
   import { getYourEndpoint } from "./methods/getYourEndpoint";
   // ... import other methods

   export class YourEndpointService extends BaseWebService {
     readonly path = "/your-endpoint";
     readonly handlers: ServiceHandler[] = [
       getYourEndpoint,
       // ... other handlers
     ];
   }

   export default new YourEndpointService();
   ```

2. Implement repository:
   ```typescript
   // src/repositories/your-repository.ts
   import { FirestoreRepository } from '../utils/repositories/base-repository';

   export interface YourModel {
     id: string;
     // ... your model properties
   }

   export class YourRepository extends FirestoreRepository<YourModel> {
     protected collectionName = 'YOUR_COLLECTION';
   }
   ```

3. Implement handlers:
   ```typescript
   // src/paths/your-endpoint/methods/getYourEndpoint.ts
   export const getYourEndpoint: ServiceHandler = {
     method: HTTPMethod.GET,
     authOptions: { 
       requireToken: true,
       requireClient: true,
       requireAdmin: false
     },
     handle: async (request, response) => {
       // Your implementation
     }
   };
   ```

### Authentication

The template includes three levels of authentication:
- Client Authentication (`requireClient`)
- Token Authentication (`requireToken`)
- Admin Authentication (`requireAdmin`)

Configure auth requirements in your handlers:
```typescript
authOptions: { 
  requireToken: true,    // Require JWT token
  requireClient: true,   // Require client credentials
  requireAdmin: false    // Require admin role
}
```

### Repository Pattern

Base repository provides common CRUD operations:
```typescript
interface Repository<T> {
  findById(id: string): Promise<T | null>;
  findOne(query: Partial<T>): Promise<T | null>;
  find(query: Partial<T>): Promise<T[]>;
  create(data: Partial<T>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}
```

### RequestManager

The template includes a type-safe RequestManager for making external API calls:

```typescript
// Configure RequestManager
requestManager.setHeaders({
  "Authorization": `Bearer ${process.env.API_KEY}`,
  "Content-Type": "application/json"
});

// Make type-safe API calls
interface UserResponse {
  id: string;
  name: string;
}

// GET request
const user = await requestManager.get<UserResponse>({
  path: '/api/users/123',
  parameters: { include: ['profile'] },
  headers: { 'X-Custom-Header': 'value' }
});

// POST request
const newUser = await requestManager.post<UserResponse>({
  path: '/api/users',
  parameters: { name: 'John Doe' }
});

// PUT request
const updatedUser = await requestManager.put<UserResponse>({
  path: '/api/users/123',
  parameters: { name: 'John Updated' }
});

// DELETE request
await requestManager.delete({
  path: '/api/users/123'
});
```

Features:
- Type-safe requests and responses
- Automatic timeout handling
- Query parameter building
- Error handling
- Custom headers support
- Authentication header management

## Deployment

Deploy to Firebase:
```bash
firebase deploy --only functions
```

Deploy specific function:
```bash
firebase deploy --only functions:functionName
```

## Best Practices

1. **Type Safety**
   - Use interfaces for request/response data
   - Leverage TypeScript's type system
   - Validate input data

2. **Error Handling**
   - Use try-catch blocks
   - Return consistent error responses
   - Log errors appropriately

3. **Security**
   - Always validate input
   - Use appropriate auth levels
   - Keep secrets secure

4. **Code Organization**
   - One handler per file
   - Group related endpoints
   - Use meaningful names

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. 