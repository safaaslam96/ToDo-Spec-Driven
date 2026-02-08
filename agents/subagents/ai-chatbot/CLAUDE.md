# AI Chatbot Subagent — The Evolution of Todo

**Purpose**: Natural language interface for task management  
**Phase**: III — AI-Powered Enhancements  
**Inherits**: Base Agent + AI/MCP Integration Specialist  
**MCP Servers**: OpenAI (for NLP), Spec-Kit Plus (for operations)

---

## Core Responsibilities

1. **Natural Language Understanding**: Parse user intent from conversational input
2. **Task Operations**: Execute CRUD operations via natural language
3. **Smart Suggestions**: AI-powered task recommendations
4. **Context Management**: Remember user preferences and conversation history
5. **Multi-Turn Dialogues**: Handle complex, multi-step conversations

---

## Specialized Knowledge

### Intent Classification
The chatbot classifies user messages into intents:

| Intent | User Phrases | Action |
|--------|--------------|--------|
| `list_tasks` | "show my tasks", "what's on my list" | `taskApi.list()` |
| `create_task` | "add task", "remind me to" | `taskApi.create()` |
| `complete_task` | "mark done", "finish", "complete" | `taskApi.toggleComplete()` |
| `update_task` | "change", "edit", "update" | `taskApi.update()` |
| `delete_task` | "remove", "delete", "cancel" | `taskApi.delete()` |
| `suggest_tasks` | "what should I do", "suggestions" | AI analysis |
| `get_help` | "help", "how do I", "what can you do" | Show capabilities |

### Context Variables
```typescript
interface ChatbotContext {
  user_id: string;
  current_task?: Task;
  conversation_history: Message[];
  user_preferences: {
    default_priority: "low" | "medium" | "high";
    preferred_sort: "created" | "title";
    timezone: string;
  };
  last_action: string;
  pending_confirmation?: {
    action: string;
    task_data: any;
  };
}
```

---

## Conversation Patterns

### Pattern 1: Simple Task Creation
```
User: "Remind me to buy groceries"
Bot: [Classify: create_task]
     [Extract: title="Buy groceries"]
     [Action: taskApi.create({ title: "Buy groceries" })]
Response: "✅ Added task: Buy groceries. Would you like to set a priority?"
```

### Pattern 2: Multi-Turn Creation
```
User: "Add a new task"
Bot: "Sure! What would you like to be reminded about?"

User: "Finish the report"
Bot: "Got it. What priority should I set? (low/medium/high)"

User: "High"
Bot: [Action: taskApi.create({ title: "Finish the report", priority: "high" })]
Response: "✅ Created high priority task: Finish the report"
```

### Pattern 3: Contextual Operations
```
User: "Show my high priority tasks"
Bot: [Action: taskApi.list({ status: "pending", priority: "high" })]
Response: "You have 3 high priority tasks:
1. Finish the report (pending)
2. Call the client (pending)
3. Review code (pending)
Would you like to work on one?"

User: "Mark the first one done"
Bot: [Context: remember task ID from list]
     [Action: taskApi.toggleComplete(task_id)]
Response: "✅ Marked 'Finish the report' as complete! 🎉"
```

### Pattern 4: Smart Suggestions
```
User: "What should I do next?"
Bot: [Action: taskApi.list()]
     [AI Analysis via OpenAI MCP]
     [Factors: priority, creation date, user patterns]
Response: "Based on your priorities, I suggest:
1. Call the client (high priority, added 2 days ago)
2. Review code (medium priority, blocking others)
3. Update documentation (low priority, quick win)
Which would you like to tackle first?"
```

---

## Integration Points

### API Integration
```typescript
// chatbot uses existing API client
import { taskApi } from "@/lib/api-client";

async function executeTaskOperation(intent: string, data: any) {
  switch (intent) {
    case "list_tasks":
      return await taskApi.list(data.filters);
    case "create_task":
      return await taskApi.create(data);
    case "complete_task":
      return await taskApi.toggleComplete(data.task_id);
    // ... other intents
  }
}
```

### OpenAI MCP Integration
```typescript
// Use OpenAI MCP for NLP
async function classifyIntent(userMessage: string): Promise<Intent> {
  const response = await openaiMCP.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage }
    ]
  });
  return parseIntent(response.choices[0].message.content);
}
```

### Memory Management
```typescript
// Store conversation in subagent memory
interface ConversationLog {
  timestamp: string;
  user_message: string;
  bot_response: string;
  intent: string;
  action: string;
  success: boolean;
}

// Write to: agents/subagents/ai-chatbot/memory/conversations.md
```

---

## Response Generation

### Response Templates
Located in `@agents/subagents/ai-chatbot/prompts/responses.md`:

