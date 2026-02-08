# Quickstart Guide: Authentication Bridge

## Prerequisites
- Python 3.11+ with pip
- Node.js 18+ with npm/pnpm
- Better Auth configured in Next.js frontend
- BETTER_AUTH_SECRET generated and available

## Setup Steps

### 1. Configure Environment Variables
```bash
# In frontend/.env.local
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-shared-secret-here
BETTER_AUTH_JWT_ENABLED=true

# In backend/.env
BETTER_AUTH_SECRET=your-shared-secret-here
BETTER_AUTH_URL=http://localhost:3000
```

### 2. Install Backend Dependencies
```bash
cd backend
pip install python-jose[cryptography] pydantic-settings fastapi sqlmodel
```

### 3. Install Frontend Dependencies
```bash
cd frontend
npm install @better-auth/react @better-auth/client
# If using JWT plugin, also install:
npm install @better-auth/jwt
```

### 4. Initialize Backend Auth Module
```python
# backend/app/core/auth.py
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from jwt import PyJWKClient
from pydantic_settings import BaseSettings
from typing import Optional

# Configuration and JWT verification utilities
```

### 5. Configure Frontend Auth Provider
```typescript
// frontend/src/components/auth/AuthProvider.tsx
import { BetterAuth } from "@better-auth/react";
import { jwtPlugin } from "@better-auth/jwt";

const auth = BetterAuth({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  plugins: [
    jwtPlugin({
      secret: process.env.BETTER_AUTH_SECRET!,
    }),
  ],
});
```

## Testing the Connection
1. Start the frontend: `npm run dev`
2. Start the backend: `uvicorn main:app --reload`
3. Authenticate via frontend to obtain JWT
4. Call backend endpoints with Authorization: Bearer `<token>` header

## Expected Behavior
- Valid JWT tokens grant access to protected endpoints
- Invalid/missing tokens return 401 Unauthorized
- User ID mismatch returns 403 Forbidden
- User context available in route handlers