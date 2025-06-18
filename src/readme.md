# Express API with Hexagonal Architecture

A modern Express.js API template using TypeScript and Hexagonal Architecture (Ports and Adapters).

## Features

- 🏗️ **Hexagonal Architecture** - Clear separation of concerns
- 🔄 **TypeScript** - Type safety and modern JavaScript features
- 🗄️ **TypeORM** - SQL database with ORM
- 🔒 **Input Validation** - Request validation using express-validator
- 🚦 **Error Handling** - Centralized error handling
- 🧪 **Testing Ready** - Structure for unit and integration tests
- ☁️ **AWS Ready** - Deployable to AWS Lambda with API Gateway

## Architecture Overview

This template follows the Hexagonal Architecture pattern (also known as Ports and Adapters):
```bash
src/
├── domain/ # Business entities and interfaces
│ ├── entities/ # Core business models
│ └── repositories/ # Repository interfaces
├── application/ # Use cases and services
│ ├── dtos/ # Data Transfer Objects
│ ├── useCases/ # Business operations
│ └── errors/ # Application errors
└── infrastructure/ # External adapters
├── http/ # Express configuration
├── database/ # Database setup
└── repositories/# Repository implementations
```
## Getting Started

### Prerequisites

- Node.js (v14+)
- PostgreSQL or another database supported by TypeORM
- AWS CLI (for deployment)

### Installation

1. Install dependencies:
```bash
npm install
```
2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your values
```   

3. Start development server:
```bash
npm run dev
```    

## API Endpoints
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user

## Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run deploy` - Deploy to AWS (dev)
- `npm run deploy:prod` - Deploy to AWS (prod)
- `npm run offline` - Run serverless offline

## Deployment
### Local Development
```bash
npm run dev        # Express server
npm run offline    # Serverless offline
```
### AWS Deployment
1. Configure AWS credentials:
```bash
aws configure
```
2. deploy:
```bash
npm run deploy      # Development
npm run deploy:prod # Production
```
## Adding New Features
1. Create domain entity in `src/domain/entities/`
2. Create repository interface in `src/domain/repositories/`
3. Implement use cases in `src/application/useCases/`
4. Create TypeORM entity in `src/infrastructure/entities/`
5. Implement repository in `src/infrastructure/repositories/`
6. Create controllers and routes in `src/infrastructure/http/`


## License
[MIT](https://choosealicense.com/licenses/mit/)
