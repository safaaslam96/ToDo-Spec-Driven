# Installation & Setup Guide — The Evolution of Todo

Complete step-by-step installation guide for all 5 phases of the hackathon project.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Global Tools Installation](#global-tools-installation)
3. [Project Setup](#project-setup)
4. [Database Setup (Neon PostgreSQL)](#database-setup-neon-postgresql)
5. [Backend Setup](#backend-setup)
6. [Frontend Setup](#frontend-setup)
7. [AI Tools Setup (Phase 3)](#ai-tools-setup-phase-3)
8. [Cloud Tools Setup (Phases 4-5)](#cloud-tools-setup-phases-4-5)
9. [Run Commands by Phase](#run-commands-by-phase)
10. [Verification & Troubleshooting](#verification--troubleshooting)

---

## Prerequisites

### Windows Users: Install WSL 2

WSL 2 (Windows Subsystem for Linux) is **required** for this project on Windows.

**PowerShell (as Administrator):**
```powershell
# Enable WSL
wsl --install

# Set WSL 2 as default
wsl --set-default-version 2

# Install Ubuntu
wsl --install -d Ubuntu

# Restart your computer
```

**After restart, open Ubuntu from Start Menu:**
```bash
# Update packages
sudo apt update && sudo apt upgrade -y
```

### Git Installation

**Windows (PowerShell):**
```powershell
# Download Git installer
winget install --id Git.Git -e --source winget

# Verify
git --version  # Should show 2.43.0+
```

**Ubuntu/WSL 2:**
```bash
sudo apt install git -y
git --version  # Should show 2.34.0+
```

**Optional: GitHub Desktop**
- Download from: https://desktop.github.com/
- Install and sign in with GitHub account

---

## Global Tools Installation

All commands below assume **Ubuntu/WSL 2** unless marked as PowerShell.

### 1. UV (Python Package Manager)

UV is a fast Python package installer and resolver.

```bash
# Install UV
curl -LsSf https://astral.sh/uv/install.sh | sh

# Restart shell or run:
source $HOME/.local/bin/env

# Verify
uv --version  # Should show 0.4.16+
```

**Windows (PowerShell):**
```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
uv --version
```

**Troubleshooting:**
- If `uv` not found, add to PATH: `export PATH="$HOME/.local/bin:$PATH"`
- Add to `~/.bashrc` or `~/.zshrc` for persistence

---

### 2. Python 3.13

```bash
# Install Python 3.13 via UV
uv python install 3.13.0

# Verify
uv python list  # Should show 3.13.0

# Set as default (optional)
uv python pin 3.13
```

**Manual installation (if UV fails):**
```bash
sudo apt install software-properties-common -y
sudo add-apt-repository ppa:deadsnakes/ppa -y
sudo apt update
sudo apt install python3.13 python3.13-venv python3.13-dev -y
python3.13 --version
```

---

### 3. Node.js 22 LTS

Required for Next.js frontend.

**Using NVM (recommended):**
```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash

# Restart shell or run:
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install Node.js 22
nvm install 22
nvm use 22
nvm alias default 22

# Verify
node --version   # Should show v22.x.x
npm --version    # Should show 10.x.x
```

**Direct installation (alternative):**
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node --version
```

---

### 4. Docker

**Ubuntu/WSL 2:**
```bash
# Install Docker
sudo apt update
sudo apt install -y docker.io

# Add user to docker group (no sudo needed)
sudo usermod -aG docker $USER

# Start Docker service
sudo service docker start

# Verify
docker --version  # Should show 27.0.0+
docker ps  # Should work without sudo after re-login

# Auto-start Docker on WSL boot (add to ~/.bashrc)
echo 'sudo service docker start' >> ~/.bashrc
```

**Windows (Docker Desktop — alternative):**
- Download: https://www.docker.com/products/docker-desktop/
- Install with WSL 2 integration enabled
- Start Docker Desktop
- Verify in PowerShell: `docker --version`

---

### 5. Docker Compose

Usually included with Docker, but install separately if needed:

```bash
sudo apt install docker-compose -y
docker-compose --version  # Should show 1.29.0+
```

---

## Project Setup

### 1. Clone Repository

```bash
# Navigate to your projects directory
cd ~/projects  # or C:\Users\YourName\projects on Windows

# Clone the repo
git clone https://github.com/YOUR_USERNAME/ToDo-Spec-Driven.git
cd ToDo-Spec-Driven

# Check branch
git branch  # Should be on '1-rest-api-spec' or 'main'
```

---

### 2. Directory Structure Verification

Ensure the following directories exist:

```bash
ls -la

# Expected output:
# src/todo_app/     (Phase 1 — FROZEN)
# backend/          (Phase 2+ — FastAPI)
# frontend/         (Phase 2+ — Next.js)
# specs/            (All specs)
# history/          (PHRs, ADRs)
# .specify/         (Config)
# docker-compose.yml
# CLAUDE.md
# .env.example
```

If any are missing, create them:
```bash
mkdir -p backend frontend specs history skills deploy
```

---

### 3. Environment Variables Setup

```bash
# Copy .env.example to .env
cp .env.example .env

# Edit .env with your values
nano .env  # or code .env (VS Code)
```

**Required variables** (will fill in next steps):
- `DATABASE_URL` — Neon PostgreSQL connection string
- `BETTER_AUTH_SECRET` — Random secret for JWT signing
- `OPENAI_API_KEY` — OpenAI API key (Phase 3+)
- `BACKEND_PORT=8000`
- `FRONTEND_PORT=3000`

---

## Database Setup (Neon PostgreSQL)

Neon is a serverless PostgreSQL database (free tier available).

### 1. Create Neon Account

1. Go to https://neon.tech
2. Sign up with GitHub or email
3. Click **"Create a project"**
4. Choose:
   - **Name**: `todo-evolution`
   - **Region**: Closest to you (e.g., US East, EU West)
   - **PostgreSQL version**: 16 (latest)
5. Click **"Create project"**

### 2. Get Connection String

1. In Neon dashboard, click your project
2. Go to **"Connection Details"**
3. Select **"Parameters only"** view
4. Copy the connection string — it looks like:
   ```
   postgresql://username:password@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

### 3. Configure .env

Add to `.env` file:
```bash
# Backend needs asyncpg driver
DATABASE_URL=postgresql+asyncpg://username:password@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require

# Keep for reference (standard connection)
DATABASE_URL_SYNC=postgresql://username:password@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

**Important**: Change `postgresql://` to `postgresql+asyncpg://` for async support.

### 4. Test Connection (optional)

```bash
# Install psql client
sudo apt install postgresql-client -y

# Test connection (use sync URL)
psql "postgresql://username:password@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"

# If successful, you'll see:
# neondb=>

# Exit with \q
```

---

## Backend Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Install Dependencies with UV

```bash
# Sync dependencies from pyproject.toml
uv sync

# This installs:
# - fastapi==0.115.0
# - sqlmodel==0.0.22
# - pyjwt==2.9.0
# - asyncpg (async PostgreSQL driver)
# - uvicorn (ASGI server)
# - python-dotenv
# - alembic (migrations)
# - httpx (for tests)
# - pytest + pytest-asyncio

# Verify installation
uv pip list
```

**Troubleshooting:**
- If `pyproject.toml` missing, it means backend isn't scaffolded yet
- Run monorepo setup first or manually create `pyproject.toml` (see below)

---

### 3. Configure Backend .env

Create `backend/.env`:
```bash
nano backend/.env
```

Add:
```bash
DATABASE_URL=postgresql+asyncpg://username:password@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
BETTER_AUTH_SECRET=your-super-secret-key-change-this-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
FRONTEND_URL=http://localhost:3000
DEBUG=True
```

**Generate BETTER_AUTH_SECRET:**
```bash
# Python one-liner
python3 -c "import secrets; print(secrets.token_urlsafe(32))"

# Or use openssl
openssl rand -base64 32
```

---

### 4. Initialize Database (Alembic)

```bash
# From backend/ directory

# Initialize Alembic (if not already done)
uv run alembic init alembic

# Generate first migration
uv run alembic revision --autogenerate -m "Initial migration: tasks table"

# Apply migration
uv run alembic upgrade head

# Verify tables created in Neon dashboard
```

---

### 5. Run Backend

```bash
# Development mode (auto-reload)
uv run uvicorn app.main:app --reload --port 8000

# Access:
# - API: http://localhost:8000
# - Docs: http://localhost:8000/docs
# - Health: http://localhost:8000/api/health
```

**Keep this terminal running** and open a new one for frontend.

---

## Frontend Setup

### 1. Navigate to Frontend Directory

```bash
cd frontend  # From repo root
```

### 2. Install Dependencies with npm

```bash
# Install all packages from package.json
npm install

# This installs:
# - next@16.0.0
# - react@19
# - tailwindcss@3.4.1
# - better-auth@0.4.0
# - typescript@5.7+
# - And all dev dependencies

# Verify
npm list --depth=0
```

**Troubleshooting:**
- If `package.json` missing, frontend isn't scaffolded yet
- See "Manual Frontend Scaffolding" section below

---

### 3. Configure Frontend .env

Create `frontend/.env.local`:
```bash
nano frontend/.env.local
```

Add:
```bash
# Next.js public env vars (accessible in browser)
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

# Server-side only (not exposed to browser)
BETTER_AUTH_SECRET=your-super-secret-key-change-this-in-production

# Must match backend BETTER_AUTH_SECRET!
```

**Important**: `NEXT_PUBLIC_*` variables are exposed to the browser. Never put secrets there.

---

### 4. Run Frontend

```bash
# Development mode (auto-reload)
npm run dev

# Access:
# - Frontend: http://localhost:3000
# - API proxied through Next.js rewrites

# Production build (optional)
npm run build
npm start
```

---

### 5. Run Both with Docker Compose

**From repo root:**
```bash
# Build and start both services
docker-compose up --build

# Access:
# - Frontend: http://localhost:3000
# - Backend: http://localhost:8000

# Stop with Ctrl+C or:
docker-compose down
```

---

## AI Tools Setup (Phase 3)

Phase 3 adds AI chatbot capabilities.

### 1. OpenAI API Key

1. Go to https://platform.openai.com/
2. Sign up or log in
3. Navigate to **API Keys** section
4. Click **"Create new secret key"**
5. Copy the key (starts with `sk-...`)
6. **IMPORTANT**: Save it securely — you can't view it again

### 2. Add to .env

**Backend `.env`:**
```bash
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_MODEL=gpt-4  # or gpt-4-turbo, gpt-3.5-turbo
```

**Frontend `.env.local`:**
```bash
# Only if frontend needs direct OpenAI access (usually not needed)
NEXT_PUBLIC_OPENAI_API_KEY=  # Leave empty, use backend proxy
```

---

### 3. Install OpenAI Agents SDK (Backend)

```bash
cd backend

# Add OpenAI Agents SDK
uv add openai-agents==1.8.0

# Add MCP SDK
uv add mcp

# Verify
uv pip list | grep -E "openai|mcp"
```

---

### 4. Install ChatKit (Frontend)

```bash
cd frontend

# Add OpenAI ChatKit for chat UI
npm install @openai/chatkit

# Verify
npm list @openai/chatkit
```

---

## Cloud Tools Setup (Phases 4-5)

Phase 4 adds local Kubernetes (Minikube). Phase 5 adds cloud deployment (DigitalOcean).

### 1. kubectl (Kubernetes CLI)

```bash
# Download latest stable version
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"

# Install
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Verify
kubectl version --client --output=yaml
```

---

### 2. Minikube (Local Kubernetes)

```bash
# Download Minikube
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64

# Install
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# Verify
minikube version  # Should show v1.34.0+

# Start Minikube (requires Docker)
minikube start --cpus 4 --memory 8192 --driver=docker

# Check status
minikube status
kubectl get nodes  # Should show 1 node (minikube)
```

**Troubleshooting:**
- If Docker driver fails, try: `minikube start --driver=virtualbox` (requires VirtualBox)
- On WSL 2, ensure Docker service is running: `sudo service docker start`

---

### 3. Helm (Kubernetes Package Manager)

```bash
# Install Helm
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Verify
helm version  # Should show v3.15.4+

# Add common repos
helm repo add stable https://charts.helm.sh/stable
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
```

---

### 4. Dapr (Distributed Application Runtime)

```bash
# Install Dapr CLI
wget -q https://raw.githubusercontent.com/dapr/cli/master/install/install.sh -O - | /bin/bash

# Verify
dapr --version  # Should show 1.13.2+

# Initialize Dapr on Kubernetes
dapr init -k

# Check Dapr components
kubectl get pods -n dapr-system
```

---

### 5. Kafka (Event Streaming)

Kafka will be deployed on Kubernetes via Helm (Strimzi operator).

```bash
# Add Strimzi Helm repo
helm repo add strimzi https://strimzi.io/charts/
helm repo update

# Install Strimzi operator
helm install strimzi-kafka-operator strimzi/strimzi-kafka-operator

# Verify
kubectl get pods  # Should see strimzi-cluster-operator-*
```

**Deploy Kafka cluster** (later in Phase 4):
```bash
kubectl apply -f deploy/k8s/kafka-deployment.yaml
```

---

### 6. DigitalOcean CLI (doctl)

For Phase 5 cloud deployment.

**Ubuntu/WSL 2:**
```bash
# Install via Snap
sudo snap install doctl

# Or download binary
cd ~
wget https://github.com/digitalocean/doctl/releases/download/v1.104.0/doctl-1.104.0-linux-amd64.tar.gz
tar xf doctl-1.104.0-linux-amd64.tar.gz
sudo mv doctl /usr/local/bin

# Verify
doctl version
```

**Authenticate:**
1. Get API token from https://cloud.digitalocean.com/account/api/tokens
2. Click **"Generate New Token"** (read + write access)
3. Copy token
4. Authenticate:
   ```bash
   doctl auth init
   # Paste your token when prompted
   ```

**Verify:**
```bash
doctl account get  # Should show your account details
```

---

### 7. kubectl-ai and kagent

AI-assisted Kubernetes tools (Phase 5).

**kubectl-ai:**
```bash
# Install via pip
pip install kubectl-ai

# Or download binary from GitHub releases
# https://github.com/sozercan/kubectl-ai/releases

# Verify
kubectl ai --version
```

**kagent:**
```bash
# Install from GitHub releases
curl -LO https://github.com/k8sgpt-ai/k8sgpt/releases/latest/download/k8sgpt_linux_amd64.tar.gz
tar xf k8sgpt_linux_amd64.tar.gz
sudo mv k8sgpt /usr/local/bin/kagent

# Configure
kagent auth add --backend openai --password $OPENAI_API_KEY

# Verify
kagent version
```

---

## Run Commands by Phase

### Phase 1: Console App (COMPLETE)

```bash
cd src/todo_app
uv run python main.py
```

No setup needed — already complete on `main` branch.

---

### Phase 2: Full-Stack Web App

**Option 1: Run Separately**
```bash
# Terminal 1: Backend
cd backend
uv sync
uv run alembic upgrade head
uv run uvicorn app.main:app --reload --port 8000

# Terminal 2: Frontend
cd frontend
npm install
npm run dev  # Port 3000
```

**Option 2: Run with Docker Compose**
```bash
# From repo root
docker-compose up --build

# Stop with:
docker-compose down
```

**Access:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/docs
- Health check: http://localhost:8000/api/health

---

### Phase 3: AI Chatbot

Same as Phase 2, but:
1. Ensure `OPENAI_API_KEY` in backend `.env`
2. AI chat available at: http://localhost:3000/chat

```bash
# Start backend + frontend (same as Phase 2)
# Then navigate to /chat page
```

---

### Phase 4: Local Kubernetes (Minikube)

```bash
# Start Minikube
minikube start --cpus 4 --memory 8192

# Build Docker images
docker build -t todo-backend:latest ./backend
docker build -t todo-frontend:latest ./frontend

# Load images into Minikube
minikube image load todo-backend:latest
minikube image load todo-frontend:latest

# Deploy with Helm
helm install todo-app deploy/helm/ --values deploy/helm/values.yaml

# Wait for pods to be ready
kubectl get pods -w

# Access via Minikube service
minikube service todo-app-frontend --url
```

---

### Phase 5: Cloud Kubernetes (DigitalOcean DOKS)

```bash
# Create DOKS cluster
doctl kubernetes cluster create todo-prod \
  --region nyc1 \
  --size s-2vcpu-4gb \
  --count 3

# Get kubeconfig
doctl kubernetes cluster kubeconfig save todo-prod

# Verify
kubectl get nodes  # Should show 3 nodes

# Push images to registry (DOCR)
doctl registry create todo-registry
doctl registry login
docker tag todo-backend:latest registry.digitalocean.com/todo-registry/backend:latest
docker push registry.digitalocean.com/todo-registry/backend:latest
docker tag todo-frontend:latest registry.digitalocean.com/todo-registry/frontend:latest
docker push registry.digitalocean.com/todo-registry/frontend:latest

# Deploy with Helm (production values)
helm install todo-app deploy/helm/ --values deploy/helm/values-production.yaml

# Get external IP
kubectl get ingress
```

---

## Verification & Troubleshooting

### Verify All Tools

Run this verification script:

```bash
#!/bin/bash
echo "=== Tool Verification ==="
echo ""

echo "UV:"
uv --version || echo "❌ UV not found"
echo ""

echo "Python:"
uv python list | grep 3.13 || echo "❌ Python 3.13 not found"
echo ""

echo "Node.js:"
node --version || echo "❌ Node.js not found"
npm --version || echo "❌ npm not found"
echo ""

echo "Docker:"
docker --version || echo "❌ Docker not found"
docker ps > /dev/null 2>&1 && echo "✅ Docker running" || echo "❌ Docker not running"
echo ""

echo "kubectl:"
kubectl version --client --short || echo "❌ kubectl not found"
echo ""

echo "Minikube:"
minikube version || echo "❌ Minikube not found (Phase 4+)"
echo ""

echo "Helm:"
helm version --short || echo "❌ Helm not found (Phase 4+)"
echo ""

echo "Dapr:"
dapr --version || echo "❌ Dapr not found (Phase 4+)"
echo ""

echo "doctl:"
doctl version || echo "❌ doctl not found (Phase 5)"
echo ""

echo "=== Verification Complete ==="
```

Save as `verify-tools.sh`, make executable with `chmod +x verify-tools.sh`, and run: `./verify-tools.sh`

---

### Common Issues

#### 1. UV Command Not Found
```bash
# Add to PATH
export PATH="$HOME/.local/bin:$PATH"

# Make permanent
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

#### 2. Docker Permission Denied
```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Re-login or run:
newgrp docker

# Test
docker ps
```

#### 3. Minikube Won't Start on WSL 2
```bash
# Ensure Docker is running
sudo service docker start

# Try with Docker driver explicitly
minikube start --driver=docker --force

# If still fails, increase resources:
minikube start --cpus 4 --memory 8192 --driver=docker
```

#### 4. Backend Can't Connect to Neon
- Check connection string in `.env`
- Ensure `postgresql+asyncpg://` prefix (not just `postgresql://`)
- Test with `psql` using sync URL
- Check firewall/VPN blocking port 5432

#### 5. Frontend 404 on API Calls
- Check `next.config.ts` has rewrites configured
- Ensure backend running on port 8000
- Check browser console for CORS errors
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`

#### 6. Better Auth Errors
- Ensure `BETTER_AUTH_SECRET` matches in backend + frontend .env
- Must be at least 32 characters
- Generate with: `openssl rand -base64 32`

#### 7. Alembic Migration Errors
```bash
# Reset migrations (destructive!)
cd backend
uv run alembic downgrade base
uv run alembic upgrade head

# Or manually drop tables in Neon dashboard and re-run
```

---

## Next Steps

1. **Phase 2 Development**: Start implementing tasks from `specs/main/plan.md`
   ```bash
   # Convert plan to tasks
   /sp.tasks

   # Begin implementation
   /sp.implement
   ```

2. **Testing**: Run backend tests
   ```bash
   cd backend
   uv run pytest tests/ -v
   ```

3. **Git Workflow**: Commit your changes
   ```bash
   git add .
   git commit -m "feat: complete Phase 2 setup"
   git push origin 1-rest-api-spec
   ```

4. **Phase 3+**: Install AI and cloud tools when ready

---

## Quick Reference

| Tool | Version | Check Command |
|------|---------|---------------|
| UV | 0.4.16+ | `uv --version` |
| Python | 3.13.0 | `uv python list` |
| Node.js | 22.x | `node --version` |
| npm | 10.x | `npm --version` |
| Docker | 27.0+ | `docker --version` |
| kubectl | Latest | `kubectl version --client` |
| Minikube | 1.34.0+ | `minikube version` |
| Helm | 3.15.4+ | `helm version` |
| Dapr | 1.13.2+ | `dapr --version` |
| doctl | Latest | `doctl version` |

---

## Support

- **Documentation**: See `CLAUDE.md` for development guidelines
- **Issues**: Check `history/prompts/` for previous troubleshooting
- **Constitution**: `.specify/memory/constitution.md` for project principles

**Happy coding!** 🚀
