# Customer Review Sentiment Analyzer - Fullstack Assessment

Create a customer review sentiment analysis service using Typescript (and/or Python) for sentiment analysis AI integration. Focus on API design, database modeling, and AI service consumption for business review classification.

## Requirements

### Core Features

**1. Backend API**
- `POST /analyze` - Submit customer review for sentiment analysis
- `GET /reviews` - Get analyzed reviews.

**2. Frontend Interface (Next.js)**
- Review submission form with review text (max 500 chars)
- Display sentiment results (Positive/Negative/Neutral + confidence score)

### Sentiment Analysis Specification

**Input**: Customer review text (string)

**Output**:
```typescript
interface SentimentResult {
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  confidence: number; // 0.0 to 1.0
  scores: {
    positive: number;
    negative: number;
    neutral: number;
  };
}
```

### Suggested Technology Stack
- **Frontend**: Next.js 14+ with TypeScript
- **Backend**: NestJS/FastAPI
- **Database**: SQLite with Prisma ORM
- **Testing**: Jest/Vitest for API tests (Optional: Playwright for E2E)

### Testing Requirements
**Backend Tests (Jest/Vitest)**:
- POST `/analyze` endpoint with valid/invalid inputs/outputs
- GET `/reviews` endpoint with valid/invalid inputs/outputs
- Database operations and data validation
- Error handling for service failures

**Minimum Coverage**: 80% for backend logic

## Sentiment Analysis Test Cases

### Test Case 1: Positive Review

**Input:** "Amazing pizza! Great service and fast delivery. Highly recommend!"

**Expected:** Sentiment: "POSITIVE", Confidence: >0.8.

### Test Case 2: Negative Review
**Input:** "Terrible coffee, rude staff, and overpriced. Never going back."

**Expected:** Sentiment: "NEGATIVE", Confidence: >0.7.

### Test Case 3: Neutral Review

**Input:** "Restaurant ABC", Review: "Food was okay, nothing special. Service was average."

**Expected:** Sentiment: "NEUTRAL", Confidence: >0.6.

Notes: Feel free to add more test cases.

---

## Installation & Running Guide

### System Requirements

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Docker** (optional): v20.0.0 or higher and Docker Compose v2.0.0 or higher

### Project Structure

```
sentiment_analyzer/
├── backend/          # NestJS API server
├── frontend/         # Next.js web application
├── documents/        # Documentation and diagrams
└── README.md
```

---

## 🚀 Quick Start

### Option 1: Run Both Services Together (Recommended)

From the root directory:

```bash
# Install all dependencies
npm run install:all

# Setup backend database
cd backend
echo 'DATABASE_URL="file:./dev.db"' > .env
npx prisma generate
npx prisma db push
cd ..

# Run both services in parallel
npm run dev
```

✅ Backend will run at: **http://localhost:4000**  
✅ Frontend will run at: **http://localhost:3000**  
📚 Swagger API Documentation: **http://localhost:4000/api-docs**

### Option 2: Run Services Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm install
cp .env.example .env || echo 'DATABASE_URL="file:./dev.db"
CORS_ORIGIN="http://localhost:3000"
PORT=4000' > .env
npx prisma generate
npx prisma db push
npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### Option 3: Run with Docker (Recommended for Production)

Using Docker Compose to run both services in containers:

**Prerequisites:**
- Docker and Docker Compose installed on your system
- Ensure ports 3000 and 4000 are available

**Steps:**

1. **Build and start all services:**
```bash
docker-compose up --build
```

2. **Run in detached mode (background):**
```bash
docker-compose up -d --build
```

3. **View logs:**
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

4. **Stop services:**
```bash
docker-compose down
```

5. **Stop and remove volumes (clean reset):**
```bash
docker-compose down -v
```

6. **Rebuild after code changes:**
```bash
docker-compose up --build
```

**Initial Database Setup:**

On first run, you need to initialize the database. The Prisma Client is already generated during the Docker build, but you need to push the schema:

```bash
# Start backend service only
docker-compose up backend -d

# Initialize database schema
docker-compose exec backend npx prisma db push

# Now start all services
docker-compose up -d
```

**Note:** The database file (`dev.db`) is stored in `./backend/prisma/` directory and is persisted via Docker volume. If you want to reset the database, simply delete this file and run `prisma db push` again.

**Environment Variables:**

You can customize environment variables by creating a `.env` file in the root directory or modifying `docker-compose.yml`:

```yaml
# docker-compose.yml
environment:
  - DATABASE_URL=file:./prisma/dev.db
  - CORS_ORIGIN=http://localhost:3000
  - PORT=4000
  - NEXT_PUBLIC_API_URL=http://localhost:4000
```

✅ Backend will run at: **http://localhost:4000**  
✅ Frontend will run at: **http://localhost:3000**  
📚 Swagger API Documentation: **http://localhost:4000/api-docs**

**Docker Commands Reference:**

| Command | Description |
|---------|-------------|
| `docker-compose up` | Start all services |
| `docker-compose up -d` | Start in background |
| `docker-compose up --build` | Rebuild and start |
| `docker-compose down` | Stop all services |
| `docker-compose down -v` | Stop and remove volumes |
| `docker-compose logs -f` | View logs (follow mode) |
| `docker-compose ps` | List running containers |
| `docker-compose restart` | Restart all services |
| `docker-compose exec backend <cmd>` | Execute command in backend container |
| `docker-compose exec frontend <cmd>` | Execute command in frontend container |

