# AI Assistant Guidelines for SOF API

This document provides comprehensive guidelines for using AI assistants (Claude, ChatGPT, Cursor, etc.) safely and productively in the SOF (Shipment Offers & Logistics) API project.

## Project Context

**SOF API** is a Node.js + Express.js backend service for shipment and logistics offer management.

### Tech Stack
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Validation**: class-validator + class-transformer
- **Testing**: Jest + ts-jest
- **Linting**: ESLint + TypeScript ESLint
- **Documentation**: Swagger/OpenAPI
- **Architecture**: Service-oriented with DTOs, middleware, and dependency injection

### Project Structure
```
api/
├── src/
│   ├── config/          # Configuration files (Swagger, etc.)
│   ├── data/            # Static data (carriers, etc.)
│   ├── dto/             # Data Transfer Objects for validation
│   ├── middleware/      # Express middleware (error handling, logging)
│   ├── routes/          # Express route handlers
│   ├── services/        # Business logic services
│   └── types/           # TypeScript type definitions
├── dist/                # Compiled JavaScript output
├── coverage/            # Test coverage reports
└── package.json         # Dependencies and scripts
```

### Available Scripts
- `npm run dev` - Start development server with ts-node
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run Jest tests
- `npm run lint` - Run ESLint

## Ground Rules for AI-Assisted Development

### 1. Code Quality & Validation
- **Always validate input** using class-validator DTOs
- **Use TypeScript strictly** - no `any` types without justification
- **Follow existing patterns** - maintain consistency with current codebase
- **Handle errors properly** - use custom error classes and global error handler
- **Write comprehensive tests** - aim for >80% coverage

### 2. Security Requirements
- **Never expose sensitive data** in logs or error messages
- **Validate all inputs** - use DTOs with class-validator decorators
- **Sanitize user input** - prevent injection attacks
- **Use environment variables** for configuration
- **Implement proper CORS** settings
- **Add rate limiting** for public endpoints

### 3. Error Handling Standards
- **Use custom error classes**: `AppError`, `AppValidationError`
- **Wrap async routes** with `asyncHandler` middleware
- **Log errors appropriately** with context (IP, user agent, timestamp)
- **Return consistent error responses** using `ErrorDto`
- **Never expose stack traces** in production

### 4. Testing Requirements
- **Write unit tests** for all services and utilities
- **Write integration tests** for API endpoints
- **Mock external dependencies** properly
- **Test error scenarios** and edge cases
- **Maintain test coverage** above 80%

### 5. Documentation Standards
- **Document all public APIs** with Swagger/OpenAPI
- **Add JSDoc comments** for complex functions
- **Update README** when adding new features
- **Document environment variables** in `.env.example`

## Architecture Conventions

### Controllers (Routes)
- **Location**: `src/routes/`
- **Pattern**: One file per resource (e.g., `offers.ts`)
- **Structure**: Use Express Router, asyncHandler wrapper
- **Validation**: Transform request body to DTOs, validate with class-validator
- **Response**: Return consistent JSON responses

```typescript
// Example route structure
router.post('/resource', asyncHandler(async (req, res) => {
  const dto = plainToClass(ResourceDto, req.body);
  const errors = await validate(dto);
  
  if (errors.length > 0) {
    throw new AppValidationError('Invalid data', errorDetails);
  }
  
  const result = await service.process(dto);
  res.json(result);
}));
```

### Services
- **Location**: `src/services/`
- **Pattern**: Business logic separated from routes
- **Dependencies**: Inject dependencies via constructor
- **Error Handling**: Throw custom errors, let middleware handle responses
- **Testing**: Fully testable with dependency injection

### DTOs (Data Transfer Objects)
- **Location**: `src/dto/`
- **Purpose**: Request/response validation and transformation
- **Validation**: Use class-validator decorators
- **Transformation**: Use class-transformer decorators
- **Export**: Re-export from `src/dto/index.ts`

### Middleware
- **Location**: `src/middleware/`
- **Global**: Error handling, logging, CORS
- **Custom**: Authentication, rate limiting, validation
- **Order**: Apply in correct order (CORS → parsing → routes → error handling)

## AI Prompt Templates ("Recipes")

### 1. Add New API Endpoint
```
Add a new [GET/POST/PUT/DELETE] endpoint for [resource] that:
- Validates input using [ResourceDto] with class-validator
- Uses [ServiceName] for business logic
- Returns [ResponseDto] format
- Includes proper error handling with asyncHandler
- Has comprehensive Jest tests
- Is documented in Swagger
- Follows existing project patterns
```

### 2. Add Input Validation
```
Create a new DTO for [purpose] that:
- Uses class-validator decorators for validation
- Includes proper TypeScript types
- Has meaningful error messages
- Is exported from dto/index.ts
- Includes JSDoc documentation
- Has corresponding tests
```

### 3. Add Middleware
```
Create middleware for [purpose] that:
- Follows Express middleware pattern (req, res, next)
- Includes proper TypeScript types
- Has error handling
- Is testable and documented
- Integrates with existing error handling system
```

