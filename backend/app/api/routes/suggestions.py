"""
API routes for AI-powered task suggestions.
"""

from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlmodel.ext.asyncio.session import AsyncSession

from app.auth.jwt import get_current_user_id
from app.database.connection import get_session
from app.models.task import Task
from app.services.ai_suggestions import (
    TaskSuggestion,
    get_ai_service,
    rate_limiter,
)

router = APIRouter(prefix="/api/tasks", tags=["suggestions"])


class SuggestionsRequest(BaseModel):
    """Request schema for task suggestions."""

    prompt: Optional[str] = None


class SuggestionsResponse(BaseModel):
    """Response schema for task suggestions."""

    suggestions: List[TaskSuggestion]
    count: int


@router.post(
    "/suggestions",
    response_model=SuggestionsResponse,
    status_code=status.HTTP_200_OK,
    summary="Get AI-powered task suggestions",
    description="Generate intelligent task suggestions based on user's current tasks using OpenAI API. Rate limited to 1 request per 30 seconds per user.",
)
async def get_task_suggestions(
    request: SuggestionsRequest = SuggestionsRequest(),
    user_id: str = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_session),
):
    """
    Generate AI-powered task suggestions for the authenticated user.

    - **prompt**: Optional custom prompt to guide suggestion generation
    - Requires valid JWT authentication
    - Rate limited: 1 request per 30 seconds per user
    - Returns 3-5 suggested tasks with title and description
    """
    # Check rate limit
    if not rate_limiter.is_allowed(user_id):
        remaining = rate_limiter.get_remaining_seconds(user_id)
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail={
                "message": f"Rate limit exceeded. Please try again in {remaining} seconds.",
                "retry_after": remaining,
            },
        )

    # Get user's current tasks
    from sqlmodel import select

    statement = select(Task).where(Task.user_id == user_id).order_by(Task.created_at.desc())
    results = await session.execute(statement)
    tasks = results.scalars().all()

    # Convert tasks to dict format for AI service
    tasks_data = [
        {
            "title": task.title,
            "description": task.description or "",
            "priority": task.priority,
            "completed": task.completed,
        }
        for task in tasks
    ]

    # Generate suggestions
    try:
        ai_service = get_ai_service()
        suggestions = await ai_service.generate_suggestions(
            tasks=tasks_data, custom_prompt=request.prompt
        )

        return SuggestionsResponse(suggestions=suggestions, count=len(suggestions))

    except ValueError as e:
        # Configuration error (missing API key)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="AI suggestions service is not configured. Please contact support.",
        )
    except Exception as e:
        # OpenAI API error or other issues
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"AI suggestions temporarily unavailable. Please try again later.",
        )
