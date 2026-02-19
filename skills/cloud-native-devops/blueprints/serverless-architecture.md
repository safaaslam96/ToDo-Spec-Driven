# Serverless Architecture Blueprint

## Overview

**Pattern**: API Gateway + Serverless Functions + Managed Database

**Key Benefits**:
- ✅ Pay-per-request (not pay-per-hour)
- ✅ Auto-scaling from zero to infinity
- ✅ No infrastructure management
- ✅ Cost-effective for bursty/unpredictable traffic
- ✅ Built-in high availability

**Best For**:
- Low to medium consistent traffic (< 100 req/min)
- Bursty workloads (event-driven)
- Prototypes and MVPs
- Cost-sensitive projects

**Not Ideal For**:
- High consistent traffic (> 1000 req/min)
- Long-running processes (> 15 min)
- WebSocket-heavy applications
- Sub-100ms latency requirements

---

## Architecture Diagram

```
┌─────────────┐
│   Users     │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│  CDN (CloudFront / CloudFlare)      │
│  - Static assets (JS, CSS, images)  │
│  - Next.js frontend (SSG/SSR)       │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  API Gateway                        │
│  - /api/tasks                       │
│  - /api/chat                        │
│  - Rate limiting                    │
│  - JWT validation (optional)        │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  Lambda Functions (Backend)         │
│  - tasks_handler (CRUD)             │
│  - chat_handler (Urdu NLP)          │
│  - voice_handler (speech-to-text)   │
│  - auth_handler (JWT)               │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  Managed Database                   │
│  - RDS Serverless (PostgreSQL)      │
│  - Neon (serverless Postgres)       │
│  - Aurora Serverless                │
└─────────────────────────────────────┘

External:
  - OpenAI API (for chatbot)
  - Auth provider (Better Auth / Clerk)
```

---

## Component Breakdown

### 1. Frontend Deployment

**Options**:
- **Vercel** (Recommended for Next.js)
  - Zero-config Next.js deployment
  - Automatic CDN
  - Edge functions for SSR
  - Free tier: 100GB bandwidth/month
  - Cost: $20/month (Pro), $40/month (Team)

- **Netlify**
  - Similar to Vercel
  - Good for static sites
  - Edge functions available
  - Free tier: 100GB bandwidth/month

- **AWS S3 + CloudFront**
  - Static hosting on S3
  - CDN via CloudFront
  - Lower cost for high traffic
  - Cost: ~$1-5/month (low traffic)

**Deployment**:
```bash
# Vercel (Next.js)
npm install -g vercel
cd frontend
vercel --prod

# Netlify
npm install -g netlify-cli
cd frontend
netlify deploy --prod

# AWS S3 + CloudFront (static export)
cd frontend
npm run build
aws s3 sync out/ s3://my-bucket
aws cloudfront create-invalidation --distribution-id XYZ --paths "/*"
```

---

### 2. Backend Deployment (Serverless Functions)

#### AWS Lambda

**Function Structure**:
```
backend/
├── handlers/
│   ├── tasks.py         # CRUD operations
│   ├── chat.py          # Urdu chatbot
│   ├── voice.py         # Voice processing
│   └── auth.py          # Authentication
├── requirements.txt
├── serverless.yml       # Serverless Framework config
└── README.md
```

**Example: `serverless.yml` (Serverless Framework)**:
```yaml
service: todo-backend

provider:
  name: aws
  runtime: python3.13
  region: us-east-1
  stage: ${opt:stage, 'dev'}
  memorySize: 512
  timeout: 30
  environment:
    DATABASE_URL: ${env:DATABASE_URL}
    BETTER_AUTH_SECRET: ${env:BETTER_AUTH_SECRET}
    OPENAI_API_KEY: ${env:OPENAI_API_KEY}

functions:
  # Task CRUD
  getTasks:
    handler: handlers/tasks.list_tasks
    events:
      - httpApi:
          path: /api/tasks
          method: get
          authorizer:
            name: jwtAuthorizer

  createTask:
    handler: handlers/tasks.create_task
    events:
      - httpApi:
          path: /api/tasks
          method: post
          authorizer:
            name: jwtAuthorizer

  # Urdu Chatbot
  chatMessage:
    handler: handlers/chat.process_message
    events:
      - httpApi:
          path: /api/chat/{userId}/message
          method: post
          authorizer:
            name: jwtAuthorizer

  # Voice Command
  voiceProcess:
    handler: handlers/voice.process_voice
    events:
      - httpApi:
          path: /api/voice/{userId}/process
          method: post
          authorizer:
            name: jwtAuthorizer

  # JWT Authorizer
  jwtAuthorizer:
    handler: handlers/auth.authorize

resources:
  Resources:
    # API Gateway CORS
    HttpApiCors:
      Type: AWS::ApiGatewayV2::Api
      Properties:
        CorsConfiguration:
          AllowOrigins:
            - 'https://example.com'
          AllowMethods:
            - GET
            - POST
            - PUT
            - DELETE
          AllowHeaders:
            - Content-Type
            - Authorization
          MaxAge: 3600

plugins:
  - serverless-python-requirements  # Auto-package Python dependencies
  - serverless-offline  # Local development

custom:
  pythonRequirements:
    dockerizePip: true
    layer: true  # Package dependencies as Lambda Layer
```

