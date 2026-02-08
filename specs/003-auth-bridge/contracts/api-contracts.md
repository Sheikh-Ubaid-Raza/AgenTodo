# API Contracts: Authentication Bridge

## Authentication Endpoints (Frontend)

### JWT Token Retrieval
- **Endpoint**: `/api/auth/token` (example)
- **Method**: GET
- **Headers**: Authorization: Bearer `<session_token>`
- **Response**:
  - 200: `{ "access_token": "jwt_string", "token_type": "bearer", "expires_in": 3600 }`
  - 401: `{ "detail": "Unauthorized" }`

## Protected Backend Endpoints

### Task Operations
- **Endpoint**: `/api/users/{user_id}/tasks`
- **Method**: GET
- **Headers**: Authorization: Bearer `<jwt_token>`
- **Path Params**: user_id (must match JWT 'sub' claim)
- **Response**:
  - 200: Array of user's tasks
  - 401: `{ "detail": "Invalid or missing token" }`
  - 403: `{ "detail": "Access forbidden: user ID mismatch" }`

### Single Task Operations
- **Endpoint**: `/api/users/{user_id}/tasks/{task_id}`
- **Method**: GET, PUT, DELETE
- **Headers**: Authorization: Bearer `<jwt_token>`
- **Path Params**: user_id (must match JWT 'sub' claim), task_id
- **Response**:
  - 200: Task object
  - 401: `{ "detail": "Invalid or missing token" }`
  - 403: `{ "detail": "Access forbidden: user ID mismatch" }`
  - 404: `{ "detail": "Task not found" }`

## Authentication Verification

### Health Check with Auth
- **Endpoint**: `/api/auth/verify`
- **Method**: POST
- **Headers**: Authorization: Bearer `<jwt_token>`
- **Body**: `{}` (empty object)
- **Response**:
  - 200: `{ "authenticated": true, "user_id": "user_identifier" }`
  - 401: `{ "detail": "Invalid or missing token" }`

## Error Responses

### Standard Error Format
- **Format**: `{ "detail": "Human-readable error message", "error_code": "unique_error_identifier" }`
- **Codes**:
  - `TOKEN_INVALID`: JWT signature verification failed
  - `TOKEN_EXPIRED`: JWT expiration time has passed
  - `USER_MISMATCH`: Requested user_id doesn't match JWT 'sub' claim
  - `MISSING_TOKEN`: No Authorization header provided
  - `MALFORMED_TOKEN`: JWT is not properly formatted