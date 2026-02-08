#!/bin/bash
# Tool Verification Script — The Evolution of Todo
# Run with: bash verify-tools.sh

echo "================================================"
echo "The Evolution of Todo — Tool Verification"
echo "================================================"
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Counters
PASS=0
FAIL=0
WARN=0

check_tool() {
    local tool_name=$1
    local check_command=$2
    local phase=$3
    local required=$4

    echo -n "Checking $tool_name... "

    if eval "$check_command" > /dev/null 2>&1; then
        version=$(eval "$check_command" 2>&1 | head -1)
        echo -e "${GREEN}✅ PASS${NC} ($version)"
        ((PASS++))
    else
        if [ "$required" == "required" ]; then
            echo -e "${RED}❌ FAIL${NC} (required for $phase)"
            ((FAIL++))
        else
            echo -e "${YELLOW}⚠️  SKIP${NC} (optional for $phase)"
            ((WARN++))
        fi
    fi
}

echo "=== Core Tools (Required for All Phases) ==="
echo ""
check_tool "Git" "git --version" "All" "required"
check_tool "UV" "uv --version" "All" "required"
check_tool "Python 3.13" "uv python list | grep 3.13" "All" "required"
echo ""

echo "=== Phase 2 Tools (Full-Stack Web App) ==="
echo ""
check_tool "Node.js" "node --version" "Phase 2+" "required"
check_tool "npm" "npm --version" "Phase 2+" "required"
check_tool "Docker" "docker --version" "Phase 2+" "required"
check_tool "Docker running" "docker ps" "Phase 2+" "required"
check_tool "PostgreSQL client" "psql --version" "Phase 2+" "optional"
echo ""

echo "=== Phase 3 Tools (AI Chatbot) ==="
echo ""
check_tool "OpenAI in backend" "cd backend 2>/dev/null && uv pip show openai-agents" "Phase 3" "optional"
check_tool "ChatKit in frontend" "cd frontend 2>/dev/null && npm list @openai/chatkit" "Phase 3" "optional"
echo ""

echo "=== Phase 4 Tools (Local Kubernetes) ==="
echo ""
check_tool "kubectl" "kubectl version --client --short" "Phase 4" "optional"
check_tool "Minikube" "minikube version" "Phase 4" "optional"
check_tool "Helm" "helm version --short" "Phase 4" "optional"
check_tool "Dapr" "dapr --version" "Phase 4" "optional"
echo ""

echo "=== Phase 5 Tools (Cloud Deployment) ==="
echo ""
check_tool "doctl" "doctl version" "Phase 5" "optional"
check_tool "kubectl-ai" "kubectl ai --version" "Phase 5" "optional"
echo ""

echo "=== Environment Files ==="
echo ""
if [ -f ".env" ]; then
    echo -e "${GREEN}✅ PASS${NC} Root .env exists"
    ((PASS++))
else
    echo -e "${YELLOW}⚠️  SKIP${NC} Root .env not found (copy from .env.example)"
    ((WARN++))
fi

if [ -f "backend/.env" ]; then
    echo -e "${GREEN}✅ PASS${NC} backend/.env exists"
    ((PASS++))
else
    echo -e "${YELLOW}⚠️  SKIP${NC} backend/.env not found (copy from backend/.env.example)"
    ((WARN++))
fi

if [ -f "frontend/.env.local" ]; then
    echo -e "${GREEN}✅ PASS${NC} frontend/.env.local exists"
    ((PASS++))
else
    echo -e "${YELLOW}⚠️  SKIP${NC} frontend/.env.local not found (copy from frontend/.env.example)"
    ((WARN++))
fi
echo ""

echo "================================================"
echo "Verification Summary"
echo "================================================"
echo -e "${GREEN}✅ Passed:${NC} $PASS"
echo -e "${RED}❌ Failed:${NC} $FAIL"
echo -e "${YELLOW}⚠️  Warnings:${NC} $WARN"
echo ""

if [ $FAIL -gt 0 ]; then
    echo -e "${RED}Some required tools are missing.${NC}"
    echo "Run the setup script: bash setup.sh"
    echo "Or see INSTALLATION.md for manual installation."
    exit 1
else
    echo -e "${GREEN}All required tools are installed!${NC}"

    if [ $WARN -gt 0 ]; then
        echo -e "${YELLOW}Some optional tools are missing (needed for later phases).${NC}"
    fi

    echo ""
    echo "Next steps:"
    echo "  1. Copy .env files: cp .env.example .env && cp backend/.env.example backend/.env && cp frontend/.env.example frontend/.env.local"
    echo "  2. Sign up for Neon PostgreSQL: https://neon.tech"
    echo "  3. Add DATABASE_URL to backend/.env"
    echo "  4. Generate and add BETTER_AUTH_SECRET to backend/.env and frontend/.env.local"
    echo "  5. Run backend: cd backend && uv run uvicorn app.main:app --reload"
    echo "  6. Run frontend: cd frontend && npm run dev"
    echo ""
    exit 0
fi
