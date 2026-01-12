# Sentiment Analysis Algorithm

```mermaid
flowchart TD
    Start([Input: Review Text]) --> Tokenize[Tokenize Text<br/>Split into words]
    
    Tokenize --> InitScores[Initialize Scores<br/>positive = 0<br/>negative = 0<br/>neutral = 0]
    
    InitScores --> Loop{For each<br/>word}
    
    Loop -->|Next word| CheckNegation[Check Previous 2 Words<br/>for Negation<br/>'not', 'no', "n't"]
    
    CheckNegation --> CheckIntensifier[Check Previous Word<br/>for Intensifier<br/>'very', 'really', 'extremely']
    
    CheckIntensifier --> MatchKeyword{Match<br/>Keyword?}
    
    MatchKeyword -->|Positive| IsNegatedPos{Negated?}
    IsNegatedPos -->|Yes| AddNegScore1[Add to Negative Score<br/>score * 0.8]
    IsNegatedPos -->|No| AddPosScore[Add to Positive Score<br/>score * intensifier]
    
    MatchKeyword -->|Negative| IsNegatedNeg{Negated?}
    IsNegatedNeg -->|Yes| AddPosScore2[Add to Positive Score<br/>score * 0.6]
    IsNegatedNeg -->|No| AddNegScore2[Add to Negative Score<br/>score * intensifier]
    
    MatchKeyword -->|Neutral| AddNeutralScore[Add to Neutral Score<br/>score * intensifier]
    
    MatchKeyword -->|None| NextWord
    
    AddNegScore1 --> NextWord[Continue to<br/>next word]
    AddPosScore --> NextWord
    AddPosScore2 --> NextWord
    AddNegScore2 --> NextWord
    AddNeutralScore --> NextWord
    
    NextWord --> Loop
    
    Loop -->|Done| CheckEmpty{Any keywords<br/>found?}
    
    CheckEmpty -->|No| ReturnNeutral[Return NEUTRAL<br/>confidence: 0.5<br/>equal scores]
    
    CheckEmpty -->|Yes| Normalize[Normalize Scores<br/>Sum = positive + negative + neutral<br/>Each score /= Sum]
    
    Normalize --> CheckMixed{Scores<br/>very close?}
    
    CheckMixed -->|Yes<br/>diff < 0.15| BoostNeutral[Boost Neutral Score<br/>neutral *= 1.5]
    
    CheckMixed -->|No| EnsureSum
    
    BoostNeutral --> EnsureSum[Ensure Sum = 1.0<br/>Redistribute scores]
    
    EnsureSum --> DetermineSentiment{Determine<br/>Sentiment}
    
    DetermineSentiment -->|neutral > others| LabelNeutral[Sentiment: NEUTRAL<br/>confidence = neutral score]
    
    DetermineSentiment -->|positive > negative| LabelPositive[Sentiment: POSITIVE<br/>confidence = positive score]
    
    DetermineSentiment -->|negative > positive| LabelNegative[Sentiment: NEGATIVE<br/>confidence = negative score]
    
    LabelNeutral --> AdjustConfidence[Adjust Confidence<br/>Based on keyword density<br/>confidence *= (1 + density * 0.5)]
    
    LabelPositive --> AdjustConfidence
    LabelNegative --> AdjustConfidence
    ReturnNeutral --> End
    
    AdjustConfidence --> End([Return: SentimentResult<br/>{sentiment, confidence, scores}])
    
    style Start fill:#e3f2fd
    style End fill:#e8f5e9
    style DetermineSentiment fill:#fff3e0
    style ReturnNeutral fill:#fff9c4
    style LabelPositive fill:#c8e6c9
    style LabelNegative fill:#ffcdd2
    style LabelNeutral fill:#ffe082
```

## Algorithm Details

### Keyword Dictionaries

**Positive Keywords** (40+ words with weights 0.4-0.9):
- High weight (0.85-0.9): amazing, excellent, fantastic, perfect, outstanding
- Medium weight (0.7-0.8): great, love, best, delicious, recommend
- Lower weight (0.6-0.7): good, friendly, helpful, nice, clean

**Negative Keywords** (30+ words with weights 0.5-0.9):
- High weight (0.85-0.9): terrible, awful, horrible, worst, disgusting
- Medium weight (0.75-0.85): bad, rude, disappointing, waste, avoid
- Lower weight (0.5-0.7): poor, slow, cold, mediocre, bland

**Neutral Keywords** (weights around 0.5):
- okay, average, decent, fine, normal, standard

### Special Handling

**Negation Words**: not, no, n't, never, neither, hardly, barely
- Flips sentiment of next keyword
- "not good" → negative score
- "not bad" → positive score (reduced)

**Intensifiers**: very, really, extremely, absolutely, highly, so, too
- Multiplies keyword weight by 1.1-1.4
- "very good" → higher positive score
- "extremely bad" → higher negative score

### Score Calculation

1. **Raw Scores**: Sum of weighted keyword matches
2. **Normalization**: Divide each score by total sum
3. **Mixed Review Boost**: If positive/negative are close (< 0.15 difference), boost neutral
4. **Confidence Adjustment**: Scale by keyword density in text
5. **Bounds**: Ensure confidence between 0.5 and 0.99

### Example Analysis

**Input**: "Amazing pizza! Great service and fast delivery. Highly recommend!"

**Processing**:
- "amazing" → +0.9 (positive)
- "great" → +0.8 (positive)  
- "fast" → +0.6 (positive)
- "highly" → intensifier (1.3x)
- "recommend" → +0.75 * 1.3 = +0.975 (positive)

**Result**:
- Sentiment: POSITIVE
- Confidence: 0.89
- Scores: {positive: 0.89, negative: 0.03, neutral: 0.08}
