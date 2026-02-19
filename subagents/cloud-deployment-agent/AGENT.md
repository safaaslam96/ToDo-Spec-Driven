# Cloud Deployment Agent

## Role
Multi-cloud deployment automation for FastAPI + Next.js + PostgreSQL applications.

## Capabilities

### Cloud Platforms Supported
- ✅ **AWS**: ECS, Lambda, RDS, CloudFormation
- ✅ **GCP**: Cloud Run, Cloud Functions, Cloud SQL, Deployment Manager
- ✅ **Azure**: App Service, Functions, PostgreSQL, ARM Templates
- ✅ **Kubernetes**: Any K8s cluster (EKS, GKE, AKS, self-hosted)

### Deployment Patterns
1. **Kubernetes**: Full container orchestration (EKS/GKE/AKS)
2. **Serverless**: Lambda/Cloud Functions + API Gateway
3. **Container Platform**: ECS/Cloud Run/App Service
4. **Hybrid**: Mixed approach based on workload

### Infrastructure as Code
Generates deployment configs automatically:
```
Input: "Deploy to AWS with auto-scaling"
Output:
- CloudFormation template
- ECS task definitions
- ALB configuration
- RDS setup
- Deployment script
```

## Reusable Blueprints

### Blueprint 1: Kubernetes Deployment
**File**: `skills/cloud-native-devops/blueprints/kubernetes-deployment.yaml`

**Features**:
- Multi-replica deployments
- Health checks and readiness probes
- Resource limits and requests
- Secrets management
- Service mesh ready (Istio compatible)
- Horizontal Pod Autoscaling

**Reusability**: Works for ANY FastAPI + Next.js + PostgreSQL app!

```yaml
# Just change:
metadata:
  name: your-app-name  # Change this
spec:
  containers:
  - name: backend
    image: your-image:tag  # Change this
```

### Blueprint 2: Serverless Architecture
**File**: `skills/cloud-native-devops/blueprints/serverless-architecture.md`

**Pattern**:
```
Vercel (Frontend) → API Gateway → Lambda (Backend) → RDS/Neon
```

**Benefits**:
- Pay per request (not per hour)
- Auto-scaling to zero
- No infrastructure management
- Cost-effective for bursty traffic

**Reusability**: Use for any REST API + SPA!

### Blueprint 3: Microservices Pattern
**File**: `skills/cloud-native-devops/blueprints/microservices-pattern.md`

**Architecture**:
```
API Gateway
    ├── Task Service (FastAPI)
    ├── Auth Service (FastAPI)
    ├── AI Service (OpenAI integration)
    └── Analytics Service (FastAPI)

Each service:
- Independent deployment
- Own database (or shared)
- Async communication (RabbitMQ/Kafka)
```

## Cloud-Specific Deployments

### AWS Deployment
**Files**:
- `subagents/cloud-deployment-agent/blueprints/aws-deployment.yaml`
- `subagents/cloud-deployment-agent/scripts/deploy-aws.sh`

**Services Used**:
- ECS Fargate (backend containers)
- S3 + CloudFront (frontend static)
- RDS PostgreSQL (database)
- ALB (load balancer)
- Route 53 (DNS)

**Deployment Command**:
```bash
./scripts/deploy-aws.sh \
  --app-name todo-app \
  --region us-east-1 \
  --db-instance t3.micro
```

### GCP Deployment
**Files**:
- `subagents/cloud-deployment-agent/blueprints/gcp-deployment.yaml`
- `subagents/cloud-deployment-agent/scripts/deploy-gcp.sh`

**Services Used**:
- Cloud Run (backend containers)
- Cloud Storage + CDN (frontend)
- Cloud SQL PostgreSQL (database)
- Load Balancer
- Cloud DNS

**Deployment Command**:
```bash
./scripts/deploy-gcp.sh \
  --project todo-project \
  --region us-central1
```

### Azure Deployment
**Files**:
- `subagents/cloud-deployment-agent/blueprints/azure-deployment.yaml`
- `subagents/cloud-deployment-agent/scripts/deploy-azure.sh`

**Services Used**:
- App Service (backend)
- Static Web Apps (frontend)
- Azure Database for PostgreSQL
- Application Gateway
- Azure DNS

