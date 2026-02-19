"""Conversation and Message database models for Phase III stateless chatbot."""

from datetime import datetime, timezone
from typing import Optional

from sqlmodel import Field, SQLModel


class Conversation(SQLModel, table=True):
    """Conversation table — groups messages for a user session.

    Per constitution Article I: all state lives here, never in memory.
    """

    __tablename__ = "conversations"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Message(SQLModel, table=True):
    """Message table — individual chat turns stored per constitution Article I.

    role must be 'user' or 'assistant'.
    tool_calls stores JSON string of executed MCP tool calls.
    """

    __tablename__ = "messages"

    id: Optional[int] = Field(default=None, primary_key=True)
    conversation_id: int = Field(
        foreign_key="conversations.id",
        index=True,
    )
    user_id: str = Field(index=True)
    role: str = Field()  # 'user' | 'assistant'
    content: str = Field()
    tool_calls: Optional[str] = Field(default=None)  # JSON string
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        index=True,
    )