**Deployment**:
```bash
# Install Serverless Framework
npm install -g serverless

# Deploy to AWS
cd backend
serverless deploy --stage prod

# View logs
serverless logs -f getTasks --tail

# Remove deployment
serverless remove
```

**Handler Example**: `handlers/tasks.py`
```python
import json
import os
from typing import Dict, Any
from database import get_db_session
from models import Task
from auth import get_user_id_from_event

def list_tasks(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Lambda handler for GET /api/tasks
    """
    try:
        # Extract user ID from JWT (validated by authorizer)
        user_id = get_user_id_from_event(event)

        # Query database
        session = get_db_session()
        tasks = session.query(Task).filter(Task.user_id == user_id).all()

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps([task.dict() for task in tasks])
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }

def create_task(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Lambda handler for POST /api/tasks
    """
    try:
        user_id = get_user_id_from_event(event)
        body = json.loads(event['body'])

        # Create task
        session = get_db_session()
        task = Task(
            user_id=user_id,
            title=body['title'],
            description=body.get('description'),
            due_date=body.get('due_date'),
            priority=body.get('priority', 'medium')
        )
        session.add(task)
        session.commit()

        return {
            'statusCode': 201,
            'body': json.dumps(task.dict())
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
```

---

#### GCP Cloud Functions

**Function Structure**:
```python
# main.py (GCP Cloud Functions)
import functions_framework
from flask import Request, jsonify

@functions_framework.http
def list_tasks(request: Request):
    """HTTP Cloud Function for GET /api/tasks"""
    # Extract user ID from JWT
    user_id = request.headers.get('X-User-ID')

    # Query database
    tasks = query_tasks(user_id)

    return jsonify(tasks), 200

@functions_framework.http
def create_task(request: Request):
    """HTTP Cloud Function for POST /api/tasks"""
    user_id = request.headers.get('X-User-ID')
    data = request.get_json()

    task = create_task_in_db(user_id, data)
    return jsonify(task), 201
```

**Deployment**:
```bash
# Deploy to GCP
gcloud functions deploy list-tasks \
  --runtime python313 \
  --trigger-http \
  --allow-unauthenticated \
  --entry-point list_tasks \
  --set-env-vars DATABASE_URL=postgresql://...

gcloud functions deploy create-task \
  --runtime python313 \
  --trigger-http \
  --allow-unauthenticated \
  --entry-point create_task
```

---

#### Azure Functions

**Function Structure**:
```python
# __init__.py (Azure Functions)
import azure.functions as func
import logging

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    user_id = req.headers.get('X-User-ID')

    if req.method == 'GET':
        tasks = query_tasks(user_id)
        return func.HttpResponse(json.dumps(tasks), status_code=200)

    elif req.method == 'POST':
        data = req.get_json()
        task = create_task_in_db(user_id, data)
        return func.HttpResponse(json.dumps(task), status_code=201)
```

**Deployment**:
```bash
# Deploy to Azure
func azure functionapp publish todo-backend-app
```

---

### 3. Database (Serverless PostgreSQL)

#### Option 1: Neon (Recommended for serverless)
```bash
# Create Neon project
# Visit: https://neon.tech

# Connection string
DATABASE_URL=postgresql://user:pass@ep-cool-name.us-east-2.aws.neon.tech/neondb?sslmode=require

# Features:
- Auto-pause after 5 min inactivity (saves cost)
- Scale to zero
- Branching (like Git for databases)
- Free tier: 3 projects, 10 branches
- Cost: $19/month (Launch), $69/month (Scale)
```

#### Option 2: AWS RDS Serverless
```yaml
# CloudFormation / Serverless.yml
resources:
  Resources:
    AuroraCluster:
      Type: AWS::RDS::DBCluster
      Properties:
        Engine: aurora-postgresql
        EngineMode: serverless
        DatabaseName: todo_db
        MasterUsername: ${env:DB_USER}
        MasterUserPassword: ${env:DB_PASSWORD}
        ScalingConfiguration:
          MinCapacity: 2  # ACU (Aurora Capacity Units)
          MaxCapacity: 16
          AutoPause: true
          SecondsUntilAutoPause: 300  # 5 minutes

# Cost: ~$0.06/hour when active, $0 when paused
```

#### Option 3: GCP Cloud SQL (with connection pooling)
```bash
# Create Cloud SQL instance
gcloud sql instances create todo-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1

# Enable Cloud SQL Proxy for Lambda connections
# Cost: ~$10-15/month (smallest instance)
```

---

## Cost Analysis

### Scenario 1: Low Traffic (1000 users, 10k requests/month)

**AWS Lambda + RDS Serverless + Vercel**:
- Lambda: $0 (under free tier: 1M requests/month free)
- RDS Serverless: $15-25/month (with auto-pause)
- Vercel: $20/month (Pro tier)
- **Total: ~$35-45/month**

