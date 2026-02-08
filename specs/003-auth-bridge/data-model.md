# Data Model: Authentication Bridge

## JWT Token Structure

### Claims
- **sub** (Subject): User identifier (matches user_id in API URLs)
- **iat** (Issued At): Unix timestamp when token was issued
- **exp** (Expiration Time): Unix timestamp when token expires
- **jti** (JWT ID): Unique identifier for the token (optional)
- **role** (Role): User role (for future expansion, currently not used)

### Token Properties
- **Algorithm**: HS256 (HMAC with SHA-256)
- **Secret**: BETTER_AUTH_SECRET (shared between frontend and backend)
- **Lifetime**: 1 hour (configurable, default)

## User Context Object

### CurrentUser
- **user_id**: String identifier extracted from JWT 'sub' claim
- **is_authenticated**: Boolean indicating valid authentication
- **raw_token**: Original JWT token (for advanced use cases)
- **claims**: Dictionary of all JWT claims for extensibility

## Authentication Response Models

### TokenResponse
- **access_token**: JWT token string
- **token_type**: "bearer" (standard for authorization header)
- **expires_in**: Integer representing seconds until expiration

### ValidationError
- **detail**: Error message explaining authentication failure
- **error_code**: Standardized error code for client handling

## Protected Resource Access

### User Isolation Requirements
- **Request Parameter**: user_id in URL path must match JWT 'sub' claim
- **Access Control**: Requests with mismatched user_id return 403 Forbidden
- **Filtering**: All database queries filtered by authenticated user's ID