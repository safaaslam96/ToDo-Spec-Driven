# Cloud Native DevOps — The Evolution of Todo

**Domain**: DevOps & Cloud Infrastructure  
**Stack**: Docker, Kubernetes, GitHub Actions, Neon, DO/AWS (Phase IV-V)  
**Role**: Deployment, orchestration, monitoring, scaling

---

## Phase Progression

### Phase II (Current): Local Development
- Docker Compose for local orchestration
- Environment management (.env files)
- Basic health checks

### Phase III: Cloud Preparation
- Dockerfiles for backend/frontend
- Multi-stage builds
- Image optimization

### Phase IV: Kubernetes Deployment
- K8s manifests (Deployment, Service, Ingress)
- ConfigMaps, Secrets management
- Horizontal Pod Autoscaling

### Phase V: Production Operations
- CI/CD pipelines (GitHub Actions)
- Monitoring (Prometheus, Grafana)
- Logging (Loki, Fluentd)
- Alerting (PagerDuty)

---

## Phase II: Docker Compose

### docker-compose.yml
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    env_file:
      - ./backend/.env
    depends_on:
      - db
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    env_file:
      - ./frontend/.env.local
    depends_on:
      - backend

  db:
    image: postgres:16
    environment:
      POSTGRES_DB: todo
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

### Commands
```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f backend

# Rebuild images
docker-compose build
```

---

## Environment Management

### Security Best Practices
1. **Never commit secrets**: Add `.env` to `.gitignore`
2. **Use .env.example**: Template without real values
3. **Rotate secrets**: Change periodically
4. **Use secret managers**: AWS Secrets Manager, GCP Secret Manager (Phase V)

### Environment Files
```
/.env                 # Root (shared secrets)
/backend/.env         # Backend-specific
/frontend/.env.local  # Frontend-specific (Next.js convention)
```

---

## Phase IV: Kubernetes (Future)

### Deployment Strategy
1. **Rolling updates**: Zero-downtime deployments
2. **Health checks**: Liveness and readiness probes
3. **Resource limits**: CPU/memory quotas
4. **Horizontal scaling**: Based on CPU/memory metrics

### Example K8s Manifest
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: todo-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: todo-backend
  template:
    metadata:
      labels:
        app: todo-backend
    spec:
      containers:
      - name: backend
        image: ghcr.io/user/todo-backend:v1.0.0
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: todo-secrets
              key: database-url
        livenessProbe:
          httpGet:
            path: /api/health
            port: 8000
          initialDelaySeconds: 10
          periodSeconds: 5
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
```

---

## CI/CD Pipeline (Phase V)

### GitHub Actions Workflow
```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run backend tests
        run: |
          cd backend
          uv sync
          uv run pytest tests/

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build Docker image
        run: docker build -t ghcr.io/${{ github.repository }}/backend:${{ github.sha }} ./backend
      - name: Push to registry
        run: docker push ghcr.io/${{ github.repository }}/backend:${{ github.sha }}

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Kubernetes
        run: kubectl set image deployment/todo-backend backend=ghcr.io/${{ github.repository }}/backend:${{ github.sha }}
```

---

## Monitoring & Observability (Phase V)

### Health Checks
```python
# Backend
@app.get("/api/health")
async def health():
    return {"status": "ok", "version": "0.1.0"}
```

### Metrics
- Request rate (requests/sec)
- Response time (p50, p95, p99)
- Error rate (5xx responses)
- Database connections
- Memory/CPU usage

### Logging
```python
import logging

logger = logging.getLogger(__name__)

@app.post("/api/tasks")
async def create_task(...):
    logger.info(f"Creating task for user {user_id}")
    try:
        ...
    except Exception as e:
        logger.error(f"Failed to create task: {e}")
        raise
```

---

## Quick Reference

**Local run**: `docker-compose up`  
**View logs**: `docker-compose logs -f`  
**Rebuild**: `docker-compose build`  
**Stop**: `docker-compose down`

**Phase IV**: Kubernetes manifests, HPA, monitoring  
**Phase V**: CI/CD, observability, alerting
