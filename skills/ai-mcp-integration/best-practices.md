# AI-MCP Integration Specialist — Best Practices

## OpenAI API Integration

### 1. Rate Limiting
- ✅ Limit requests per user (30 sec cooldown)
- ✅ Use in-memory store or Redis for rate limits
- ✅ Return 429 with wait time in error message

### 2. Prompt Engineering
- ✅ Use system prompts to define role and output format
- ✅ Provide examples in prompts for consistency
- ✅ Constrain output length (max_tokens)
- ✅ Use temperature 0.7-0.8 for creative but focused output

### 3. Error Handling
- ✅ Handle RateLimitError (503)
- ✅ Handle APIError (503)
- ✅ Handle parsing errors (500)
- ✅ Log errors for monitoring

### 4. Cost Optimization
- ✅ Use gpt-4o-mini (cheaper, faster)
- ✅ Limit context size (only recent tasks)
- ✅ Cache responses when appropriate
- ✅ Set reasonable max_tokens limit

### 5. Security
- ✅ Never expose API keys (use environment variables)
- ✅ Validate and sanitize AI outputs
- ✅ Rate limit to prevent abuse
- ✅ Log usage for monitoring and billing

## MCP Server Integration (Bonus Task)

### Best Practices
- Use WebSockets for real-time communication
- Implement proper authentication
- Handle connection errors gracefully
- Test natural language command parsing
- Document all available tools/commands

## Quick Checklist
- [ ] OpenAI API key in environment variables
- [ ] Rate limiting per user
- [ ] System prompts define output format
- [ ] JSON response validation
- [ ] Error handling for all API errors
- [ ] Usage logging for cost monitoring
