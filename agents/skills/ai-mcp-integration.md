# AI & MCP Integration Specialist — The Evolution of Todo

**Domain**: AI Features & MCP Servers  
**Phase**: III — AI-Powered Enhancements  
**Role**: Integrate AI task suggestions, MCP servers, intelligent features

---

## Phase III Scope

### AI Features
1. **Smart Task Suggestions**: OpenAI generates task breakdowns
2. **Priority Recommendations**: ML-based priority assignment
3. **Deadline Predictions**: Estimate completion times
4. **Task Clustering**: Group related tasks automatically

### MCP Integration
1. **OpenAI MCP Server**: For AI completions
2. **GitHub MCP Server**: For issue/PR integration
3. **Database MCP Server**: For query assistance
4. **Monitoring MCP Server**: For observability

---

## MCP Architecture

### What is MCP?
Model Context Protocol — standardized way to connect AI models to external tools and data sources.

### MCP Server Structure
```
/mcp/
├── servers/
│   ├── openai/          # OpenAI API integration
│   ├── github/          # GitHub API integration
│   ├── database/        # DB query assistance
│   └── monitoring/      # Metrics and logs
└── config.json          # MCP configuration
```

---

## OpenAI Integration

### Task Suggestions API
```python
# backend/app/ai/suggestions.py
import openai
from app.config import settings

openai.api_key = settings.openai_api_key

async def suggest_subtasks(task_title: str, task_description: str) -> list[str]:
    """Generate subtask suggestions using OpenAI."""
    prompt = f"""
    Task: {task_title}
    Description: {task_description}
    
    Break this task into 3-5 actionable subtasks.
    Return only the subtask titles, one per line.
    """
    
    response = await openai.ChatCompletion.acreate(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a helpful task planning assistant."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=200,
        temperature=0.7
    )
    
    subtasks = response.choices[0].message.content.strip().split("\n")
    return [s.strip("- ").strip() for s in subtasks if s.strip()]
```

### API Endpoint
```python
@router.post("/tasks/{task_id}/suggestions", response_model=list[str])
async def get_task_suggestions(
    task_id: int,
    user_id: str = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_session),
):
    task = await _get_user_task(session, task_id, user_id)
    suggestions = await suggest_subtasks(task.title, task.description or "")
    return suggestions
```

---

## MCP Server Configuration

### config.json
```json
{
  "mcpServers": {
    "openai": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-openai"],
      "env": {
        "OPENAI_API_KEY": "${OPENAI_API_KEY}"
      }
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-postgres"],
      "env": {
        "DATABASE_URL": "${DATABASE_URL}"
      }
    }
  }
}
```

---

## Frontend AI Features

### Smart Suggestions UI
```typescript
// components/tasks/SmartSuggestions.tsx
"use client";

import { useState } from "react";
import { Button, LoadingSkeleton } from "@/components/ui";

export function SmartSuggestions({ taskId }: { taskId: number }) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadSuggestions = async () => {
    setIsLoading(true);
    try {
      const data = await fetch(`/api/tasks/${taskId}/suggestions`, {
        headers: authHeaders(),
      }).then(r => r.json());
      setSuggestions(data);
    } catch (err) {
      console.error("Failed to load suggestions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-lg border p-4">
      <h3 className="font-semibold">AI Suggestions</h3>
      {isLoading ? (
        <LoadingSkeleton className="h-20 mt-2" />
      ) : suggestions.length > 0 ? (
        <ul className="mt-2 space-y-1">
          {suggestions.map((s, i) => (
            <li key={i} className="text-sm text-gray-700">• {s}</li>
          ))}
        </ul>
      ) : (
        <Button onClick={loadSuggestions} variant="secondary" className="mt-2">
          Get AI Suggestions
        </Button>
      )}
    </div>
  );
}
```

---

## Best Practices

### Rate Limiting
```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.post("/tasks/{task_id}/suggestions")
@limiter.limit("10/minute")  # Max 10 AI requests per minute
async def get_suggestions(...):
    ...
```

### Caching
```python
from functools import lru_cache

@lru_cache(maxsize=100)
async def cached_suggestions(task_title: str, task_desc: str) -> list[str]:
    return await suggest_subtasks(task_title, task_desc)
```

### Cost Management
- Use GPT-3.5-turbo for simple tasks
- Use GPT-4 only for complex planning
- Cache responses aggressively
- Monitor token usage via OpenAI dashboard

---

## Testing AI Features

### Mock OpenAI Responses
```python
@pytest.mark.asyncio
async def test_task_suggestions(client, mocker):
    mocker.patch("app.ai.suggestions.suggest_subtasks", return_value=[
        "Subtask 1",
        "Subtask 2",
        "Subtask 3"
    ])
    
    token = make_token("user-123")
    response = await client.post(
        "/api/tasks/1/suggestions",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200
    assert len(response.json()) == 3
```

---

## Phase III Implementation Plan

1. **Setup** (Week 1)
   - Install OpenAI SDK
   - Configure MCP servers
   - Add API keys to .env

2. **Backend** (Week 2)
   - Implement suggestions endpoint
   - Add rate limiting
   - Add caching layer

3. **Frontend** (Week 3)
   - Build SmartSuggestions component
   - Add AI toggle in settings
   - User feedback UI

4. **Testing** (Week 4)
   - Mock OpenAI in tests
   - Load testing for rate limits
   - User acceptance testing

---

## Quick Reference

**OpenAI**: GPT-4 for complex, GPT-3.5-turbo for simple  
**Rate Limits**: 10 requests/minute per user  
**Caching**: LRU cache for identical queries  
**MCP**: Use `@anthropic-ai/mcp-server-*` packages

**Phase III Goal**: Enhance productivity with intelligent task suggestions