**Deployment Command**:
```bash
./scripts/deploy-azure.sh \
  --resource-group todo-rg \
  --location eastus
```

## Automation Features

### One-Command Deployment
```bash
# Auto-detect cloud provider and deploy
./scripts/deploy.sh --auto-detect

# Or specify provider
./scripts/deploy.sh --provider aws
./scripts/deploy.sh --provider gcp
./scripts/deploy.sh --provider azure
```

### Cost Optimization
- **Dev environment**: Minimal resources (t2.micro, single replica)
- **Staging environment**: Moderate resources (t3.small, 2 replicas)
- **Production environment**: Auto-scaling (t3.medium+, 3-10 replicas)

### Infrastructure Cost Estimates
```
AWS (Production):
- ECS Fargate: $50-100/month
- RDS t3.medium: $50/month
- ALB: $20/month
- S3 + CloudFront: $5/month
Total: ~$125-175/month

Serverless (Low traffic):
- Vercel: $20/month
- Lambda: $5-10/month
- RDS Serverless: $15/month
Total: ~$40-45/month
```

## CI/CD Integration

### GitHub Actions Workflow
**File**: `skills/cloud-native-devops/examples/github-actions-ci.yml`

**Pipeline**:
```yaml
on:
  push:
    branches: [main]

jobs:
  test:
    - Run tests (pytest, jest)
    - Check coverage (>80%)

  build:
    - Build Docker images
    - Push to ECR/GCR/ACR

  deploy:
    - Deploy to staging (auto)
    - Deploy to production (manual approval)
```

### Deployment Environments
1. **Development**: Auto-deploy on every commit
2. **Staging**: Auto-deploy on merge to main
3. **Production**: Manual approval required

## Monitoring & Observability

### Health Checks
```yaml
livenessProbe:
  httpGet:
    path: /api/health
    port: 8000
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /api/health
    port: 8000
  initialDelaySeconds: 5
  periodSeconds: 5
```

### Metrics
- Request rate (req/s)
- Error rate (%)
- Response latency (p50, p95, p99)
- CPU and memory usage
- Database connection pool

### Logging
- Structured JSON logs
- Centralized log aggregation (CloudWatch/Stackdriver/Azure Monitor)
- Log retention: 30 days (dev), 90 days (prod)

## Disaster Recovery

### Backup Strategy
- **Database**: Automated daily backups, 30-day retention
- **Configurations**: Version-controlled in Git
- **Secrets**: Stored in Secrets Manager/Key Vault

### Rollback Procedure
```bash
# Rollback to previous version
kubectl rollout undo deployment/todo-backend

# Or specify revision
kubectl rollout undo deployment/todo-backend --to-revision=2

# Verify rollback
kubectl rollout status deployment/todo-backend
```

## Testing

### Test Cases
1. ✅ Generate K8s manifests
2. ✅ Validate manifests (kubeval)
3. ✅ Deploy to dev environment
4. ✅ Health checks pass
5. ✅ Rollback on failure
6. ✅ Cost estimation accuracy
7. ✅ Multi-cloud deployment

## Deployment Checklist

Before deploying to production:
- [ ] Environment variables configured
- [ ] Secrets in secret manager (not hardcoded)
- [ ] Database migrations tested
- [ ] Health checks implemented
- [ ] Monitoring and alerting configured
- [ ] SSL certificates issued
- [ ] Domain DNS configured
- [ ] Backup strategy in place
- [ ] Rollback plan documented
- [ ] Load testing completed

## Reusability

This subagent can deploy:
- ✅ Any FastAPI backend
- ✅ Any Next.js frontend
- ✅ Any Node.js application
- ✅ Any PostgreSQL database
- ✅ Any Docker container
- ✅ Any microservices architecture

**Just provide**:
- Docker images
- Environment variables
- Cloud provider preference

**Agent generates everything else!**

## Future Enhancements

1. **Multi-region Deployment**: Deploy to multiple regions automatically
2. **Blue-Green Deployment**: Zero-downtime deployments
3. **Canary Deployment**: Gradual rollout with traffic shifting
4. **Cost Forecasting**: Predict costs based on usage patterns
5. **Auto-remediation**: Self-healing infrastructure
6. **Compliance Checks**: Security and compliance validation
