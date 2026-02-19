/**
 * Urdu-Enabled Chat Interface
 * Subagent: @subagents/urdu-chatbot-agent/
 * Skill: @skills/frontend-architect/urdu-rtl-layout.tsx
 */
'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import type { Task } from '@/types/task';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  task?: Task;
  tasks?: Task[];
}

interface ChatInterfaceProps {
  userId: string;
  onTaskCreated?: (task: Task) => void;
}

export function ChatInterface({ userId, onTaskCreated }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Assalam-o-Alaikum! Main aap ki task management mein help karunga. Aap Urdu ya English mein baat kar sakte hain. 😊'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call chat API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/${userId}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
        },
        body: JSON.stringify({ message: input })
      });

      if (!response.ok) throw new Error('Chat failed');

      const data = await response.json();

      // Add assistant reply
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.reply,
        task: data.task,
        tasks: data.tasks
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Trigger callback if task created
      if (data.task && onTaskCreated) {
        onTaskCreated(data.task);
      }

    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Maaf kijiye, kuch error ho gayi. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const exampleMessages = [
    "Kal subah 9 baje meeting ka task bana do",
    "Mere pending tasks dikhao",
    "Task 1 ko complete karo",
    "Mujhe kuch suggestions do"
  ];

  return (
    <div className="flex flex-col h-full bg-slate-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-white" />
        <h3 className="text-white font-semibold">Urdu Chatbot Assistant</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-white'
              }`}
              dir="auto"
              style={{
                fontFamily: "'Noto Nastaliq Urdu', 'Segoe UI', sans-serif",
              }}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>

              {/* Show task if created */}
              {msg.task && (
                <div className="mt-2 p-2 bg-green-600/20 rounded border border-green-500/30">
                  <p className="text-sm">✅ Task Created: {msg.task.title}</p>
                </div>
              )}

              {/* Show tasks list if queried */}
              {msg.tasks && msg.tasks.length > 0 && (
                <div className="mt-2 space-y-1">
                  {msg.tasks.map(task => (
                    <div key={task.id} className="text-sm p-2 bg-slate-600/50 rounded">
                      {task.id}. {task.title} ({task.completed ? 'completed' : 'pending'})
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-700 text-white p-3 rounded-lg">
              <div className="flex gap-1">
                <span className="animate-bounce">●</span>
                <span className="animate-bounce delay-100">●</span>
                <span className="animate-bounce delay-200">●</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Task likhen (Urdu/English)..."
            className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            dir="auto"
            style={{ fontFamily: "'Noto Nastaliq Urdu', 'Segoe UI', sans-serif" }}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Example Messages */}
        <div className="mt-2 flex flex-wrap gap-2">
          {exampleMessages.map((msg, i) => (
            <button
              key={i}
              onClick={() => setInput(msg)}
              className="text-xs px-2 py-1 bg-slate-700 rounded text-gray-300 hover:bg-slate-600 transition-colors"
              style={{ fontFamily: "'Noto Nastaliq Urdu', 'Segoe UI', sans-serif" }}
            >
              {msg}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
