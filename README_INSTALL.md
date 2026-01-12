# Installation & Running Guide

## System Requirements

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

## Project Structure

```
aig-fullstack-assessment/
├── backend/          # NestJS API server
├── frontend/         # Next.js web application
└── README.md
```

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
echo 'DATABASE_URL="file:./dev.db"' > .env
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

✅ Backend will run at: **http://localhost:4000**  
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

## ⚡ Quick Start (Both Services)

Open 2 terminals and run:

**Terminal 1 - Backend:**
```bash
cd backend
npm install
echo 'DATABASE_URL="file:./dev.db"' > .env
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

### Frontend

| Variable              | Description        | Default                   |
|-----------------------|--------------------|---------------------------|
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

Make sure Backend is running on port 4000 and Frontend on port 3000.

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
- Frontend uses Tailwind CSS with glassmorphism design
- API documentation available via Swagger at `/api-docs`

## 📊 Diagrams

The `diagrams/` folder contains comprehensive Mermaid diagrams documenting:

1. **Architecture Overview** - System architecture and tech stack
2. **Analyze Review Flow** - Sequence diagram for sentiment analysis
3. **Get Reviews Flow** - Sequence diagram for fetching reviews
4. **Sentiment Analysis Algorithm** - Detailed algorithm flowchart
5. **Database Schema** - ER diagram of database structure
6. **Component Architecture** - Frontend and backend component hierarchy

View these diagrams on GitHub or use a Mermaid viewer extension in your IDE.

---

**Happy coding! 🚀**
