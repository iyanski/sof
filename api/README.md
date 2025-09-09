# SOF API - Shipment Offers & Logistics System

A comprehensive Express.js API for managing shipment offers and logistics operations. This API provides intelligent carrier selection, eligibility scoring, and cost optimization for shipping services.

## 🚀 Features

- **Smart Carrier Selection**: Advanced eligibility scoring system with multiple strategies
- **Cost Optimization**: Dynamic pricing calculation based on weight and carrier capabilities
- **Comprehensive Validation**: Request validation using class-validator and DTOs
- **API Documentation**: Interactive Swagger/OpenAPI documentation
- **Structured Logging**: Pino-based logging with HTTP request tracking
- **Error Handling**: Global error handling with detailed error responses
- **Graceful Shutdown**: Proper server shutdown handling
- **TypeScript**: Full TypeScript support with strict type checking

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository and navigate to the API directory:**
   ```bash
   cd api
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   PORT=3000
   NODE_ENV=development
   ```

## 🏃‍♂️ Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

### Testing
```bash
npm test
```

### Linting
```bash
npm run lint
```

## 📚 API Documentation

Once the server is running, you can access:

- **Interactive API Documentation**: `http://localhost:3000/api-docs`
- **Health Check**: `http://localhost:3000/health`
- **API Root**: `http://localhost:3000/`

## 🔗 API Endpoints

### POST /api/offers

Get shipping offers for a given shipment request.

**Request Body:**
```json
{
  "shipment": {
    "origin": {
      "street": "123 Main St",
      "city": "Stockholm",
      "postalCode": "11122",
      "country": "SE"
    },
    "destination": {
      "street": "456 Oak Ave",
      "city": "Gothenburg", 
      "postalCode": "41138",
      "country": "SE"
    },
    "packages": [
      {
        "weight": 2.5,
        "length": 30,
        "width": 20,
        "height": 15
      }
    ]
  }
}
```

**Response:**
```json
[
  {
    "carrierId": "dhl-001",
    "carrierName": "DHL",
    "cost": 55.00,
    "deliveryTime": 3,
    "eligibilityScore": 85,
    "costEfficiencyScore": 95,
    "serviceQualityScore": 78,
    "reasons": [
      "competitive pricing: 10 SEK/kg",
      "good delivery speed: 3 days"
    ],
    "isEligible": true
  }
]
```

### GET /health

Health check endpoint to verify API status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "uptime": 123.456
}
```

## 🏗️ Architecture

### Project Structure
```
src/
├── config/          # Configuration files (Swagger setup)
├── data/            # Static data (carriers, etc.)
├── dto/             # Data Transfer Objects for validation
├── middleware/      # Express middleware (error handling, etc.)
├── routes/          # API route definitions
├── services/        # Business logic services
│   └── eligibility/ # Eligibility scoring strategies
├── types/           # TypeScript type definitions
└── utils/           # Utility functions (logging, shutdown)
```

### Key Components

- **OffersService**: Main service for generating shipping offers
- **EligibilityService**: Handles carrier eligibility scoring with multiple strategies
- **Validation**: Request validation using class-validator DTOs
- **Error Handling**: Global error middleware with structured error responses
- **Logging**: Pino-based structured logging with HTTP request tracking

### Eligibility Scoring Strategies

The API uses multiple strategies to score carrier eligibility:

1. **Cost Efficiency**: Evaluates pricing competitiveness
2. **Service Quality**: Assesses delivery time and reliability
3. **Capacity Utilization**: Considers carrier capacity and load balancing
4. **Geographic Coverage**: Evaluates service area coverage

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment mode | `development` |

### Logging

The API uses Pino for structured logging with different log levels:
- **Info**: Normal operations and successful requests
- **Warn**: Client errors (4xx status codes)
- **Error**: Server errors (5xx status codes)

## 🧪 Testing

The project includes comprehensive test coverage:

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- offers.service.spec.ts
```

Test files are located alongside source files with `.spec.ts` extension.

## 📦 Dependencies

### Production Dependencies
- **express**: Web framework
- **cors**: Cross-origin resource sharing
- **class-validator**: Validation decorators
- **class-transformer**: Object transformation
- **pino**: Fast JSON logger
- **swagger-jsdoc**: API documentation generation
- **swagger-ui-express**: Swagger UI middleware

### Development Dependencies
- **typescript**: TypeScript compiler
- **jest**: Testing framework
- **eslint**: Code linting
- **ts-node**: TypeScript execution for Node.js

## 🚀 Deployment

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Setup
1. Set `NODE_ENV=production`
2. Configure appropriate `PORT`
3. Ensure all dependencies are installed
4. Build the project: `npm run build`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes and add tests
4. Run tests: `npm test`
5. Run linting: `npm run lint`
6. Commit your changes: `git commit -am 'Add new feature'`
7. Push to the branch: `git push origin feature/new-feature`
8. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Check the API documentation at `/api-docs`
- Review the test files for usage examples
- Open an issue in the repository

## 🔄 Version History

- **v1.0.0**: Initial release with core shipment offer functionality
  - Basic carrier selection
  - Eligibility scoring system
  - Swagger documentation
  - Comprehensive testing