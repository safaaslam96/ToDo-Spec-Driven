"""OpenAI Agents SDK integration for the bilingual todo chatbot.

Per constitution Article III: all AI logic uses OpenAI tool calling exclusively.
The agent maps natural language (English / Urdu / Hinglish) to MCP tools.
"""

import json
from typing import Any

from openai import AsyncOpenAI
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.services.mcp_server import MCPServer

# ------------------------------------------------------------------ #
# Bilingual system prompt (Article V: English + Urdu + Hinglish)
# ------------------------------------------------------------------ #

BILINGUAL_INSTRUCTIONS = """
You are a friendly and helpful todo management assistant.
You speak English, Urdu, and Hinglish (mixed Urdu-English) fluently.

LANGUAGE RULES:
- ALWAYS respond in the SAME language the user wrote in.
- If the user writes Urdu, respond in Urdu.
- If the user writes English, respond in English.
- If the user mixes both (Hinglish), respond in the same mixed style.
- Never switch languages unless the user does.

TOOL USAGE RULES:
- add_task: when user wants to create / add / remind / bana do
- list_tasks: when user wants to see / show / dikhao / list
- complete_task: when user says done / finished / complete / mukammal / karo
- delete_task: when user says delete / remove / hatao / mitao / kar do
- update_task: when user wants to change / modify / badlo / update

URDU COMMAND EXAMPLES (→ correct tool):
  "Kal subah meeting ka task bana do"          → add_task(title="Meeting")
  "Mere pending tasks dikhao"                  → list_tasks(status="pending")
  "Sare tasks dikhao"                          → list_tasks(status="all")
  "Task 3 ko complete karo"                    → complete_task(task_id=3)
  "Task 2 delete kar do"                       → delete_task(task_id=2)
  "Task 1 ko change karo, title badal do"      → update_task(task_id=1)

HINGLISH EXAMPLES:
  "Create task for tomorrow subah"             → add_task
  "Show pending tasks aaj ke liye"             → list_tasks(status="pending")

TIME EXPRESSIONS (cultural context — understand, don't store literally):
  subah = morning | sham = evening | raat = night
  kal = tomorrow | aaj = today | parso = day after tomorrow

RESPONSE STYLE:
- Be warm, friendly, and encouraging.
- Always confirm what action was taken.
- For Urdu, use appropriate phrases: "Ji bilkul!", "Shukriya", "Zaroor!", "Ho gaya!"
- For English: "Done!", "Got it!", "Sure!"
- When listing tasks, format them clearly as a numbered list.
- If the user's intent is unclear, ask a short clarifying question.
""".strip()

# ------------------------------------------------------------------ #
# OpenAI tool schemas for all 5 MCP tools
# ------------------------------------------------------------------ #

TOOL_SCHEMAS = [
    {
        "type": "function",
        "function": {
            "name": "add_task",
            "description": "Create a new task for the user. Use when user wants to add/create/remind.",
            "parameters": {
                "type": "object",
                "properties": {
                    "title": {
                        "type": "string",
                        "description": "Task title (keep in the language the user used)",
                    },
                    "description": {
                        "type": "string",
                        "description": "Optional additional details about the task",
                    },
                },
                "required": ["title"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "list_tasks",
            "description": "List the user's tasks, optionally filtered by status.",
            "parameters": {
                "type": "object",
                "properties": {
                    "status": {
                        "type": "string",
                        "enum": ["all", "pending", "completed"],
                        "description": "Filter: 'all' (default), 'pending', or 'completed'",
                    },
                },
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "complete_task",
            "description": "Mark a task as complete by its ID.",
            "parameters": {
                "type": "object",
                "properties": {
                    "task_id": {
                        "type": "integer",
                        "description": "The numeric ID of the task to mark complete",
                    },
                },
                "required": ["task_id"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "delete_task",
            "description": "Permanently delete a task by its ID.",
            "parameters": {
                "type": "object",
                "properties": {
                    "task_id": {
                        "type": "integer",
                        "description": "The numeric ID of the task to delete",
                    },
                },
                "required": ["task_id"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "update_task",
            "description": "Update a task's title and/or description by its ID.",
            "parameters": {
                "type": "object",
                "properties": {
                    "task_id": {
                        "type": "integer",
                        "description": "The numeric ID of the task to update",
                    },
                    "title": {
                        "type": "string",
                        "description": "New title for the task (optional)",
                    },
                    "description": {
                        "type": "string",
                        "description": "New description for the task (optional)",
                    },
                },
                "required": ["task_id"],
            },
        },
    },
]


class AgentService:
    """Orchestrates OpenAI tool calling and MCP tool execution.

    Per constitution Article III: uses OpenAI exclusively for AI logic.
    Stateless — holds no conversation history between calls.
    """

    def __init__(self, session: AsyncSession, user_id: str) -> None:
        self.client = AsyncOpenAI(api_key=settings.openai_api_key)
        self.mcp = MCPServer(session, user_id)
        self.model = settings.openai_model  # defaults to gpt-4o-mini; override via env

    async def process_message(
        self,
        message: str,
        history: list[dict[str, str]],
    ) -> dict[str, Any]:
        """Process one user message with full conversation history.

        Args:
            message: The current user message.
            history: List of {role, content} dicts loaded from DB (stateless).

        Returns:
            {response: str, tool_calls: list}
        """
        messages = (
            [{"role": "system", "content": BILINGUAL_INSTRUCTIONS}]
            + history
            + [{"role": "user", "content": message}]
        )

        # First completion — may produce tool_calls
        first_response = await self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            tools=TOOL_SCHEMAS,
            tool_choice="auto",
        )

        assistant_msg = first_response.choices[0].message
        tool_calls_executed: list[dict] = []

        if assistant_msg.tool_calls:
            # Execute each tool call via MCPServer
            tool_result_msgs = []
            for tc in assistant_msg.tool_calls:
                fn_name = tc.function.name
                fn_args = json.loads(tc.function.arguments)

                # Dispatch to MCP tool
                tool_fn = getattr(self.mcp, fn_name, None)
                if tool_fn is None:
                    result = {"error": "unknown_tool", "message": f"Unknown tool: {fn_name}"}
                else:
                    result = await tool_fn(**fn_args)

                tool_calls_executed.append({
                    "tool": fn_name,
                    "args": fn_args,
                    "result": result,
                })
                tool_result_msgs.append({
                    "role": "tool",
                    "tool_call_id": tc.id,
                    "content": json.dumps(result),
                })

            # Second completion — generate natural language response from tool results
            messages.append(assistant_msg.model_dump())
            messages.extend(tool_result_msgs)

            final_response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
            )
            response_text = final_response.choices[0].message.content or ""
        else:
            # No tool calls — direct text response
            response_text = assistant_msg.content or ""

        return {
            "response": response_text,
            "tool_calls": tool_calls_executed,
        }
