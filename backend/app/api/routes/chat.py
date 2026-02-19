"""Stateless chat endpoint — POST /api/{user_id}/chat.

Implements the mandated 8-step stateless cycle (constitution Article I).
Zero in-memory conversation state: every request loads history from DB,
processes, stores results, then discards all local variables.
"""

import json

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.auth.jwt import get_current_user_id
from app.database.connection import get_session
from app.models.chat import Conversation, Message
from app.services.agent_service import AgentService

router = APIRouter(prefix="/api", tags=["chatbot"])


# ------------------------------------------------------------------ #
# Request / Response schemas
# ------------------------------------------------------------------ #


class ChatRequest(BaseModel):
    """Incoming chat request body."""

    message: str
    conversation_id: int | None = None


class ChatResponse(BaseModel):
    """Outgoing chat response."""

    conversation_id: int
    response: str
    tool_calls: list | None = None


# ------------------------------------------------------------------ #
# Endpoint
# ------------------------------------------------------------------ #


@router.post("/{user_id}/chat", response_model=ChatResponse)
async def chat(
    user_id: str,
    request: ChatRequest,
    session: AsyncSession = Depends(get_session),
    jwt_user_id: str = Depends(get_current_user_id),
) -> ChatResponse:
    """Stateless chat endpoint — 8-step cycle per constitution Article I.

    Step 1: Verify JWT matches URL user_id.
    Step 2: Get or create Conversation row.
    Step 3: Load full message history from DB (STATELESS).
    Step 4: Persist user message to DB immediately.
    Step 5: Run AgentService (OpenAI + MCP tools).
    Step 6: Persist assistant response to DB.
    Step 7: Return ChatResponse.
    Step 8: Function returns → all local state garbage collected.
    """

    # Step 1 — Authorise: JWT user must match URL param
    if jwt_user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: token user does not match URL user_id",
        )

    # Step 2 — Get or create Conversation
    if request.conversation_id is not None:
        conv = await session.get(Conversation, request.conversation_id)
        if conv is None or conv.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Conversation {request.conversation_id} not found",
            )
    else:
        conv = Conversation(user_id=user_id)
        session.add(conv)
        await session.commit()
        await session.refresh(conv)

    # Step 3 — Load full history from DB (STATELESS — no memory)
    history_result = await session.exec(
        select(Message)
        .where(Message.conversation_id == conv.id)
        .order_by(Message.created_at)
    )
    history_rows = history_result.all()
    history = [{"role": m.role, "content": m.content} for m in history_rows]

    # Step 4 — Persist user message immediately
    user_msg = Message(
        conversation_id=conv.id,
        user_id=user_id,
        role="user",
        content=request.message,
    )
    session.add(user_msg)
    await session.commit()

    # Step 5 — Run agent (OpenAI + MCP tools)
    try:
        agent = AgentService(session, user_id)
        result = await agent.process_message(request.message, history)
    except Exception as exc:
        # Surface 503 on OpenAI unavailability (NFR-2)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"AI service temporarily unavailable: {exc}",
        ) from exc

    # Step 6 — Persist assistant response
    assistant_msg = Message(
        conversation_id=conv.id,
        user_id=user_id,
        role="assistant",
        content=result["response"],
        tool_calls=json.dumps(result.get("tool_calls", [])),
    )
    session.add(assistant_msg)
    await session.commit()

    # Step 7 — Return response
    return ChatResponse(
        conversation_id=conv.id,
        response=result["response"],
        tool_calls=result.get("tool_calls"),
    )
    # Step 8: function returns → all local variables (conv, history, agent, result) collected
