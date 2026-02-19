# Microservices Architecture Blueprint

## Overview

**Pattern**: Decompose monolithic backend into independent, loosely-coupled services.

**Key Benefits**:
- ✅ Independent deployment (deploy one service without touching others)
- ✅ Technology diversity (use Python for one service, Node.js for another)
- ✅ Team autonomy (different teams own different services)
- ✅ Fault isolation (one service failure doesn't crash entire system)
- ✅ Scalability (scale only the services that need it)

**Challenges**:
- ❌ Increased operational complexity (monitoring, logging, tracing)
- ❌ Distributed system problems (network latency, partial failures)
- ❌ Data consistency (no distributed transactions)
- ❌ Testing complexity (integration testing across services)

**When to Use**:
- Large, complex applications with multiple domains
- Multiple teams working independently
- Services with different scaling requirements
- Long-term project (years, not months)

**When NOT to Use**:
- Small projects (< 10k lines of code)
- Single team (< 5 developers)
- MVP or prototype
- Tight coupling between features

---

## Architecture Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                     API Gateway / BFF                        │
│  - Authentication                                            │
│  - Rate limiting                                             │
│  - Request routing                                           │
│  - Response aggregation                                      │
└────────┬─────────────────────────────────────────┬───────────┘
         │                                         │
         ▼                                         ▼
┌─────────────────────┐                 ┌─────────────────────┐
│   Task Service      │                 │   Auth Service      │
│   (Port 8001)       │                 │   (Port 8002)       │
│                     │                 │                     │
│  - Create task      │                 │  - Login/Register   │
│  - List tasks       │                 │  - JWT generation   │
│  - Update task      │                 │  - User management  │
│  - Delete task      │                 │                     │
│  - Mark complete    │                 │  Database:          │
│                     │                 │  - users            │
│  Database:          │                 │  - sessions         │
│  - tasks            │                 └─────────────────────┘
│  - task_tags        │
└──────────┬──────────┘
           │
           │ Async Events
           ▼
┌─────────────────────┐                 ┌─────────────────────┐
│   AI Service        │                 │  Analytics Service  │
│   (Port 8003)       │                 │  (Port 8004)        │
│                     │                 │                     │
│  - Task suggestions │◀────Events─────▶│  - Task stats       │
│  - Urdu chatbot     │                 │  - User activity    │
│  - Voice commands   │                 │  - Reports          │
│                     │                 │                     │
│  External:          │                 │  Database:          │
│  - OpenAI API       │                 │  - events           │
│  - Whisper API      │                 │  - aggregates       │
└─────────────────────┘                 └─────────────────────┘
           │
           │ Message Queue (RabbitMQ / Kafka)
           ▼
┌─────────────────────────────────────────────────────────────┐
│                   Event Bus / Message Broker                 │
│                                                              │
│  Topics:                                                     │
│  - task.created                                              │
│  - task.completed                                            │
│  - user.registered                                           │
└──────────────────────────────────────────────────────────────┘

Shared Services:
  - Service Mesh (Istio / Linkerd)
  - Service Discovery (Consul / Eureka)
  - Configuration Management (Consul / etcd)
  - Distributed Tracing (Jaeger / Zipkin)
  - Centralized Logging (ELK Stack / Loki)
```

---

## Service Breakdown

### 1. Task Service (Core CRUD)

**Responsibilities**:
- Manage tasks (create, read, update, delete)
- Task filtering and sorting
- Task tags and categories
- Due date management

**API Endpoints**:
```
GET    /api/tasks              # List all tasks for user
POST   /api/tasks              # Create new task
GET    /api/tasks/{id}         # Get task by ID
PUT    /api/tasks/{id}         # Update task
DELETE /api/tasks/{id}         # Delete task
PATCH  /api/tasks/{id}/complete # Mark complete/incomplete
```

**Database Schema**:
```sql
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    priority TEXT CHECK (priority IN ('low', 'medium', 'high')),
    due_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_due_date ON tasks(due_date) WHERE completed = FALSE;
```

**Tech Stack**:
- FastAPI (Python)
- SQLModel + asyncpg
- PostgreSQL
- Pydantic for validation

**Events Published**:
- `task.created` → Analytics, AI Service
- `task.completed` → Analytics
- `task.deleted` → Analytics

---

### 2. Auth Service (Authentication & Authorization)

**Responsibilities**:
- User registration and login
- JWT token generation and validation
- Password hashing and verification
- Session management

**API Endpoints**:
```
POST   /api/auth/register      # Create new user
POST   /api/auth/login         # Login and get JWT
POST   /api/auth/refresh       # Refresh JWT
POST   /api/auth/logout        # Invalidate session
GET    /api/auth/me            # Get current user info
```

**Database Schema**:
```sql
CREATE TABLE users (
    id TEXT PRIMARY KEY,  -- UUID
    email TEXT UNIQUE NOT NULL,
    hashed_password TEXT NOT NULL,
    full_name TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id),
    token TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

**Tech Stack**:
- FastAPI (Python)
- Better Auth / python-jose for JWT
- bcrypt for password hashing

**Events Published**:
- `user.registered` → Analytics, Email Service (welcome email)
- `user.logged_in` → Analytics

---

### 3. AI Service (Intelligent Features)

**Responsibilities**:
- Task suggestions using OpenAI
- Urdu chatbot (NLP processing)
- Voice command processing
- Smart task prioritization

**API Endpoints**:
```
POST   /api/ai/suggestions     # Get AI task suggestions
POST   /api/ai/chat/message    # Process chatbot message (Urdu/English)
POST   /api/ai/voice/process   # Process voice command
```

**Tech Stack**:
- FastAPI (Python)
- OpenAI API (gpt-4o-mini)
- Whisper API (for voice transcription)
- Rate limiting (1 request per 30 seconds per user)

**Events Subscribed**:
- `task.created` → Learn user patterns for better suggestions
- `task.completed` → Update suggestion model

**External Dependencies**:
- OpenAI API (requires API key)
- Whisper API (optional, for server-side speech-to-text)

---

### 4. Analytics Service (Metrics & Reporting)

**Responsibilities**:
- Track user activity (logins, task completions)
- Generate statistics (tasks per day, completion rate)
- Create reports (weekly summary, productivity insights)

**API Endpoints**:
```
GET    /api/analytics/stats           # Overall stats
GET    /api/analytics/tasks/summary   # Task completion summary
GET    /api/analytics/trends          # Trends over time
```

**Database Schema**:
```sql
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    event_type TEXT NOT NULL,  -- 'task.created', 'task.completed', etc.
    event_data JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE task_aggregates (
    user_id TEXT PRIMARY KEY,
    total_tasks INT DEFAULT 0,
    completed_tasks INT DEFAULT 0,
    pending_tasks INT DEFAULT 0,
    last_updated TIMESTAMP DEFAULT NOW()
);
```

**Tech Stack**:
- FastAPI (Python)
- PostgreSQL (for event storage)
- ClickHouse (optional, for high-volume analytics)

**Events Subscribed**:
- `task.created`
- `task.completed`
- `task.deleted`
- `user.registered`

---

## Service Communication

### 1. Synchronous (HTTP/REST)

**When to Use**:
- User-facing operations (need immediate response)
- Read operations (GET requests)
- Critical operations (need to know success/failure immediately)

**Example**: API Gateway → Task Service
```python
# API Gateway aggregates data from multiple services
@app.get("/api/dashboard")
async def get_dashboard(user_id: str):
    # Call Task Service
    tasks_response = await httpx.get(f"http://task-service:8001/api/tasks",
                                      headers={"X-User-ID": user_id})
    tasks = tasks_response.json()

    # Call Analytics Service
    stats_response = await httpx.get(f"http://analytics-service:8004/api/analytics/stats",
                                      headers={"X-User-ID": user_id})
    stats = stats_response.json()

    return {
        "tasks": tasks,
        "stats": stats
    }
```

**Pros**:
- Simple to implement
- Immediate feedback
- Easy to debug

**Cons**:
- Tight coupling (caller waits for callee)
- Cascading failures (if Task Service is down, dashboard fails)
- Higher latency

---

### 2. Asynchronous (Message Queue)

**When to Use**:
- Background operations (don't need immediate response)
- Decoupled operations (fire-and-forget)
- Fan-out patterns (one event, multiple consumers)

**Example**: Task Service → Analytics Service (via RabbitMQ)

**Task Service (Publisher)**:
```python
import pika

def publish_event(event_type: str, data: dict):
    connection = pika.BlockingConnection(pika.ConnectionParameters('rabbitmq'))
    channel = connection.channel()

    channel.exchange_declare(exchange='events', exchange_type='topic')

    message = json.dumps({"type": event_type, "data": data})
    channel.basic_publish(
        exchange='events',
        routing_key=event_type,  # 'task.created', 'task.completed', etc.
        body=message
    )

    connection.close()

@app.post("/api/tasks")
async def create_task(task: TaskCreate, user_id: str):
    # Create task in database
    db_task = Task(**task.dict(), user_id=user_id)
    session.add(db_task)
    session.commit()

    # Publish event asynchronously
    publish_event("task.created", db_task.dict())

    return db_task
```

**Analytics Service (Consumer)**:
```python
import pika

def callback(ch, method, properties, body):
    message = json.loads(body)
    event_type = message['type']
    data = message['data']

    # Store event in database
    event = Event(
        user_id=data['user_id'],
        event_type=event_type,
        event_data=data
    )
    session.add(event)
    session.commit()

    # Update aggregates
    update_task_aggregates(data['user_id'])

# Subscribe to events
connection = pika.BlockingConnection(pika.ConnectionParameters('rabbitmq'))
channel = connection.channel()
channel.exchange_declare(exchange='events', exchange_type='topic')

queue = channel.queue_declare(queue='analytics-queue', durable=True)
channel.queue_bind(exchange='events', queue='analytics-queue', routing_key='task.*')

channel.basic_consume(queue='analytics-queue', on_message_callback=callback, auto_ack=True)
channel.start_consuming()
```

**Pros**:
- Decoupled (services don't know about each other)
- Resilient (if Analytics is down, events are queued)
- Scalable (multiple consumers for high load)

**Cons**:
- Eventual consistency (data not immediately available)
- Complexity (need message broker infrastructure)
- Debugging harder (events flow through multiple services)

---

### 3. Event-Driven Architecture (Kafka)

**When to Use**:
- High-throughput event streams
- Event sourcing (store all events as source of truth)
- Real-time processing (analytics, notifications)

**Example**: Using Kafka for event streaming
```python
from kafka import KafkaProducer, KafkaConsumer
import json

# Producer (Task Service)
producer = KafkaProducer(
    bootstrap_servers=['kafka:9092'],
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

@app.post("/api/tasks")
async def create_task(task: TaskCreate, user_id: str):
    db_task = Task(**task.dict(), user_id=user_id)
    session.add(db_task)
    session.commit()

    # Publish to Kafka topic
    producer.send('task-events', {
        'type': 'task.created',
        'data': db_task.dict(),
        'timestamp': datetime.utcnow().isoformat()
    })

    return db_task

# Consumer (Analytics Service)
consumer = KafkaConsumer(
    'task-events',
    bootstrap_servers=['kafka:9092'],
    value_deserializer=lambda m: json.loads(m.decode('utf-8')),
    group_id='analytics-service'
)

for message in consumer:
    event = message.value
    # Process event
    process_task_event(event)
```

**Pros**:
- High throughput (millions of events per second)
- Event replay (can reprocess past events)
- Multiple consumers (each with own offset)

**Cons**:
- More complex than RabbitMQ
- Operational overhead (ZooKeeper, partitions)
- Overkill for small projects

---

## Service Discovery

**Problem**: Services need to find each other's IP addresses dynamically (IPs change in cloud environments).

### Option 1: Kubernetes Service Discovery (Recommended)
```yaml
# Each service gets a DNS name automatically
# task-service.default.svc.cluster.local
# auth-service.default.svc.cluster.local

# Python code can use service names directly
response = await httpx.get("http://task-service:8001/api/tasks")
```

### Option 2: Consul
```python
import consul

# Register service
c = consul.Consul()
c.agent.service.register(
    name='task-service',
    service_id='task-service-1',
    address='10.0.1.5',
    port=8001,
    check=consul.Check.http('http://10.0.1.5:8001/health', interval='10s')
)

# Discover service
services = c.health.service('task-service', passing=True)
task_service_url = f"http://{services[0]['Service']['Address']}:{services[0]['Service']['Port']}"
```

---

## API Gateway / Backend for Frontend (BFF)

**Responsibilities**:
- Single entry point for clients
- Route requests to appropriate services
- Aggregate responses from multiple services
- Handle authentication/authorization
- Rate limiting and caching

**Implementation** (FastAPI):
```python
from fastapi import FastAPI, Depends, HTTPException
from httpx import AsyncClient
import jwt

app = FastAPI()

# Service URLs (from environment or service discovery)
TASK_SERVICE_URL = os.getenv("TASK_SERVICE_URL", "http://task-service:8001")
AUTH_SERVICE_URL = os.getenv("AUTH_SERVICE_URL", "http://auth-service:8002")
AI_SERVICE_URL = os.getenv("AI_SERVICE_URL", "http://ai-service:8003")
ANALYTICS_SERVICE_URL = os.getenv("ANALYTICS_SERVICE_URL", "http://analytics-service:8004")

# JWT verification
def verify_token(token: str) -> str:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload["sub"]  # user_id
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Route: Dashboard (aggregates data from multiple services)
@app.get("/api/dashboard")
async def get_dashboard(token: str = Depends(oauth2_scheme)):
    user_id = verify_token(token)

    async with AsyncClient() as client:
        # Parallel requests to multiple services
        tasks_response, stats_response = await asyncio.gather(
            client.get(f"{TASK_SERVICE_URL}/api/tasks", headers={"X-User-ID": user_id}),
            client.get(f"{ANALYTICS_SERVICE_URL}/api/analytics/stats", headers={"X-User-ID": user_id})
        )

        return {
            "tasks": tasks_response.json(),
            "stats": stats_response.json()
        }

# Route: Create task (proxy to Task Service)
@app.post("/api/tasks")
async def create_task(task: dict, token: str = Depends(oauth2_scheme)):
    user_id = verify_token(token)

    async with AsyncClient() as client:
        response = await client.post(
            f"{TASK_SERVICE_URL}/api/tasks",
            json=task,
            headers={"X-User-ID": user_id}
        )
        return response.json()
```

---

## Database Per Service Pattern

**Principle**: Each service owns its own database. NO shared databases.

**Why?**
- Service autonomy (change schema without coordinating)
- Fault isolation (one DB failure doesn't affect others)
- Technology diversity (Task Service uses Postgres, Analytics uses ClickHouse)

**How to Handle Cross-Service Queries?**

### Anti-Pattern: Join across databases ❌
```python
# DON'T DO THIS
tasks = db.query(Task).filter(Task.user_id == user_id).all()
user = auth_db.query(User).filter(User.id == user_id).first()  # Different DB!
```

### Pattern 1: API Composition ✅
```python
# Get tasks from Task Service
tasks = await task_service.get_tasks(user_id)

# Get user info from Auth Service
user = await auth_service.get_user(user_id)

# Combine in API Gateway
return {"tasks": tasks, "user": user}
```

### Pattern 2: Data Replication ✅
```python
# Task Service maintains a local copy of user names
# Updated via events from Auth Service

# When user updates their name in Auth Service:
auth_service.publish_event("user.updated", {"user_id": "123", "name": "John Doe"})

# Task Service listens and updates local copy:
def on_user_updated(event):
    user_id = event['user_id']
    name = event['name']
    db.execute("UPDATE tasks SET user_name = ? WHERE user_id = ?", name, user_id)
```

### Pattern 3: CQRS (Command Query Responsibility Segregation) ✅
```python
# Write side: Task Service (authoritative)
@task_service.post("/api/tasks")
def create_task(task):
    db.add(task)
    publish_event("task.created", task)

# Read side: Analytics Service (materialized view)
def on_task_created(event):
    # Maintain denormalized view for fast queries
    analytics_db.add_task_with_user_info(event)

# Query from read side
@analytics_service.get("/api/tasks-with-stats")
def get_tasks_with_stats(user_id):
    return analytics_db.query_denormalized_view(user_id)
```

---

## Distributed Tracing

**Problem**: Request spans multiple services. How to debug slow requests?

**Solution**: Distributed tracing with Jaeger or Zipkin.

```python
from opentelemetry import trace
from opentelemetry.exporter.jaeger import JaegerExporter
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor

# Setup tracing
trace.set_tracer_provider(TracerProvider())
tracer = trace.get_tracer(__name__)

jaeger_exporter = JaegerExporter(
    agent_host_name="jaeger",
    agent_port=6831,
)
trace.get_tracer_provider().add_span_processor(
    BatchSpanProcessor(jaeger_exporter)
)

# Trace requests
@app.get("/api/tasks")
async def get_tasks(user_id: str):
    with tracer.start_as_current_span("get-tasks"):
        # This span shows up in Jaeger UI
        tasks = await fetch_tasks(user_id)
        return tasks
```

**Jaeger UI** shows:
```
Request: GET /api/dashboard
  ├─ API Gateway: get_dashboard (100ms)
  │   ├─ Task Service: get_tasks (40ms)
  │   ├─ Analytics Service: get_stats (50ms)
  │   └─ AI Service: get_suggestions (60ms)
  └─ Total: 150ms
```

---

## Testing Microservices

### 1. Unit Tests (Each service independently)
```python
# test_task_service.py
def test_create_task():
    response = client.post("/api/tasks", json={"title": "Test"})
    assert response.status_code == 201
```

### 2. Integration Tests (Service + database)
```python
# test_task_service_integration.py
@pytest.mark.asyncio
async def test_create_and_fetch_task():
    # Create task
    task = await create_task({"title": "Test"})

    # Fetch task
    fetched = await get_task(task.id)
    assert fetched.title == "Test"
```

### 3. Contract Tests (Service interactions)
```python
# test_task_service_contract.py
def test_task_service_response_format():
    """Ensure Task Service returns expected format for API Gateway"""
    response = client.get("/api/tasks")
    assert "tasks" in response.json()
    assert isinstance(response.json()["tasks"], list)
```

### 4. End-to-End Tests (Full flow)
```python
# test_e2e.py
def test_user_can_create_and_complete_task():
    # Login
    token = login("user@example.com", "password")

    # Create task via API Gateway
    task = api_gateway.post("/api/tasks", headers={"Authorization": f"Bearer {token}"})

    # Mark complete
    api_gateway.patch(f"/api/tasks/{task.id}/complete")

    # Verify in analytics
    stats = api_gateway.get("/api/analytics/stats")
    assert stats["completed_tasks"] == 1
```

---

## Deployment Strategies

### 1. Blue-Green Deployment
```
1. Current: v1 running (blue)
2. Deploy v2 (green) alongside v1
3. Test v2 in green environment
4. Switch traffic from blue to green
5. Keep blue as rollback option
```

### 2. Canary Deployment
```
1. Deploy v2 to 10% of servers
2. Monitor metrics (errors, latency)
3. If OK, gradually increase to 50%, 100%
4. If errors spike, rollback immediately
```

### 3. Rolling Update
```
1. Update 1 instance at a time
2. Wait for health checks to pass
3. Move to next instance
4. Ensures zero downtime
```

---

## Reusability

This microservices architecture is reusable for:
- ✅ E-commerce platforms (Order Service, Payment Service, Inventory Service)
- ✅ Social media apps (Post Service, Comment Service, Notification Service)
- ✅ SaaS applications (Tenant Service, Billing Service, Analytics Service)
- ✅ IoT platforms (Device Service, Telemetry Service, Alert Service)

**Just replace**:
- Service names
- Domain models
- Business logic

**Keep**:
- Service communication patterns
- Event-driven architecture
- Database-per-service
- API Gateway
- Distributed tracing
- Deployment strategies

**80%+ of this architecture is reusable!**
