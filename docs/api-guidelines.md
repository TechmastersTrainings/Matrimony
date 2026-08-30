# API Design & Conventions

## 1. Base URL & Versioning
All backend API routes follow the `/api/v1` prefix convention:
```
http://localhost:8000/api/v1
```

Root endpoints:
- `GET /`: API Metadata & Route Sitemap
- `GET /health`: Comprehensive System Health Check
- `GET /docs`: Swagger UI OpenAPI Documentation
- `GET /redoc`: ReDoc Documentation
- `GET /openapi.json`: OpenAPI Specification

## 2. Response Structure
Standard success response:
```json
{
  "success": true,
  "data": { ... }
}
```

Standard error response:
```json
{
  "success": false,
  "error": {
    "message": "Human readable error description",
    "type": "AppExceptionClass",
    "details": {}
  }
}
```

## 3. Status Codes
- `200 OK`: Request succeeded.
- `201 Created`: Resource created.
- `400 Bad Request`: Invalid client request.
- `401 Unauthorized`: Authentication missing or invalid.
- `403 Forbidden`: Authenticated user lacks permission.
- `404 Not Found`: Resource not found.
- `422 Unprocessable Entity`: Schema validation failure.
- `500 Internal Server Error`: Unhandled server exception.
- `502 Bad Gateway`: External upstream provider failure (e.g. R2 storage).
- `503 Service Unavailable`: Core infrastructure unreachable (e.g. database or cache outage).
