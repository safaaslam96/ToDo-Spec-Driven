"""
Urdu Natural Language Processing Service
Subagent: @subagents/urdu-chatbot-agent/
Skill: @skills/ai-mcp-integration/examples/urdu-chatbot-patterns.py
"""

from openai import OpenAI
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
import json
import os

class UrduNLPService:
    """
    Process Urdu and Hinglish commands for task management

    Supports:
    - Urdu: "Kal subah meeting ka task bana do"
    - Hinglish: "Create a task for tomorrow subah"
    - English: "Create a task for tomorrow morning"
    """

    def __init__(self):
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

        self.system_prompt = """You are a helpful Urdu-speaking task management assistant.
You understand Urdu, English, and Hinglish (mixed Urdu-English).

Your responsibilities:
1. Understand user's intent in ANY language
2. Extract task details (title, description, priority, category)
3. Respond in the SAME language as the user
4. Be conversational and friendly

Intent Types:
- create_task: User wants to create a new task
- list_tasks: User wants to see their tasks
- update_task: User wants to modify a task
- delete_task: User wants to remove a task
- complete_task: User wants to mark task as done
- get_suggestions: User wants AI task suggestions

Task Categories:
- design: Design/creative work
- development: Coding/technical work
- research: Research/learning
- review: Review/checking work

Priority Levels:
- low: Not urgent
- medium: Normal priority
- high: Urgent/important

Return ONLY valid JSON with this structure:
{
  "intent": "create_task|list_tasks|update_task|delete_task|complete_task|get_suggestions",
  "params": {
    "title": "Task title in original language",
    "description": "Optional description",
    "priority": "low|medium|high",
    "category": "design|development|research|review",
    "task_id": "Optional: for update/delete/complete",
    "filter": "Optional: for list_tasks (pending, completed)"
  },
  "reply": "Friendly response in SAME language as user"
}

Examples:

User: "Kal subah 9 baje meeting ka task bana do"
Response: {
  "intent": "create_task",
  "params": {
    "title": "Meeting",
    "priority": "high",
    "category": "development"
  },
  "reply": "Ji bilkul! Maine 'Meeting' ka task kal subah 9 baje ke liye bana diya hai."
}

User: "Mere pending tasks dikhao"
Response: {
  "intent": "list_tasks",
  "params": {
    "filter": "pending"
  },
  "reply": "Yeh hain aap ke pending tasks:"
}

User: "Task 3 ko complete mark karo"
Response: {
  "intent": "complete_task",
  "params": {
    "task_id": "3"
  },
  "reply": "Task 3 complete ho gaya hai!"
}

User: "Create a task for tomorrow subah"
Response: {
  "intent": "create_task",
  "params": {
    "title": "Task",
    "priority": "medium"
  },
  "reply": "Task created for tomorrow morning!"
}

Always be helpful and conversational!
"""

    async def parse_command(
        self,
        user_message: str,
        user_tasks: Optional[List[Dict]] = None
    ) -> Dict[str, Any]:
        """
        Parse Urdu/Hinglish/English command and extract intent

        Args:
            user_message: User's message in any language
            user_tasks: Optional context of user's existing tasks

        Returns:
            Dictionary with intent, params, and reply
        """
        # Build context message
        context = ""
        if user_tasks:
            context = f"\nUser's existing tasks: {json.dumps(user_tasks[:10], indent=2)}"

        try:
            response = self.client.chat.completions.create(
                model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
                messages=[
                    {"role": "system", "content": self.system_prompt},
                    {"role": "user", "content": f"{user_message}{context}"}
                ],
                temperature=0.7,
                max_tokens=500,
            )

            content = response.choices[0].message.content

            # Parse JSON response
            result = json.loads(content)

            return result

        except json.JSONDecodeError as e:
            return {
                "intent": "error",
                "params": {},
                "reply": "Maaf kijiye, mujhe aapka message samajh nahi aaya. Kya aap dobara try kar sakte hain?"
            }
        except Exception as e:
            return {
                "intent": "error",
                "params": {},
                "reply": f"Error: {str(e)}"
            }

# Singleton instance
urdu_nlp_service = UrduNLPService()
