# Urdu Chatbot Agent

## Role
Natural language task management in Urdu, English, and Hinglish (mixed Urdu-English).

## Capabilities

### Language Understanding
- ✅ Pure Urdu: "Kal subah 9 baje meeting ka task bana do"
- ✅ Pure English: "Create a task for tomorrow morning meeting"
- ✅ Hinglish: "Tomorrow subah office jana hai, task bana do"
- ✅ Cultural context awareness (Urdu naming conventions, dates, times)

### Intent Classification
1. **create_task**: Create new task from natural language
2. **list_tasks**: List/query existing tasks
3. **update_task**: Modify existing task
4. **complete_task**: Mark task as complete
5. **delete_task**: Remove task
6. **get_suggestions**: Get AI-powered task suggestions

### Task Parsing
Extracts structured data from conversational input:
```
Input: "Kal subah 9 baje client meeting ka task bana do priority high"
Output: {
  "intent": "create_task",
  "task": {
    "title": "Client meeting",
    "due_date": "tomorrow 9am",
    "priority": "high",
    "description": null
  },
  "reply": "Ji, client meeting ka task kal subah 9 baje ke liye ban gaya! Priority high set hai."
}
```

## Technical Implementation

### Backend Integration
**File**: `backend/services/urdu_nlp.py`

**Dependencies**:
- OpenAI API (gpt-4o-mini for cost-effectiveness)
- Python 3.13+
- Urdu text processing capabilities

**System Prompt Strategy**:
```python
urdu_system_prompt = """
You are a helpful Urdu-speaking task management assistant.
You understand Urdu, English, and Hinglish (mixed Urdu-English).

Your job:
1. Understand user's intent in Urdu/Hinglish
2. Extract task details (title, description, due_date, priority)
3. Respond in the same language as the user

Cultural awareness:
- Understand Urdu time expressions: "kal" (tomorrow), "parso" (day after), "abhi" (now)
- Understand Urdu formality: "ji", "aap", "tumhara"
- Handle Roman Urdu (Urdu written in English script)

Output format: JSON with intent, task data, and reply message.
"""
```

### Frontend Integration
**File**: `frontend/components/ChatInterface.tsx`

**Features**:
- Auto RTL/LTR detection (dir="auto")
- Urdu font rendering (Noto Nastaliq Urdu)
- Example prompts in Urdu
- Chat interface with conversational history
- Visual feedback for task creation

### API Endpoint
**Endpoint**: `POST /api/chat/{user_id}/message`

**Request**:
```json
{
  "message": "Kal subah meeting ka task bana do",
  "language": "ur-PK"  // Optional: ur-PK, en-US, or auto-detect
}
```

**Response**:
```json
{
  "intent": "create_task",
  "reply": "Ji, meeting ka task kal subah ke liye ban gaya!",
  "task": {
    "id": 123,
    "title": "Meeting",
    "due_date": "2024-02-10T09:00:00Z",
    "priority": "medium",
    "completed": false
  }
}
```

## Example Conversations

### Task Creation
```
User: "Kal office jana hai, task bana do"
Agent: "Ji, office jana hai ka task kal ke liye ban gaya!"
```

### Task Listing
```
User: "Mere pending tasks kitne hain?"
Agent: "Aap ke 5 pending tasks hain aur 12 complete ho chuke hain."
```

### Task Completion
```
User: "Task 3 ko complete mark karo"
Agent: "Done! Task 3 complete ho gaya."
```

### Mixed Language (Hinglish)
```
User: "Tomorrow morning 9am pe dentist appointment ka task create karo"
Agent: "Task created! Dentist appointment - Tomorrow 9am"
```

## Cultural Context

### Urdu Time Expressions
- "kal" → tomorrow
- "parso" → day after tomorrow
- "aaj" → today
- "abhi" → now
- "subah" → morning
- "shaam" → evening
- "raat" → night

### Urdu Formality
- "ji" → respectful affirmative
- "aap" → formal "you"
- "tumhara/aapka" → your (informal/formal)

## Testing

### Test Cases
1. ✅ Create task in pure Urdu
2. ✅ Create task in pure English
3. ✅ Create task in Hinglish
4. ✅ List tasks with Urdu query
5. ✅ Complete task with Urdu command
6. ✅ Handle invalid task IDs
7. ✅ Handle ambiguous commands
8. ✅ Maintain conversation context

### Example Test
```python
# Test Urdu task creation
response = await chat_message(
    user_id="test-user",
    message="Kal subah 9 baje meeting ka task bana do"
)

assert response['intent'] == 'create_task'
assert 'meeting' in response['task']['title'].lower()
assert response['task']['due_date'] is not None
```

## Deployment

### Environment Variables
```bash
OPENAI_API_KEY=sk-...           # OpenAI API key
URDU_NLP_MODEL=gpt-4o-mini     # Model for Urdu processing
```

### Rate Limiting
- 1 request per 5 seconds per user (prevent abuse)
- Exponential backoff on OpenAI rate limits

### Monitoring
- Track intent accuracy (target: >90%)
- Monitor response latency (target: <2s)
- Log failed intent extractions for improvement

## Future Enhancements

1. **Voice Integration**: Connect with voice-command-agent for Urdu speech-to-text
2. **Context Retention**: Remember conversation history across sessions
3. **Multi-turn Dialogues**: Handle follow-up questions without repeating context
4. **Proactive Suggestions**: "Aaj ke tasks complete karne hain?"
5. **Calendar Integration**: "Is week ke sab meetings dikhao"

## Reusability

This subagent can be reused in:
- ✅ Blog platforms (Urdu content management)
- ✅ E-commerce (Urdu customer support)
- ✅ Educational apps (Urdu lesson management)
- ✅ Healthcare (Urdu appointment booking)

Just change the domain-specific vocabulary and system prompts!