```markdown
## Success Responses
- Task Created: "✅ Added task: {title}. {optional_next_step}"
- Task Completed: "✅ Marked '{title}' as complete! 🎉"
- Task Updated: "✅ Updated '{title}' with {changes}"
- Task Deleted: "🗑️ Removed '{title}' from your list"

## Question Responses
- Clarification: "Just to confirm, you want to {action}?"
- Missing Info: "I need a bit more info. {question}"
- Confirmation: "Should I proceed with {action}?"

## Error Responses
- Not Found: "I couldn't find that task. Can you provide more details?"
- API Error: "Oops, something went wrong. Let me try that again."
- Ambiguous: "I'm not sure what you mean. Did you want to {option1} or {option2}?"
```

### Natural Language Generation
```typescript
function generateResponse(intent: string, result: any, context: ChatbotContext): string {
  // Use OpenAI MCP for natural, contextual responses
  const template = getResponseTemplate(intent);
  return fillTemplate(template, result, context);
}
```

---

## Learning System

### What to Learn
Store in `@agents/subagents/ai-chatbot/memory/learning.md`:

1. **Successful Patterns**: Conversation flows that worked well
2. **Failed Interactions**: Misunderstandings and how they were resolved
3. **User Preferences**: Common user behaviors and preferences
4. **Intent Improvements**: Better ways to classify specific phrases

### Learning Format
```markdown
## [Date] Learning Entry

**Scenario**: User said "X", chatbot understood "Y"
**Issue**: Misclassification / Missing intent / Unclear response
**Resolution**: Updated intent rules / Added new template / Clarified
**Impact**: Improved accuracy from X% to Y%

**Tags**: #intent-classification #user-preference #error-handling
```

---

## Testing Strategy

### Test Conversations
Located in `@agents/subagents/ai-chatbot/prompts/examples.md`:

```yaml
Test Cases:
  - name: "Simple task creation"
    input: "Add buy milk to my list"
    expected_intent: "create_task"
    expected_action: taskApi.create({ title: "Buy milk" })
    expected_response: "✅ Added task: Buy milk"

  - name: "Contextual completion"
    setup:
      - list_tasks shows task ID 42: "Buy milk"
    input: "Mark that one done"
    expected_intent: "complete_task"
    expected_action: taskApi.toggleComplete(42)
    expected_response: "✅ Marked 'Buy milk' as complete!"

  - name: "Ambiguous request"
    input: "Show me stuff"
    expected_intent: "clarification_needed"
    expected_response: "Would you like to see your tasks, or something else?"
```

### Success Metrics
- **Intent Accuracy**: 90%+ correct classification
- **Task Success Rate**: 95%+ operations complete successfully
- **User Satisfaction**: 4.5+ / 5 average rating
- **Response Time**: <2s per interaction

---

## Error Handling

### Common Errors
1. **Misclassified Intent**: Ask clarifying question
2. **Missing Context**: Request more information
3. **API Failure**: Retry once, then notify user
4. **Ambiguous Request**: Offer multiple interpretations

### Error Recovery
```typescript
async function handleError(error: Error, context: ChatbotContext): Promise<string> {
  // Log to memory/failures.md
  logFailure(error, context);
  
  // Determine recovery strategy
  if (error instanceof APIError) {
    return "I couldn't complete that action. Would you like me to try again?";
  } else if (error instanceof AmbiguousIntentError) {
    return `Did you mean: ${error.options.join(" or ")}?`;
  } else {
    return "I'm not sure I understood. Can you rephrase that?";
  }
}
```

---

## Deployment (Phase III)

### Frontend Integration
```typescript
// components/chat/Chatbot.tsx
"use client";

import { useState } from "react";
import { ChatbotSubagent } from "@/lib/chatbot-subagent";

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const chatbot = new ChatbotSubagent();

  const handleSend = async () => {
    const response = await chatbot.processMessage(input, context);
    setMessages([...messages, 
      { role: "user", content: input },
      { role: "assistant", content: response }
    ]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat messages */}
      {/* Input box */}
    </div>
  );
}
```

### Backend Support (if needed)
```python
# backend/app/ai/chatbot.py
from openai import AsyncOpenAI

class ChatbotSubagent:
    def __init__(self):
        self.client = AsyncOpenAI()
        self.system_prompt = load_system_prompt()
    
    async def classify_intent(self, message: str) -> str:
        response = await self.client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": self.system_prompt},
                {"role": "user", "content": message}
            ]
        )
        return response.choices[0].message.content
```

---

## Quick Reference

**Location**: `@agents/subagents/ai-chatbot/`  
**Inherits**: `@agents/CLAUDE.md` + `@agents/skills/ai-mcp-integration.md`  
**MCP Servers**: OpenAI (NLP), Spec-Kit Plus (operations)  
**Memory**: `@agents/subagents/ai-chatbot/memory/`  
**Prompts**: `@agents/subagents/ai-chatbot/prompts/`  
**Context**: `@agents/subagents/ai-chatbot/context/`

**Test**: Define conversations in `prompts/examples.md`  
**Learn**: Document patterns in `memory/learning.md`  
**Improve**: Update intents based on failures

**Phase III Goal**: Natural language task management with 90%+ intent accuracy and 4.5+ user satisfaction
