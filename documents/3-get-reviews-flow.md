# Get Reviews Flow (Sequence Diagram)

```mermaid
sequenceDiagram
    actor User
    participant Frontend as Next.js Frontend
    participant API as Reviews Controller
    participant Service as Reviews Service
    participant DB as SQLite Database

    User->>Frontend: Open application
    
    Frontend->>Frontend: useEffect() triggers
    Frontend->>API: GET /reviews
    
    API->>Service: findAll()
    
    Service->>DB: SELECT * FROM Review<br/>ORDER BY createdAt DESC
    
    alt Reviews Exist
        DB-->>Service: List of reviews
        Service-->>API: ReviewResponseDto[]
        API-->>Frontend: 200 OK<br/>{reviews[], total}
        Frontend->>Frontend: setReviews(data.reviews)
        Frontend-->>User: Display reviews list<br/>(sorted newest first)
    else No Reviews
        DB-->>Service: Empty array
        Service-->>API: []
        API-->>Frontend: 200 OK<br/>{reviews: [], total: 0}
        Frontend-->>User: Show empty state<br/>("No reviews yet")
    end

    Note over User,DB: User can also manually refresh

    User->>Frontend: Click refresh button
    Frontend->>API: GET /reviews
    API->>Service: findAll()
    Service->>DB: SELECT * FROM Review<br/>ORDER BY createdAt DESC
    DB-->>Service: Updated list
    Service-->>API: ReviewResponseDto[]
    API-->>Frontend: 200 OK<br/>{reviews[], total}
    Frontend-->>User: Display updated list
```

## Flow Steps Explanation

### 1. Initial Load
- Frontend component mounts
- `useEffect` hook triggers on mount
- Automatically fetch all reviews

### 2. API Request
- Send GET request to `/reviews` endpoint
- No parameters required
- Handle loading state

### 3. Database Query
- Fetch all reviews from database
- Order by `createdAt` descending (newest first)
- Include all fields (sentiment scores, confidence, etc.)

### 4. Response Handling
- Backend returns array of reviews with total count
- Frontend updates state with new data
- Reviews displayed in cards with:
  - Sentiment badge (colored by type)
  - Original review text
  - Confidence percentage
  - Score breakdown bars
  - Timestamp

### 5. Empty State
- If no reviews exist, show friendly empty state
- Display message encouraging user to submit first review
- Show icon to indicate no data

### 6. Manual Refresh
- User can click refresh button
- Fetches latest data from database
- Updates UI with any new reviews
