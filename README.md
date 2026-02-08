# The Evolution of Todo — 5-Phase Hackathon

Simulate real-world software evolution from a Python console app to a Kubernetes-managed, event-driven distributed system using **Spec-Driven Development** with **AI-only implementation**.

---

## 📋 Project Overview

| Phase | Name | Status | Description |
|-------|------|--------|-------------|
| **1** | Console App | ✅ **COMPLETE** | In-memory Python CLI |
| **2** | Full-Stack Web App | 🚧 **In Progress** | FastAPI + Next.js + PostgreSQL + JWT Auth |
| **3** | AI Chatbot | 📅 Planned | OpenAI Agents + MCP + ChatKit |
| **4** | Local Kubernetes | 📅 Planned | Docker + Minikube + Helm + Dapr + Kafka |
| **5** | Cloud Kubernetes | 📅 Planned | DigitalOcean DOKS + kubectl-ai + kagent |

---

## 🚀 Quick Start

### Prerequisites

- **Windows**: WSL 2 (Ubuntu)
- **macOS/Linux**: Terminal

### Automated Setup

```bash
# Ubuntu/WSL 2
bash setup.sh

# Windows PowerShell (runs WSL setup internally)
powershell -ExecutionPolicy Bypass -File setup.ps1
```

### Manual Setup

See **[INSTALLATION.md](INSTALLATION.md)** for detailed step-by-step instructions.

---

## 📦 Tech Stack

<details>
<summary>Click to expand full stack</summary>

### Core Tools
- **UV** 0.4.16+ — Python package manager
- **Python** 3.13.0 — Backend language
- **Node.js** 22 LTS — Frontend runtime
- **Git** — Version control

### Phase 2: Full-Stack Web App
- **Backend**: FastAPI 0.115.0, SQLModel 0.0.22, PyJWT 2.9.0, asyncpg
- **Frontend**: Next.js 16.0.0 (App Router), React 19, Tailwind CSS 3.4.1, Better Auth 0.4.0
- **Database**: Neon Serverless PostgreSQL
- **Container**: Docker 27.3.1

### Phase 3: AI Chatbot
- **AI**: OpenAI Agents SDK 1.8.0, ChatKit, MCP SDK
- **Backend**: AI agent with task management tools
- **Frontend**: Chat UI with conversational task operations

### Phase 4: Local Kubernetes
- **Orchestration**: Minikube 1.34.0, kubectl, Helm 3.15.4
- **Events**: Apache Kafka 3.8.0
- **Microservices**: Dapr 1.13.2

### Phase 5: Cloud Deployment
- **Cloud**: DigitalOcean Kubernetes (DOKS)
- **AI Ops**: kubectl-ai, kagent
- **Monitoring**: Prometheus, Grafana
- **Logging**: Loki or DigitalOcean native

</details>

---

## 🏗️ Project Structure

```
ToDo-Spec-Driven/
├── src/todo_app/           # Phase 1: Console App (FROZEN)
├── backend/                # Phase 2+: FastAPI Application
├── frontend/               # Phase 2+: Next.js Application
├── deploy/                 # Phase 4+: K8s manifests, Helm charts
├── specs/                  # All specifications
├── specs_history/          # Versioned plans/specs
├── skills/                 # Specialist CLAUDE.md files
├── history/                # PHRs, ADRs, state reports
├── .specify/               # Spec-Kit Plus config + constitution
├── INSTALLATION.md         # Detailed installation guide
├── setup.sh                # Automated setup (Ubuntu/WSL 2)
├── setup.ps1               # Automated setup (Windows)
├── verify-tools.sh         # Tool verification script
├── .env.example            # Environment variables template
└── docker-compose.yml      # Local dev orchestration
```

---

## 🎯 Getting Started by Phase

### Phase 1: Console App (Complete)

**No setup needed** — already complete on `main` branch.

```bash
cd src/todo_app
uv run python main.py
```

### Phase 2: Full-Stack Web App

#### 1. Install Dependencies

```bash
# Backend
cd backend
uv sync

# Frontend
cd frontend
npm install
```

#### 2. Setup Environment Variables

```bash
# Copy templates
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

**Edit files and add:**
- `DATABASE_URL` — Get from [Neon PostgreSQL](https://neon.tech)
- `BETTER_AUTH_SECRET` — Generate with:
  ```bash
  python3 -c "import secrets; print(secrets.token_urlsafe(32))"
  ```

#### 3. Run Database Migrations

```bash
cd backend
uv run alembic upgrade head
```

#### 4. Run Application

**Option A: Separate Terminals**
```bash
# Terminal 1: Backend
cd backend
uv run uvicorn app.main:app --reload --port 8000

# Terminal 2: Frontend
cd frontend
npm run dev  # Port 3000
```

**Option B: Docker Compose**
```bash
docker-compose up --build
```

**Access:**
- Frontend: http://localhost:3000
- Backend API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/api/health

### Phase 3: AI Chatbot (Planned)

**Prerequisites:** Phase 2 complete + OpenAI API key

1. Add `OPENAI_API_KEY` to `backend/.env`
2. Install AI tools:
   ```bash
   cd backend && uv add openai-agents==1.8.0 mcp
   cd frontend && npm install @openai/chatkit
   ```
3. Run same as Phase 2
4. Access chat: http://localhost:3000/chat

### Phase 4: Local Kubernetes (Planned)

**Prerequisites:** Docker, Minikube, Helm, kubectl

```bash
# Start Minikube
minikube start --cpus 4 --memory 8192

