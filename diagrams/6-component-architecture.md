# Component Architecture

```mermaid
graph TB
    subgraph Frontend["Frontend Components"]
        Page["page.tsx<br/>(Main Page Component)"]
        
        subgraph Forms["Form Components"]
            ReviewForm["ReviewForm<br/>- Text input (500 char limit)<br/>- Character counter<br/>- Submit button<br/>- Error handling"]
        end
        
        subgraph Display["Display Components"]
            ReviewsList["ReviewsList<br/>- Map reviews array<br/>- Loading state<br/>- Empty state"]
            ReviewCard["ReviewCard<br/>- Review text<br/>- Sentiment badge<br/>- Score bars<br/>- Timestamp"]
            SentimentBadge["SentimentBadge<br/>- Icon by type<br/>- Color coding<br/>- Confidence %"]
            ScoreBar["ScoreBar<br/>- Animated progress<br/>- Color gradient<br/>- Percentage label"]
        end
        
        subgraph Utils["Utilities"]
            APIClient["lib/api.ts<br/>- analyzeReview()<br/>- getReviews()"]
            Types["types/index.ts<br/>- Review<br/>- SentimentResult"]
        end
    end
    
    subgraph Backend["Backend Modules"]
        AppModule["AppModule<br/>(Root Module)"]
        
        subgraph ReviewsModule["Reviews Module"]
            ReviewsController["ReviewsController<br/>- POST /analyze<br/>- GET /reviews<br/>- Swagger docs"]
            ReviewsService["ReviewsService<br/>- analyzeAndSave()<br/>- findAll()<br/>- findById()"]
            DTOs["DTOs<br/>- AnalyzeReviewDto<br/>- ReviewResponseDto"]
        end
        
        subgraph SentimentModule["Sentiment Module"]
            SentimentService["SentimentService<br/>- analyze()<br/>- Keyword matching<br/>- Score calculation"]
        end
        
        subgraph PrismaModule["Prisma Module (Global)"]
            PrismaService["PrismaService<br/>- Database connection<br/>- Query execution"]
        end
    end
    
    Page --> ReviewForm
    Page --> ReviewsList
    ReviewsList --> ReviewCard
    ReviewCard --> SentimentBadge
    ReviewCard --> ScoreBar
    
    ReviewForm --> APIClient
    Page --> APIClient
    APIClient --> Types
    
    APIClient -->|HTTP| ReviewsController
    
    ReviewsController --> DTOs
    ReviewsController --> ReviewsService
    ReviewsService --> SentimentService
    ReviewsService --> PrismaService
    
    AppModule --> ReviewsModule
    AppModule --> SentimentModule
    AppModule --> PrismaModule
    
    style Page fill:#e3f2fd
    style ReviewForm fill:#bbdefb
    style ReviewsList fill:#90caf9
    style ReviewCard fill:#64b5f6
    style APIClient fill:#42a5f5
    
    style ReviewsController fill:#fff9c4
    style ReviewsService fill:#fff176
    style SentimentService fill:#ffd54f
    
    style PrismaService fill:#c8e6c9
    style AppModule fill:#a5d6a7
```

## Component Responsibilities

### Frontend Components

#### **page.tsx** (Main Container)
- Manages global state (reviews list)
- Handles data fetching on mount
- Orchestrates child components
- Implements refresh functionality

#### **ReviewForm**
- User input collection
- Client-side validation
- Character counting
- API call to submit review
- Loading and error states

#### **ReviewsList**
- Renders array of reviews
- Loading skeleton/spinner
- Empty state when no reviews
- Passes data to ReviewCard

#### **ReviewCard**
- Displays individual review
- Shows sentiment badge
- Renders score breakdown bars
- Formats timestamp

#### **SentimentBadge**
- Color-coded by sentiment type
- Icon representation
- Confidence percentage display
- Responsive sizing

#### **ScoreBar**
- Animated progress bar
- Color gradients
- Percentage label
- Staggered animation delays

### Backend Modules

#### **AppModule** (Root)
- Imports all feature modules
- Configures global providers
- Sets up middleware

#### **ReviewsModule**
- Feature module for reviews
- Exports ReviewsController and ReviewsService
- Imports SentimentModule

#### **ReviewsController**
- HTTP endpoint handlers
- Request validation
- Swagger documentation
- Response formatting

#### **ReviewsService**
- Business logic
- Coordinates between services
- Database operations via Prisma
- Data transformation

#### **SentimentModule**
- Provides sentiment analysis
- Encapsulates AI logic
- Stateless service

#### **SentimentService**
- Text analysis algorithm
- Keyword matching
- Score calculation
- Confidence determination

#### **PrismaModule** (Global)
- Database connection management
- Provides PrismaService globally
- Lifecycle hooks for connect/disconnect

#### **PrismaService**
- Extends PrismaClient
- Database query execution
- Connection pooling
- Transaction support