---

## 🚀 Backend Setup

### Step 1: Navigate to backend directory

```bash
cd backend
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Create environment file

Create a `.env` file in the `backend/` directory:

```bash
cp .env.example .env
# Or manually create:
echo 'DATABASE_URL="file:./dev.db"
CORS_ORIGIN="http://localhost:3000,http://localhost:3001"
PORT=4000' > .env
```

### Step 4: Initialize database

```bash
npx prisma generate
npx prisma db push
```

### Step 5: Start the server

**Development mode (with hot reload):**
```bash
npm run start:dev
```

**Production mode:**
```bash
npm run build
npm run start:prod
```

✅ Backend will run at: **http://localhost:4000** (or port specified in .env)  
📚 Swagger API Documentation: **http://localhost:4000/api-docs**

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:cov
```

---

## 🎨 Frontend Setup

### Step 1: Navigate to frontend directory

```bash
cd frontend
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Start the application

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm run build
npm run start
```

✅ Frontend will run at: **http://localhost:3000**

---

## 📚 API Documentation (Swagger)

The backend includes interactive API documentation powered by Swagger/OpenAPI.

**Access Swagger UI**: http://localhost:4000/api-docs

### Features
- 🔍 Interactive API explorer
- 📝 Detailed endpoint documentation
- 🧪 Test API requests directly from browser
- 📊 Request/response schemas
- 💡 Example payloads for each endpoint

### Using Swagger UI
1. Start the backend server
2. Open http://localhost:4000/api-docs in your browser
3. Explore available endpoints
4. Click "Try it out" to test requests
5. View response examples and schemas

---

## 📡 API Endpoints

| Method | Endpoint    | Description                          |
|--------|-------------|--------------------------------------|
| POST   | `/analyze`  | Submit a review for sentiment analysis |
| GET    | `/reviews`  | Get list of analyzed reviews          |

### API Usage Examples

**POST /analyze**
```bash
curl -X POST http://localhost:4000/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "Amazing pizza! Great service and fast delivery."}'
```

**Response:**
```json
{
  "review": {
    "id": 1,
    "text": "Amazing pizza! Great service and fast delivery.",
    "sentiment": "POSITIVE",
    "confidence": 0.89,
    "scores": {
      "positive": 0.89,
      "negative": 0.03,
      "neutral": 0.08
    },
    "createdAt": "2024-01-10T10:30:00.000Z"
  },
  "message": "Review analyzed successfully"
}
```

**GET /reviews**
```bash
curl http://localhost:4000/reviews
```

---

## 🔧 Environment Configuration

### Backend (.env)

| Variable      | Description              | Default           |
|---------------|--------------------------|-------------------|
| DATABASE_URL  | SQLite database path     | `file:./dev.db`   |
| CORS_ORIGIN   | Allowed CORS origins (comma-separated) | `http://localhost:3000` |
| PORT          | Server port              | `4000`            |

See `backend/.env.example` for template.

### Frontend

| Variable              | Description        | Default                   |
|----------------------|--------------------|---------------------------|
| NEXT_PUBLIC_API_URL   | Backend API URL    | `http://localhost:4000`   |

---

## 🐛 Troubleshooting

### 1. Error "Cannot find module '@prisma/client'"

```bash
cd backend
npx prisma generate
```

### 2. Error "Database does not exist"

```bash
cd backend
npx prisma db push
```

### 3. CORS error when calling API from Frontend

Make sure Backend is running and CORS_ORIGIN in `.env` includes the frontend URL.

### 4. Port already in use

Check and kill the process using the port:

```bash
# Check port 4000
lsof -i :4000

# Check port 3000
lsof -i :3000

# Kill process by PID
kill -9 <PID>
```

---

## 📊 Test Coverage

Backend achieves **>80%** coverage as required:

```
-------------------------|---------|----------|---------|---------|
File                     | % Stmts | % Branch | % Funcs | % Lines |
-------------------------|---------|----------|---------|---------|
All files                |   88.46 |    86.84 |   84.61 |   87.50 |
-------------------------|---------|----------|---------|---------|
```

---

## 📝 Notes

- Backend uses SQLite for simplified setup (no database server required)
- Sentiment analysis uses keyword-based algorithm with weighted scoring
- Keywords are stored in database and can be modified without rebuilding
- Frontend uses Tailwind CSS with glassmorphism design
- API documentation available via Swagger at `/api-docs`

## 📊 Documentation

The `documents/` folder contains comprehensive Mermaid diagrams documenting:

1. **Architecture Overview** - System architecture and tech stack
2. **Analyze Review Flow** - Sequence diagram for sentiment analysis
3. **Get Reviews Flow** - Sequence diagram for fetching reviews
4. **Sentiment Analysis Algorithm** - Detailed algorithm flowchart
5. **Database Schema** - ER diagram of database structure
6. **Component Architecture** - Frontend and backend component hierarchy

View these diagrams on GitHub or use a Mermaid viewer extension in your IDE.

---

**Happy coding! 🚀**
