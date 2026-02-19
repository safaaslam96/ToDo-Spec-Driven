"""
OpenAI API Integration Pattern
AI-MCP specialist reference for Phase II AI suggestions
"""

import os
import openai
from typing import List, Dict
from fastapi import HTTPException

# Configuration
openai.api_key = os.getenv("OPENAI_API_KEY")
MODEL = "gpt-4o-mini"  # Fast and cost-effective

# Rate limiting (in-memory, per-user)
rate_limit_store = {}
RATE_LIMIT_SECONDS = 30

async def generate_task_suggestions(
    user_id: str,
    existing_tasks: List[Dict],
    user_context: str = ""
) -> List[Dict]:
    """
    Generate 3-5 AI task suggestions based on user's existing tasks.
    
    Args:
        user_id: Authenticated user ID (for rate limiting)
        existing_tasks: List of user's recent tasks (max 20)
        user_context: Optional additional context
    
    Returns:
        List of suggested tasks with title, description, category, priority
    
    Raises:
        HTTPException 429: Rate limit exceeded
        HTTPException 503: OpenAI API unavailable
    """
    
    # Check rate limit
    if user_id in rate_limit_store:
        elapsed = time.time() - rate_limit_store[user_id]
        if elapsed < RATE_LIMIT_SECONDS:
            raise HTTPException(
                status_code=429,
                detail=f"Rate limit: wait {RATE_LIMIT_SECONDS - elapsed:.0f} seconds"
            )
    
    # Build intelligent prompt
    system_prompt = """You are a productivity assistant helping users manage tasks.
Analyze their existing tasks and suggest 3-5 new, actionable tasks that would be valuable.

Output format (JSON array):
[
  {
    "title": "Clear, actionable task (max 255 chars)",
    "description": "Why this task matters and next steps",
    "category": "design|development|research|review",
    "priority": "low|medium|high"
  }
]

Guidelines:
- Be specific and actionable
- Consider natural workflow progression
- Suggest complementary tasks
- Vary categories and priorities
- Keep titles concise"""

    user_prompt = f"""Based on these existing tasks:
{format_tasks_for_prompt(existing_tasks)}

Additional context: {user_context or "None"}

Suggest 3-5 new tasks."""

    try:
        # Call OpenAI API
        response = await openai.ChatCompletion.acreate(
            model=MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.7,
            max_tokens=500
        )
        
        # Parse response
        content = response.choices[0].message.content
        suggestions = parse_json_response(content)
        
        # Update rate limit
        rate_limit_store[user_id] = time.time()
        
        return suggestions
        
    except openai.error.RateLimitError:
        raise HTTPException(status_code=503, detail="AI service rate limited")
    except openai.error.APIError:
        raise HTTPException(status_code=503, detail="AI service unavailable")
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to generate suggestions")

# KEY TAKEAWAYS:
# 1. Rate limit AI requests (expensive and can be slow)
# 2. Use system prompts to constrain output format
# 3. Limit context size (only send recent tasks)
# 4. Parse and validate JSON responses
# 5. Handle API errors gracefully
# 6. Use gpt-4o-mini for cost-effectiveness