### 4. Refactor Code
```
Refactor [specific code/function] to:
- Improve performance and maintainability
- Follow SOLID principles
- Add proper error handling
- Include comprehensive tests
- Maintain backward compatibility
- Update documentation
```

### 5. Write Tests
```
Write comprehensive tests for [component] that:
- Cover happy path and error scenarios
- Use proper mocking for dependencies
- Test edge cases and validation
- Achieve >80% coverage
- Follow Jest best practices
- Include integration tests if needed
```

### 6. Add Logging
```
Add structured logging for [feature] that:
- Uses consistent log format
- Includes relevant context (user, request ID, etc.)
- Logs at appropriate levels (info, warn, error)
- Doesn't expose sensitive data
- Integrates with existing request logger
```

## Code Review Checklist

### Correctness
- [ ] Code compiles without TypeScript errors
- [ ] All tests pass
- [ ] Input validation is comprehensive
- [ ] Error handling is proper
- [ ] Business logic is correct

### Security
- [ ] No sensitive data in logs
- [ ] Input sanitization implemented
- [ ] Proper authentication/authorization
- [ ] CORS configured correctly
- [ ] Rate limiting considered

### Quality
- [ ] Code follows project conventions
- [ ] No code duplication
- [ ] Proper separation of concerns
- [ ] SOLID principles followed
- [ ] Performance considerations addressed

### Tests
- [ ] Unit tests for all new code
- [ ] Integration tests for endpoints
- [ ] Error scenarios tested
- [ ] Edge cases covered
- [ ] Test coverage maintained

### Documentation
- [ ] Swagger documentation updated
- [ ] JSDoc comments added
- [ ] README updated if needed
- [ ] Environment variables documented

## Environment Variables

### Required Variables
```bash
# Server Configuration
PORT=3000
NODE_ENV=development|production

# Database (if added)
DATABASE_URL=postgresql://...

# External APIs (if added)
EXTERNAL_API_KEY=...
EXTERNAL_API_URL=...

# Security
JWT_SECRET=...
CORS_ORIGIN=http://localhost:3000
```

### Development Setup
1. Copy `env.example` to `.env`
2. Set required environment variables
3. Run `npm install`
4. Run `npm run dev`

## Coding Style Notes

### TypeScript
- Use strict mode enabled
- Prefer interfaces over types for object shapes
- Use explicit return types for public methods
- Avoid `any` type - use proper typing
- Use enums for constants

### Express.js
- Use async/await with asyncHandler wrapper
- Apply middleware in correct order
- Use Router for route organization
- Return consistent JSON responses
- Handle errors with custom error classes

### Testing
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Mock external dependencies
- Test both success and failure scenarios
- Use proper Jest matchers

## Dependency Management

### Adding Dependencies
- **Production**: Add to `dependencies` in package.json
- **Development**: Add to `devDependencies`
- **Types**: Include `@types/` packages for TypeScript
- **Security**: Check for vulnerabilities with `npm audit`

### Version Management
- Use exact versions for production dependencies
- Use caret (^) for development dependencies
- Keep dependencies up to date
- Document breaking changes

## Performance Tips

### General
- Use connection pooling for databases
- Implement caching where appropriate
- Optimize database queries
- Use compression middleware
- Monitor memory usage

### Express.js Specific
- Use `express.json({ limit: '10mb' })` for large payloads
- Implement request timeouts
- Use clustering for production
- Enable gzip compression
- Optimize middleware order

## Git & PR Conventions

### Branch Naming
- `feature/description` - New features
- `fix/description` - Bug fixes
- `refactor/description` - Code refactoring
- `test/description` - Test improvements

### Commit Messages
- Use conventional commits format
- Include scope when relevant
- Be descriptive but concise
- Reference issues when applicable

### Pull Request Process
1. Create feature branch from `main`
2. Make changes with tests
3. Run linting and tests
4. Update documentation
5. Create PR with description
6. Request review
7. Address feedback
8. Merge after approval

## Frequently Asked Questions

### Q: How do I add a new service?
A: Create a new file in `src/services/`, implement the class with proper dependency injection, add tests, and export from the service.

### Q: How do I handle database operations?
A: Currently the project uses static data. When adding a database, create a repository pattern in `src/repositories/` and inject into services.

### Q: How do I add authentication?
A: Create authentication middleware in `src/middleware/`, add JWT handling, and protect routes as needed.

### Q: How do I add rate limiting?
A: Use express-rate-limit middleware, configure it in the main app file, and test with appropriate limits.

### Q: How do I handle file uploads?
A: Use multer middleware, validate file types and sizes, and store securely with proper error handling.

### Q: How do I add monitoring?
A: Add health check endpoints, implement logging with structured format, and consider adding metrics collection.

## Safe AI Development Prompt

**Use this prompt when asking AI to make changes:**

> "Please make the requested changes to the SOF API project, ensuring you follow all established patterns, include comprehensive error handling with custom error classes, validate all inputs using DTOs with class-validator, write thorough Jest tests, update Swagger documentation, maintain TypeScript strict typing, and integrate properly with the existing middleware and service architecture. Always use the asyncHandler wrapper for routes and follow the project's security and logging standards."

---

*This document should be updated as the project evolves and new patterns emerge.*
