"""
Urdu Chatbot Patterns for Task Management
AI-MCP Integration Specialist - Urdu NLP Service
"""

from openai import OpenAI
from typing import Dict, Any, List
import json
from datetime import datetime, timedelta

class UrduChatbotService:
    """
    Natural language processing service for Urdu/Hinglish task management.
    
    Capabilities:
    - Understand Urdu, English, and Hinglish (mixed)
    - Extract task details from conversational input
    - Maintain conversation context
    - Cultural context awareness (Urdu expressions, formality)
    """
    
    def __init__(self, api_key: str):
        self.client = OpenAI(api_key=api_key)
        self.conversation_history: Dict[str, List[Dict]] = {}
        
    def get_system_prompt(self) -> str:
        """System prompt for Urdu task management assistant."""
        return """You are a helpful Urdu-speaking task management assistant.
You understand Urdu, English, and Hinglish (mixed Urdu-English).

Your capabilities:
1. Understand user's intent in any language
2. Extract task details (title, description, due_date, priority)
3. Respond in the same language as the user
4. Use culturally appropriate Urdu expressions

Urdu time expressions:
- "kal" = tomorrow
- "parso" = day after tomorrow
- "aaj" = today
- "abhi" = now/right now
- "subah" = morning
- "dopahr" = afternoon
- "shaam" = evening
- "raat" = night

Urdu priority expressions:
- "bohot zaruri" / "urgent" = high
- "zaruri" = medium
- "normal" = low

Intents to recognize:
1. create_task: User wants to create a new task
2. list_tasks: User wants to see tasks
3. complete_task: User wants to mark task as complete
4. delete_task: User wants to delete a task
5. update_task: User wants to update a task
6. get_suggestions: User wants AI task suggestions

Output format (JSON):
{
  "intent": "create_task",
  "task": {
    "title": "extracted title",
    "description": "extracted description or null",
    "due_date": "ISO format or relative like 'tomorrow morning'",
    "priority": "low|medium|high"
  },
  "reply": "Response in user's language"
}

Examples:

User: "Kal subah 9 baje meeting ka task bana do"
Response: {
  "intent": "create_task",
  "task": {
    "title": "Meeting",
    "due_date": "tomorrow 9am",
    "priority": "medium",
    "description": null
  },
  "reply": "Ji, meeting ka task kal subah 9 baje ke liye ban gaya!"
}

User: "Mere pending tasks dikhao"
Response: {
  "intent": "list_tasks",
  "filter": {"status": "pending"},
  "reply": "Yeh hain aap ke pending tasks:"
}

User: "Task 3 ko complete mark karo"
Response: {
  "intent": "complete_task",
  "task_id": 3,
  "reply": "Done! Task 3 complete ho gaya."
}
"""
    
    def parse_relative_date(self, date_str: str) -> datetime:
        """Convert relative date strings to actual dates."""
        now = datetime.now()
        date_lower = date_str.lower()
        
        # Urdu expressions
        if "kal" in date_lower or "tomorrow" in date_lower:
            return now + timedelta(days=1)
        elif "parso" in date_lower or "day after" in date_lower:
            return now + timedelta(days=2)
        elif "aaj" in date_lower or "today" in date_lower:
            return now
        
        # Time of day
        if "subah" in date_lower or "morning" in date_lower:
            return now.replace(hour=9, minute=0)
        elif "dopahr" in date_lower or "afternoon" in date_lower:
            return now.replace(hour=14, minute=0)
        elif "shaam" in date_lower or "evening" in date_lower:
            return now.replace(hour=18, minute=0)
        elif "raat" in date_lower or "night" in date_lower:
            return now.replace(hour=21, minute=0)
        
        return now
    
    async def process_message(
        self,
        user_id: str,
        message: str,
        context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Process Urdu/English/Hinglish message and extract intent.
        
        Args:
            user_id: Authenticated user ID
            message: User's message
            context: User's task context (recent tasks, stats)
        
        Returns:
            Dict with intent, extracted data, and reply message
        """
        
        # Build conversation history
        if user_id not in self.conversation_history:
            self.conversation_history[user_id] = []
        
        # Add user message to history
        self.conversation_history[user_id].append({
            "role": "user",
            "content": message
        })
        
        # Keep only last 10 messages for context
        self.conversation_history[user_id] = \
            self.conversation_history[user_id][-10:]
        
        # Call OpenAI
        response = self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": self.get_system_prompt()},
                {"role": "user", "content": f"User context: {json.dumps(context)}\n\n{message}"}
            ] + self.conversation_history[user_id],
            temperature=0.7,
            response_format={"type": "json_object"}
        )
        
        # Parse response
        result = json.loads(response.choices[0].message.content)
        
        # Add assistant reply to history
        self.conversation_history[user_id].append({
            "role": "assistant",
            "content": result.get('reply', '')
        })
        
        # Process relative dates
        if 'task' in result and 'due_date' in result['task']:
            if isinstance(result['task']['due_date'], str):
                result['task']['due_date'] = self.parse_relative_date(
                    result['task']['due_date']
                ).isoformat()
        
        return result

# Example usage
if __name__ == "__main__":
    import asyncio
    
    service = UrduChatbotService(api_key="sk-...")
    
    # Test Urdu task creation
    result = asyncio.run(service.process_message(
        user_id="test-user",
        message="Kal subah 9 baje client meeting ka task bana do priority high",
        context={"total_tasks": 10, "pending": 5}
    ))
    
    print(json.dumps(result, indent=2))
    # Output:
    # {
    #   "intent": "create_task",
    #   "task": {
    #     "title": "Client meeting",
    #     "due_date": "2024-02-10T09:00:00",
    #     "priority": "high",
    #     "description": null
    #   },
    #   "reply": "Ji, client meeting ka task kal subah 9 baje ke liye ban gaya! Priority high set hai."
    # }
