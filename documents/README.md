# Diagrams Documentation

This folder contains comprehensive diagrams documenting the Customer Review Sentiment Analyzer application architecture and workflows.

## Available Diagrams

### 1. Architecture Overview
**File**: `1-architecture-overview.md`

High-level system architecture showing:
- Client, Frontend, Backend, and Database layers
- Technology stack for each layer
- Component relationships and data flow

### 2. Analyze Review Flow
**File**: `2-analyze-review-flow.md`

Detailed sequence diagram of the review analysis process:
- User input and validation
- API request/response flow
- Sentiment analysis steps
- Database operations
- UI updates

### 3. Get Reviews Flow
**File**: `3-get-reviews-flow.md`

Sequence diagram for retrieving reviews:
- Initial load on page mount
- Database query and ordering
- Empty state handling
- Manual refresh functionality

### 4. Sentiment Analysis Algorithm
**File**: `4-sentiment-analysis-algorithm.md`

Flowchart of the AI sentiment analysis process:
- Text tokenization
- Keyword matching (positive, negative, neutral)
- Negation handling
- Intensifier application
- Score calculation and normalization
- Confidence determination

### 5. Database Schema
**File**: `5-database-schema.md`

Entity-Relationship diagram showing:
- Review table structure
- Field types and constraints
- Sample data
- Prisma schema definition

### 6. Component Architecture
**File**: `6-component-architecture.md`

Component hierarchy and relationships:
- Frontend React components
- Backend NestJS modules
- Services and their responsibilities
- Data flow between components

## Viewing Diagrams

### In GitHub
GitHub automatically renders Mermaid diagrams in markdown files.

### In VS Code
Install the **Markdown Preview Mermaid Support** extension:
```bash
code --install-extension bierner.markdown-mermaid
```

### Online Viewers
- [Mermaid Live Editor](https://mermaid.live/)
- [Mermaid Chart](https://www.mermaidchart.com/)

## Diagram Types Used

- **Flowchart** (`graph TB/LR`): Architecture and algorithm flows
- **Sequence Diagram** (`sequenceDiagram`): API request/response flows
- **Entity-Relationship** (`erDiagram`): Database schema

## Contributing

When updating the application:
1. Update relevant diagrams to reflect changes
2. Maintain consistent styling and naming
3. Add explanatory notes for complex flows
4. Keep diagrams in sync with actual implementation
