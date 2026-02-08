# AI Task Suggestions - Integration Guide

## Overview

The AI Task Suggestions feature is now fully implemented and ready for integration into your dashboard. This feature uses OpenAI's API to generate intelligent task recommendations based on a user's current task list.

## ✅ What's Already Implemented

### Backend (Complete)
- ✅ OpenAI API integration with async client
- ✅ POST `/api/tasks/suggestions` endpoint
- ✅ JWT authentication and user isolation
- ✅ Rate limiting (30 seconds per user)
- ✅ Error handling and graceful fallbacks
- ✅ Configuration in `.env.example`

### Frontend (Complete)
- ✅ `AISuggestions` component with premium UI
- ✅ Loading states and animations
- ✅ Error handling with retry mechanism
- ✅ Rate limit countdown timer
- ✅ Beautiful suggestion cards
- ✅ One-click task addition

## 🚀 Quick Start

### 1. Backend Setup

Add your OpenAI API key to `backend/.env`:

```bash
# Get your API key from https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-proj-your-actual-key-here
OPENAI_MODEL=gpt-4o-mini
```

Install the new dependency:

```bash
cd backend
pip install openai>=1.12.0
# or
uv sync
```

Restart your backend server:

```bash
uvicorn app.main:app --reload
```

### 2. Frontend Integration

Add the `AISuggestions` component to your dashboard page:

```tsx
// In frontend/app/dashboard/page.tsx

import { AISuggestions } from "@/components/tasks/ai-suggestions";

export default function DashboardPage() {
  // ... existing code ...

  // Add this function to handle adding suggested tasks
  async function handleAddSuggestedTask(task: { title: string; description: string; priority: "medium" }) {
    await handleCreateTask(task);
  }

  return (
    <div>
      {/* ... existing dashboard content ... */}

      {/* Add AI Suggestions Section */}
      <section className="mt-8">
        <AISuggestions onAddTask={handleAddSuggestedTask} />
      </section>
    </div>
  );
}
```

## 📋 API Documentation

### Endpoint

**POST** `/api/tasks/suggestions`

### Request

```json
{
  "prompt": "optional custom prompt for specific suggestions"
}
```

### Response (Success - 200)

```json
{
  "suggestions": [
    {
      "title": "Review quarterly goals",
      "description": "Analyze progress on Q1 objectives and adjust priorities for Q2"
    },
    {
      "title": "Schedule team sync meeting",
      "description": "Coordinate with team members for weekly standup"
    }
  ],
  "count": 2
}
```

### Response (Rate Limited - 429)

```json
{
  "detail": {
    "message": "Rate limit exceeded. Please try again in 25 seconds.",
    "retry_after": 25
  }
}
```

### Response (Service Unavailable - 503)

```json
{
  "detail": "AI suggestions temporarily unavailable. Please try again later."
}
```

## 🎨 UI Features

### Button States
- **Default**: Purple-to-indigo gradient with "Get AI Suggestions"
- **Loading**: Animated spinner with "Generating..."
- **Rate Limited**: Shows countdown "Wait 25s"
- **Disabled**: Grayed out during loading or rate limit

### Suggestion Cards
- **Glassmorphism**: Frosted glass effect with backdrop blur
- **Purple Border**: 2px gradient border (purple-200/purple-800)
- **AI Badge**: Top-right corner with lightbulb icon
- **Animations**: Fade-in with staggered delays (0.1s per card)
- **Hover**: Lift effect with shadow enhancement
- **Add Button**: Green gradient with glow effect

### Error Handling
- Red alert box with error icon
- Clear error message
- "Try again" button for retries
- Rate limit countdown display

### Empty State
- SVG illustration (dashed circle with plus icon)
- Friendly message
- Call-to-action text

## 🔒 Security

✅ **Authentication**: JWT required on all requests
✅ **User Isolation**: Only accesses authenticated user's tasks
✅ **API Key Protection**: OpenAI key stored in backend .env only
✅ **Rate Limiting**: Prevents abuse (30s window per user)
✅ **Error Messages**: No sensitive info exposed to frontend

## ⚙️ Configuration Options

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `OPENAI_API_KEY` | Yes | - | Your OpenAI API key from platform.openai.com |
| `OPENAI_MODEL` | No | `gpt-4o-mini` | Model to use (gpt-4o-mini or gpt-4o) |

### Model Recommendations

**gpt-4o-mini** (Default)
- ✅ Fast response times (~1-2 seconds)
- ✅ Cost-effective ($0.15 per 1M input tokens)
- ✅ Good quality suggestions
- ✅ Recommended for production

**gpt-4o**
- ✅ Highest quality suggestions
- ✅ Better context understanding
- ❌ Slower response (~3-5 seconds)
- ❌ More expensive ($5.00 per 1M input tokens)
- Use for premium tier or special cases

## 🎯 User Experience

### How It Works

1. User clicks "Get AI Suggestions" button
2. Frontend sends POST request with auth token
3. Backend fetches user's current tasks
4. Backend calls OpenAI API with smart prompt
5. OpenAI analyzes tasks and generates 3-5 suggestions
6. Frontend displays suggestions in beautiful cards
7. User clicks "Add to Tasks" to add suggestion
8. Task is created and suggestion disappears from list

### Rate Limiting UX

