# Analyze Review Flow (Sequence Diagram)

```mermaid
sequenceDiagram
    actor User
    participant Frontend as Next.js Frontend
    participant API as Reviews Controller
    participant Service as Reviews Service
    participant Sentiment as Sentiment Service
    participant DB as SQLite Database

    User->>Frontend: Enter review text<br/>(max 500 chars)
    Frontend->>Frontend: Validate input<br/>(client-side)
    
    Frontend->>API: POST /analyze<br/>{text: "Review text"}
    
    API->>API: Validate DTO<br/>(class-validator)
    
    alt Invalid Input
        API-->>Frontend: 400 Bad Request<br/>{error message}
        Frontend-->>User: Show error message
    end
    
    API->>Service: analyzeAndSave(dto)
    
    Service->>Sentiment: analyze(text)
    
    Sentiment->>Sentiment: 1. Tokenize text<br/>2. Identify keywords
    Sentiment->>Sentiment: 3. Check negations<br/>4. Apply intensifiers
    Sentiment->>Sentiment: 5. Calculate scores<br/>6. Normalize results
    
    Sentiment-->>Service: SentimentResult<br/>{sentiment, confidence, scores}
    
    Service->>DB: INSERT Review<br/>(text, sentiment, scores)
    DB-->>Service: Created Review<br/>(with ID, timestamps)
    
    Service-->>API: ReviewResponseDto
    API-->>Frontend: 201 Created<br/>{review, message}
    
    Frontend->>Frontend: Update reviews list<br/>(prepend new review)
    Frontend-->>User: Display sentiment result<br/>(badge, scores, confidence)
```

## Flow Steps Explanation

### 1. User Input
- User types review text in textarea
- Character counter shows remaining characters (500 max)
- Submit button enabled when input is valid

### 2. Frontend Validation
- Check text is not empty
- Check text doesn't exceed 500 characters
- Show error message if validation fails

### 3. API Request
- Send POST request to `/analyze` endpoint
- Include review text in request body
- Handle loading state during request

### 4. Backend Validation
- NestJS ValidationPipe validates DTO
- Checks all constraints (@IsString, @MaxLength, etc.)
- Returns 400 error if validation fails

### 5. Sentiment Analysis
- **Tokenization**: Split text into words
- **Keyword Matching**: Compare against positive/negative/neutral dictionaries
- **Negation Handling**: Detect negation words and flip sentiment
- **Intensifier Application**: Apply multipliers for words like "very", "really"
- **Score Calculation**: Weighted sum of keyword matches
- **Normalization**: Ensure scores sum to 1.0

### 6. Database Storage
- Save review with sentiment results
- Auto-generate ID and timestamps
- Store all score details

### 7. Response & Display
- Return review with full sentiment analysis
- Frontend updates UI immediately
- Show sentiment badge with color coding
- Display confidence score and detailed breakdown
