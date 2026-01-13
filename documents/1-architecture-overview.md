graph TB
    subgraph Client["Client Layer"]
        Browser["Web Browser<br/>(User Interface)"]
    end

    subgraph Frontend["Frontend - Next.js 14"]
        UI["React Components<br/>(ReviewForm, ReviewsList)"]
        API_Client["API Client<br/>(lib/api.ts)"]
    end

    subgraph Backend["Backend - NestJS"]
        Controller["Reviews Controller<br/>(HTTP Endpoints)"]
        Service["Reviews Service<br/>(Business Logic)"]
        Sentiment["Sentiment Service<br/>(AI Analysis)"]
        Prisma["Prisma ORM"]
    end

    subgraph Database["Database Layer"]
        SQLite["SQLite Database<br/>(dev.db)"]
    end

    Browser -->|HTTP Request| UI
    UI -->|API Calls| API_Client
    API_Client -->|"POST /analyze<br/>GET /reviews"| Controller
    Controller -->|Delegates| Service
    Service -->|Analyze Text| Sentiment
    Service -->|CRUD Operations| Prisma
    Prisma -->|SQL Queries| SQLite

    style Browser fill:#e1f5ff
    style UI fill:#bbdefb
    style API_Client fill:#90caf9
    style Controller fill:#ffecb3
    style Service fill:#ffe082
    style Sentiment fill:#ffd54f
    style Prisma fill:#c8e6c9
    style SQLite fill:#81c784