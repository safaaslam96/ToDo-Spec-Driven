"""
AI-powered task suggestions service using OpenAI API.
"""

import json
from datetime import datetime, timedelta, timezone
from typing import Dict, List, Optional

from openai import AsyncOpenAI
from pydantic import BaseModel

from app.config import settings


class TaskSuggestion(BaseModel):
    """Schema for a suggested task."""

    title: str
    description: str


class RateLimiter:
    """Simple in-memory rate limiter for AI requests."""

    def __init__(self, window_seconds: int = 30):
        self.window_seconds = window_seconds
        self.last_requests: Dict[str, datetime] = {}

    def is_allowed(self, user_id: str) -> bool:
        """Check if user is allowed to make a request."""
        now = datetime.now(timezone.utc)
        if user_id not in self.last_requests:
            self.last_requests[user_id] = now
            return True

        last_request = self.last_requests[user_id]
        elapsed = (now - last_request).total_seconds()

        if elapsed >= self.window_seconds:
            self.last_requests[user_id] = now
            return True

        return False

    def get_remaining_seconds(self, user_id: str) -> int:
        """Get remaining seconds until next allowed request."""
        if user_id not in self.last_requests:
            return 0

        now = datetime.now(timezone.utc)
        last_request = self.last_requests[user_id]
        elapsed = (now - last_request).total_seconds()
        remaining = max(0, self.window_seconds - int(elapsed))
        return remaining


# Global rate limiter instance
rate_limiter = RateLimiter(window_seconds=30)


class AISuggestionsService:
    """Service for generating AI-powered task suggestions."""

    def __init__(self):
        if not settings.openai_api_key:
            raise ValueError("OPENAI_API_KEY environment variable not set")
        self.client = AsyncOpenAI(api_key=settings.openai_api_key)
        self.model = settings.openai_model

    async def generate_suggestions(
        self, tasks: List[Dict], custom_prompt: Optional[str] = None
    ) -> List[TaskSuggestion]:
        """
        Generate task suggestions based on current user tasks.

        Args:
            tasks: List of current user tasks (dict with title, description, priority, completed)
            custom_prompt: Optional custom prompt from user

        Returns:
            List of TaskSuggestion objects

        Raises:
            Exception: If OpenAI API call fails
        """
        # Build the prompt
        task_summary = self._build_task_summary(tasks)

        if custom_prompt:
            system_prompt = (
                "You are a helpful AI assistant that suggests useful tasks "
                "for a todo list based on the user's request and current tasks."
            )
            user_prompt = f"{custom_prompt}\n\nCurrent tasks:\n{task_summary}"
        else:
            system_prompt = (
                "You are a helpful AI assistant that suggests useful, actionable tasks "
                "for a todo list. Analyze the user's current tasks and suggest 3-5 new tasks "
                "that would complement their work, help them stay organized, or complete "
                "their goals. Focus on practical, specific tasks."
            )
            user_prompt = (
                f"Here are my current tasks:\n\n{task_summary}\n\n"
                "Please suggest 3-5 new useful tasks I should add to my todo list. "
                "Each task should have a clear title and brief description. "
                "Return ONLY a JSON array with this format: "
                '[{"title": "Task title", "description": "Task description"}, ...]'
            )

        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                temperature=0.7,
                max_tokens=800,
            )

            content = response.choices[0].message.content
            if not content:
                raise ValueError("Empty response from OpenAI")

            # Parse JSON response
            suggestions_data = self._parse_response(content)

            # Validate and convert to TaskSuggestion objects
            suggestions = []
            for item in suggestions_data[:5]:  # Limit to 5 suggestions
                if "title" in item and "description" in item:
                    suggestions.append(
                        TaskSuggestion(
                            title=item["title"][:255],  # Respect title limit
                            description=item["description"][:2000],  # Respect desc limit
                        )
                    )

            return suggestions

        except Exception as e:
            raise Exception(f"Failed to generate AI suggestions: {str(e)}")

    def _build_task_summary(self, tasks: List[Dict]) -> str:
        """Build a human-readable summary of current tasks."""
        if not tasks:
            return "No tasks yet."

        lines = []
        for i, task in enumerate(tasks[:20], 1):  # Limit to 20 tasks to save tokens
            status = "✓" if task.get("completed") else "○"
            priority = task.get("priority", "medium")
            title = task.get("title", "Untitled")
            desc = task.get("description", "")

            line = f"{i}. {status} [{priority}] {title}"
            if desc:
                line += f" - {desc[:100]}"  # Truncate long descriptions
            lines.append(line)

        return "\n".join(lines)

    def _parse_response(self, content: str) -> List[Dict]:
        """Parse OpenAI response into list of task dictionaries."""
        # Try to extract JSON from the response
        content = content.strip()

        # Remove markdown code blocks if present
        if content.startswith("```json"):
            content = content[7:]
        elif content.startswith("```"):
            content = content[3:]

        if content.endswith("```"):
            content = content[:-3]

        content = content.strip()

        try:
            data = json.loads(content)
            if isinstance(data, list):
                return data
            elif isinstance(data, dict) and "tasks" in data:
                return data["tasks"]
            elif isinstance(data, dict) and "suggestions" in data:
                return data["suggestions"]
            else:
                raise ValueError("Invalid JSON structure")
        except json.JSONDecodeError:
            # Fallback: try to parse as plain text and create basic suggestions
            lines = [line.strip() for line in content.split("\n") if line.strip()]
            suggestions = []
            for line in lines[:5]:
                # Try to extract title from numbered or bulleted lists
                if ". " in line:
                    title = line.split(". ", 1)[1]
                elif "- " in line:
                    title = line.split("- ", 1)[1]
                else:
                    title = line

                # Clean up title
                title = title.strip().strip('"').strip("'")

                if title:
                    suggestions.append({"title": title, "description": ""})

            return suggestions if suggestions else []


# Global service instance (created when needed)
_ai_service: Optional[AISuggestionsService] = None


def get_ai_service() -> AISuggestionsService:
    """Get or create the AI suggestions service instance."""
    global _ai_service
    if _ai_service is None:
        _ai_service = AISuggestionsService()
    return _ai_service