### Scenario 2: Medium Traffic (10k users, 100k requests/month)

**AWS Lambda + Neon + Vercel**:
- Lambda: ~$5/month (100k requests, 512MB, 1s avg)
- Neon: $19/month (Launch tier)
- Vercel: $20/month
- **Total: ~$44/month**

### Scenario 3: High Traffic (100k users, 1M requests/month)

**AWS Lambda + Aurora Serverless + CloudFront**:
- Lambda: ~$50/month (1M requests)
- Aurora Serverless: $50-100/month
- CloudFront: $10/month
- **Total: ~$110-160/month**

---

## Connection Pooling for Serverless

**Problem**: Lambda creates a new database connection on every invocation, exhausting connection limits.

**Solution**: Use connection pooling services.

### Option 1: RDS Proxy (AWS)
```yaml
resources:
  Resources:
    RDSProxy:
      Type: AWS::RDS::DBProxy
      Properties:
        DBProxyName: todo-db-proxy
        EngineFamily: POSTGRESQL
        RoleArn: !GetAtt RDSProxyRole.Arn
        Auth:
          - AuthScheme: SECRETS
            SecretArn: !Ref DBSecret
        VpcSubnetIds:
          - !Ref PrivateSubnet1
          - !Ref PrivateSubnet2

# Lambda connects to proxy instead of RDS directly
# Cost: ~$0.015/hour (~$10/month)
```

### Option 2: PgBouncer (self-hosted)
```dockerfile
# Dockerfile for PgBouncer on ECS/Cloud Run
FROM edoburu/pgbouncer:latest

ENV DATABASE_URL=postgresql://user:pass@rds-host:5432/todo_db
ENV POOL_MODE=transaction
ENV MAX_CLIENT_CONN=1000
ENV DEFAULT_POOL_SIZE=20
```

### Option 3: Neon (built-in pooling)
```python
# Neon has built-in connection pooling
# Just use the pooled connection string
DATABASE_URL = "postgresql://user:pass@ep-name.pooler.neon.tech/db"
```

---

## Cold Start Optimization

**Problem**: First request to Lambda after idle period takes 1-5 seconds.

**Solutions**:

1. **Provisioned Concurrency** (AWS):
```yaml
functions:
  getTasks:
    handler: handlers/tasks.list_tasks
    provisionedConcurrency: 2  # Keep 2 instances warm
    # Cost: ~$0.015/hour per instance (~$22/month for 2)
```

2. **Lightweight Dependencies**:
```python
# ❌ BAD: Heavy imports
import pandas as pd
import numpy as np
import tensorflow as tf

# ✅ GOOD: Minimal imports
import json
from typing import Dict
```

3. **Lambda Layers** (pre-package dependencies):
```yaml
layers:
  dependencies:
    path: layer
    compatibleRuntimes:
      - python3.13
```

4. **Scheduled Ping** (keep warm):
```yaml
functions:
  warmup:
    handler: handlers/warmup.ping
    events:
      - schedule: rate(5 minutes)  # Ping every 5 min
```

---

## Monitoring & Logging

### AWS CloudWatch
```python
import logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

def list_tasks(event, context):
    logger.info(f"User {user_id} requested tasks")
    # ...
```

**View logs**:
```bash
serverless logs -f getTasks --tail
# Or use AWS Console: CloudWatch > Log Groups
```

### GCP Cloud Logging
```python
import google.cloud.logging
client = google.cloud.logging.Client()
client.setup_logging()

import logging
logging.info("Task created for user %s", user_id)
```

### Alerts
```yaml
# AWS CloudWatch Alarms
resources:
  Resources:
    HighErrorRateAlarm:
      Type: AWS::CloudWatch::Alarm
      Properties:
        AlarmName: HighLambdaErrors
        MetricName: Errors
        Namespace: AWS/Lambda
        Statistic: Sum
        Period: 300
        EvaluationPeriods: 1
        Threshold: 10
        AlarmActions:
          - !Ref SNSTopic  # Send email/SMS
```

---

## Deployment Checklist

- [ ] Set up secrets management (AWS Secrets Manager / GCP Secret Manager)
- [ ] Configure environment variables for each stage (dev/staging/prod)
- [ ] Set up database connection pooling
- [ ] Enable CloudWatch / Stackdriver logging
- [ ] Configure API Gateway rate limiting (100 req/min per IP)
- [ ] Set up CloudWatch alarms for errors, latency, cost
- [ ] Enable X-Ray / Cloud Trace for distributed tracing
- [ ] Test cold start performance (<2s)
- [ ] Configure CORS for frontend domain
- [ ] Set up CI/CD pipeline (GitHub Actions)

---

## Reusability

This serverless architecture works for:
- ✅ Any REST API (FastAPI, Flask, Express.js)
- ✅ Any SPA frontend (Next.js, React, Vue)
- ✅ Any PostgreSQL database
- ✅ Any event-driven workflows

**Just change**:
- Handler functions
- API Gateway routes
- Environment variables
- Database schema

**70%+ of this architecture is reusable across projects!**
