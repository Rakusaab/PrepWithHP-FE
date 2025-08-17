# GitHub Copilot Instructions for PrepWithAI Himachal

## Security Guidelines

### Authentication & Session Management
- Always use secure, HTTP-only cookies for session tokens
- Implement proper CSRF protection with next-auth
- Use bcrypt with minimum 12 rounds for password hashing
- Implement rate limiting for authentication endpoints
- Never store sensitive data in localStorage - use secure cookies only
- Always validate and sanitize user inputs
- Use JWT tokens with proper expiration times (access: 15min, refresh: 7days)
- Implement proper session invalidation on logout

### Data Protection
- Encrypt sensitive user data at rest
- Use HTTPS only in production
- Implement proper CORS policies
- Never log sensitive information (passwords, tokens, personal data)
- Use environment variables for all secrets and API keys
- Implement proper input validation with Zod schemas
- Sanitize data before database operations

### Role-Based Access Control (RBAC)
- Implement least privilege principle
- Use middleware for route protection
- Validate permissions on both client and server side
- Create proper role hierarchy: student < teacher < admin < super_admin
- Audit user actions for sensitive operations

### Modern Security Practices
- Use next-auth v5 (Auth.js) when available for latest security features
- Implement 2FA for admin accounts
- Use secure password policies (8+ chars, mixed case, numbers, symbols)
- Implement account lockout after failed attempts
- Use secure session configuration with SameSite cookies
- Implement proper logout from all devices functionality

### API Security
- Use API rate limiting
- Implement proper error handling without exposing system details
- Use request/response validation with TypeScript and Zod
- Implement API versioning
- Use proper HTTP status codes
- Implement request ID tracking for debugging

### Frontend Security
- Implement CSP (Content Security Policy) headers
- Use proper form validation with both client and server-side checks
- Sanitize user-generated content to prevent XSS
- Implement proper error boundaries
- Use secure routing with proper authentication checks

### Database Security
- Use parameterized queries to prevent SQL injection
- Implement proper indexing for performance and security
- Use connection pooling with proper limits
- Implement database query monitoring
- Use read-only database connections where appropriate

### Monitoring & Auditing
- Log authentication events (login, logout, failed attempts)
- Monitor for suspicious activities
- Implement proper error reporting without exposing sensitive data
- Use structured logging with proper log levels
- Implement security headers monitoring

## Code Quality Guidelines

### TypeScript Best Practices
- Use strict TypeScript configuration
- Implement proper type definitions for all API responses
- Use discriminated unions for complex state management
- Implement proper error types with detailed information
- Use generic types for reusable components

### React/Next.js Best Practices
- Use Server Components where possible for better performance
- Implement proper loading states and error boundaries
- Use proper form handling with react-hook-form and Zod
- Implement proper caching strategies with Next.js
- Use proper image optimization with Next.js Image component

### Performance Guidelines
- Implement proper code splitting
- Use React.memo for expensive components
- Implement proper caching for API calls
- Use proper bundle analysis and optimization
- Implement proper database query optimization

## Project-Specific Guidelines

### Exam Platform Security
- Implement session-based exam security
- Prevent cheating with proper monitoring
- Use secure question delivery mechanisms
- Implement proper exam result encryption
- Use time-based access control for exams

### User Data Protection
- Implement GDPR compliance for data handling
- Provide proper data export functionality
- Implement right to be forgotten
- Use proper consent management
- Implement data retention policies

### Mobile Security
- Implement proper mobile-specific security measures
- Use secure storage on mobile devices
- Implement proper biometric authentication where available
- Use proper certificate pinning for API calls

Remember: Security is not a feature, it's a requirement. Always think security-first when implementing any functionality.
