# Research: Authentication Bridge Implementation

## Overview
Research findings for implementing the authentication bridge between Next.js (Better Auth) and FastAPI using JWT tokens with a shared secret.

## Decision: JWT Algorithm Selection
**Rationale**: RS256 vs HS256 for JWT signing
- **Chosen**: HS256 (HMAC with SHA-256) for simplicity and performance
- **Reasoning**: Better Auth typically uses HS256 by default with a shared secret, making it easier to configure and verify in FastAPI
- **Alternatives considered**: RS256 (RSA with public/private key pairs) offers asymmetric signing but adds complexity for shared-secret architecture

## Decision: Authentication Pattern
**Rationale**: FastAPI Security dependency vs middleware approach
- **Chosen**: FastAPI Security dependency using HTTPBearer scheme
- **Reasoning**: Provides clean integration with FastAPI's dependency injection system, automatic 401 responses, and easy testing
- **Alternatives considered**: Custom middleware, decorator-based approach

## Decision: User Context Injection
**Rationale**: How to make user ID available to route handlers
- **Chosen**: Dependency injection with CurrentUser object
- **Reasoning**: Follows FastAPI best practices, type-safe, integrates well with Pydantic models
- **Alternatives considered**: Thread-local storage, global context objects

## Decision: Secret Management
**Rationale**: Secure handling of BETTER_AUTH_SECRET
- **Chosen**: pydantic-settings for configuration management
- **Reasoning**: Type-safe, supports multiple configuration sources, integrates well with FastAPI
- **Alternatives considered**: Direct os.environ access, custom configuration classes

## Decision: Token Verification Approach
**Rationale**: How to verify JWT tokens in FastAPI
- **Chosen**: python-jose[cryptography] for token decoding and verification
- **Reasoning**: Lightweight, well-maintained, good performance, supports both RS256 and HS256
- **Alternatives considered**: PyJWT, authlib, jwt libraries

## Decision: Error Handling Strategy
**Rationale**: How to handle invalid/missing tokens
- **Chosen**: HTTPException with 401 status code raised by security dependency
- **Reasoning**: Standard FastAPI pattern, consistent with framework expectations
- **Alternatives considered**: Returning None user, custom exception classes