- First request: Works immediately
- Within 30 seconds: Shows countdown timer
- After 30 seconds: Button re-enabled
- Clear messaging about wait time

## 🧪 Testing

### Manual Testing Steps

1. **Setup**: Add valid OpenAI API key to `.env`
2. **Basic Flow**:
   ```bash
   # Start backend
   cd backend && uvicorn app.main:app --reload

   # Start frontend
   cd frontend && npm run dev

   # Open http://localhost:3000/dashboard
   ```

3. **Test Cases**:
   - ✅ Click "Get AI Suggestions" with no tasks
   - ✅ Click "Get AI Suggestions" with 5+ tasks
   - ✅ Verify 3-5 suggestions appear
   - ✅ Click "Add to Tasks" on a suggestion
   - ✅ Verify suggestion removed from list
   - ✅ Click button again (should be rate limited)
   - ✅ Wait 30 seconds and retry
   - ✅ Test with invalid API key (should show error)

### Test Without OpenAI Key

Remove or comment out `OPENAI_API_KEY` to test error handling:
```
# OPENAI_API_KEY=sk-...
```

Expected: "AI suggestions service is not configured" error

## 🚨 Troubleshooting

### "AI suggestions temporarily unavailable"

**Cause**: OpenAI API error or network issue
**Fix**:
- Check your OpenAI API key is valid
- Verify you have credits in your OpenAI account
- Check internet connection
- Wait a moment and retry

### "Service not configured"

**Cause**: Missing `OPENAI_API_KEY` in backend `.env`
**Fix**: Add your API key and restart backend

### Rate limit not working

**Cause**: Rate limiter uses in-memory storage (resets on restart)
**Fix**: For production, consider Redis-based rate limiting

### Suggestions not relevant

**Cause**: Prompt engineering or model limitations
**Fix**:
- Ensure you have enough tasks for context (5+ recommended)
- Try different model (gpt-4o for better quality)
- Customize prompt in service if needed

## 📊 Performance

### Response Times
- Backend processing: ~100ms
- OpenAI API call: 1-5 seconds (depends on model)
- Total: ~1-5 seconds end-to-end

### Token Usage
- Input: ~200-500 tokens (task summary + prompt)
- Output: ~200-400 tokens (suggestions)
- Cost per request: ~$0.0001 (gpt-4o-mini)

### Rate Limiting
- Window: 30 seconds
- Limit: 1 request per user
- Storage: In-memory (consider Redis for production)

## 🔄 Future Enhancements

### Potential Improvements
1. **Custom Prompts**: Allow users to provide custom prompts
2. **Redis Rate Limiting**: Distributed rate limiting for multi-server setups
3. **Analytics**: Track suggestion quality and user adoption
4. **Favorites**: Let users favorite common suggestion patterns
5. **Smart Scheduling**: Suggest best times to complete tasks
6. **Task Templates**: Generate template-based suggestions
7. **Integration**: Suggest tasks based on calendar or email
8. **Feedback Loop**: Learn from accepted/rejected suggestions

## 📝 Code Examples

### Adding to Existing Dashboard

```tsx
// frontend/app/dashboard/page.tsx

"use client";

import { AISuggestions } from "@/components/tasks/ai-suggestions";
// ... other imports

export default function DashboardPage() {
  // ... existing state and functions

  async function handleAddSuggestedTask(task: {
    title: string;
    description: string;
    priority: "medium"
  }) {
    try {
      await handleCreateTask(task);
      // Optional: Show success toast
      console.log("Task added from AI suggestion:", task.title);
    } catch (error) {
      console.error("Failed to add suggested task:", error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-bg-subtle pb-20 md:pb-8">
      {/* ... header, stats, filters, task list ... */}

      {/* AI Suggestions Section */}
      <section className="mt-8">
        <AISuggestions onAddTask={handleAddSuggestedTask} />
      </section>
    </div>
  );
}
```

### Custom Styling

The component uses global CSS classes. To customize:

```css
/* In globals.css */

/* Customize suggestion card border */
.ai-suggestion-card {
  border-color: var(--color-primary);
}

/* Customize AI badge */
.ai-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

## 🎉 Deployment

### Backend Deployment (Hugging Face Spaces)

1. Add environment variable in Space settings:
   ```
   OPENAI_API_KEY=sk-proj-your-key
   OPENAI_MODEL=gpt-4o-mini
   ```

2. Rebuild Space to pick up new dependencies

### Frontend Deployment (Vercel)

No additional configuration needed - component will automatically use backend API.

## 📞 Support

### Resources
- OpenAI API Docs: https://platform.openai.com/docs
- Rate Limiting Guide: https://platform.openai.com/docs/guides/rate-limits
- Error Codes: https://platform.openai.com/docs/guides/error-codes

### Common Questions

**Q: How much does this cost?**
A: With gpt-4o-mini, approximately $0.0001 per request. 1000 requests = $0.10.

**Q: Can I use a different AI provider?**
A: Yes, modify `ai_suggestions.py` to use any LLM API (Anthropic, Cohere, etc.)

**Q: How do I increase rate limit?**
A: Edit `window_seconds` in `RateLimiter` class (default: 30)

**Q: Can users customize the prompt?**
A: Yes, the endpoint accepts optional `prompt` field in request body

---

**Status**: ✅ Ready for Integration
**Last Updated**: 2026-02-09
**Version**: 1.0.0