# Build images
docker build -t todo-backend:latest ./backend
docker build -t todo-frontend:latest ./frontend

# Load into Minikube
minikube image load todo-backend:latest
minikube image load todo-frontend:latest

# Deploy with Helm
helm install todo-app deploy/helm/

# Access
minikube service todo-app-frontend --url
```

### Phase 5: Cloud Kubernetes (Planned)

**Prerequisites:** DigitalOcean account + doctl CLI

```bash
# Create cluster
doctl kubernetes cluster create todo-prod --region nyc1 --size s-2vcpu-4gb --count 3

# Get kubeconfig
doctl kubernetes cluster kubeconfig save todo-prod

# Push images to registry
# (see INSTALLATION.md for full instructions)

# Deploy
helm install todo-app deploy/helm/ --values deploy/helm/values-production.yaml

# Get external IP
kubectl get ingress
```

---

## 🧪 Development

### Run Tests

**Backend:**
```bash
cd backend
uv run pytest tests/ -v
```

**Frontend:**
```bash
cd frontend
npm run lint
npm run build  # Type checking
```

### Verify Installation

```bash
# Check all tools
bash verify-tools.sh
```

### Git Workflow

```bash
# Commit changes
git add .
git commit -m "feat: implement feature X"
git push origin <branch-name>

# Create PR
gh pr create --title "Feature X" --body "Description"
```

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **[INSTALLATION.md](INSTALLATION.md)** | Complete installation guide for all phases |
| **[CLAUDE.md](CLAUDE.md)** | Root project guidelines for AI development |
| **[backend/CLAUDE.md](backend/CLAUDE.md)** | Backend-specific guidelines (FastAPI, SQLModel) |
| **[frontend/CLAUDE.md](frontend/CLAUDE.md)** | Frontend-specific guidelines (Next.js, TypeScript) |
| **[.specify/memory/constitution.md](.specify/memory/constitution.md)** | Project constitution (v2.0.0) |
| **[specs/overview.md](specs/overview.md)** | Phase roadmap and architecture |
| **[specs_history/phase2_full_plan_v1.plan.md](specs_history/phase2_full_plan_v1.plan.md)** | Full 5-phase development plan |

---

## 🧭 Spec-Driven Development Workflow

All features follow this workflow:

```
1. /sp.specify   → Write feature spec
2. /sp.clarify   → Resolve ambiguities
3. /sp.plan      → Generate implementation plan
4. /sp.tasks     → Break into executable tasks
5. /sp.implement → Execute tasks via AI
6. /sp.analyze   → Validate consistency
7. /sp.git.commit_pr → Commit and create PR
```

---

## 🔐 Environment Variables

### Required (Phase 2)

| Variable | Where | How to Get |
|----------|-------|------------|
| `DATABASE_URL` | backend/.env | [Neon PostgreSQL](https://neon.tech) connection string |
| `BETTER_AUTH_SECRET` | backend/.env, frontend/.env.local | `python3 -c "import secrets; print(secrets.token_urlsafe(32))"` |

### Required (Phase 3+)

| Variable | Where | How to Get |
|----------|-------|------------|
| `OPENAI_API_KEY` | backend/.env | [OpenAI API Keys](https://platform.openai.com/api-keys) |

### Required (Phase 5)

| Variable | Where | How to Get |
|----------|-------|------------|
| `DO_API_TOKEN` | .env or doctl | [DigitalOcean API](https://cloud.digitalocean.com/account/api/tokens) |

**See [.env.example](.env.example) for full template.**

---

## 🛠️ Troubleshooting

### Common Issues

**1. `uv: command not found`**
```bash
export PATH="$HOME/.local/bin:$PATH"
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
```

**2. Docker permission denied**
```bash
sudo usermod -aG docker $USER
newgrp docker
```

**3. Minikube won't start (WSL 2)**
```bash
sudo service docker start
minikube start --driver=docker --force
```

**4. Backend can't connect to Neon**
- Check `DATABASE_URL` has `postgresql+asyncpg://` prefix
- Test with `psql` using sync URL
- Check firewall/VPN

**5. Frontend 404 on API calls**
- Ensure backend running on port 8000
- Check `next.config.ts` rewrites
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`

**See [INSTALLATION.md](INSTALLATION.md#verification--troubleshooting) for more.**

---

## 👥 Contributors

This project is developed using **AI-only implementation** via Claude Code.

- **Human Architect**: Defines specs and reviews outputs
- **AI Developer**: Claude Opus 4.6 implements all code

---

## 📄 License

MIT License — See LICENSE file for details.

---

## 🎓 Learning Resources

- **FastAPI**: https://fastapi.tiangolo.com/
- **Next.js App Router**: https://nextjs.org/docs
- **SQLModel**: https://sqlmodel.tiangolo.com/
- **Tailwind CSS**: https://tailwindcss.com/
- **Better Auth**: https://better-auth.com/docs
- **Neon PostgreSQL**: https://neon.tech/docs
- **Kubernetes**: https://kubernetes.io/docs/
- **Helm**: https://helm.sh/docs/
- **Dapr**: https://docs.dapr.io/

---

## 📞 Support

- **Issues**: Open a GitHub issue
- **Documentation**: See `INSTALLATION.md` and `CLAUDE.md`
- **Constitution**: See `.specify/memory/constitution.md` for project principles

---

**Happy Coding! 🚀**
