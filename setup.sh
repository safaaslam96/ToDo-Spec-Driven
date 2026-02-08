#!/bin/bash
# Setup script for The Evolution of Todo — Ubuntu/WSL 2
# Run with: bash setup.sh

set -e  # Exit on error

echo "======================================"
echo "The Evolution of Todo — Setup Script"
echo "======================================"
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Helper functions
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_section() {
    echo ""
    echo "======================================"
    echo "$1"
    echo "======================================"
    echo ""
}

# Check if running on WSL or Linux
if grep -qi microsoft /proc/version; then
    print_success "Detected WSL 2"
    IS_WSL=true
else
    print_success "Detected Linux"
    IS_WSL=false
fi

# Update system packages
print_section "Updating System Packages"
sudo apt update && sudo apt upgrade -y
print_success "System updated"

# Install Git if not present
if ! command -v git &> /dev/null; then
    print_section "Installing Git"
    sudo apt install git -y
    print_success "Git installed"
else
    print_success "Git already installed ($(git --version))"
fi

# Install UV
print_section "Installing UV"
if ! command -v uv &> /dev/null; then
    curl -LsSf https://astral.sh/uv/install.sh | sh
    export PATH="$HOME/.local/bin:$PATH"
    echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
    print_success "UV installed"
else
    print_success "UV already installed ($(uv --version))"
fi

# Install Python 3.13
print_section "Installing Python 3.13"
if ! uv python list | grep -q "3.13"; then
    uv python install 3.13.0
    print_success "Python 3.13 installed"
else
    print_success "Python 3.13 already installed"
fi

# Install Node.js via NVM
print_section "Installing Node.js 22 LTS"
if ! command -v node &> /dev/null; then
    export NVM_DIR="$HOME/.nvm"

    # Install NVM if not present
    if [ ! -d "$NVM_DIR" ]; then
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    fi

    # Load NVM
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

    # Install Node.js 22
    nvm install 22
    nvm use 22
    nvm alias default 22
    print_success "Node.js 22 installed"
else
    print_success "Node.js already installed ($(node --version))"
fi

# Install Docker
print_section "Installing Docker"
if ! command -v docker &> /dev/null; then
    sudo apt install -y docker.io
    sudo usermod -aG docker $USER
    sudo service docker start
    print_success "Docker installed"
    print_warning "You may need to log out and back in for docker group to take effect"
else
    print_success "Docker already installed ($(docker --version))"
    # Ensure Docker is running
    if ! sudo service docker status &> /dev/null; then
        sudo service docker start
        print_success "Docker service started"
    fi
fi

# Install Docker Compose
if ! command -v docker-compose &> /dev/null; then
    sudo apt install -y docker-compose
    print_success "Docker Compose installed"
else
    print_success "Docker Compose already installed"
fi

# Install PostgreSQL client (for Neon testing)
print_section "Installing PostgreSQL Client"
if ! command -v psql &> /dev/null; then
    sudo apt install -y postgresql-client
    print_success "PostgreSQL client installed"
else
    print_success "PostgreSQL client already installed"
fi

# Backend setup
print_section "Setting Up Backend"
if [ -d "backend" ]; then
    cd backend

    # Install dependencies
    print_success "Installing backend dependencies..."
    uv sync

    # Check for .env
    if [ ! -f ".env" ]; then
        if [ -f ".env.example" ]; then
            cp .env.example .env
            print_warning "Created backend/.env from .env.example — PLEASE EDIT IT!"
        else
            print_warning "No .env.example found, please create backend/.env manually"
        fi
    else
        print_success "backend/.env already exists"
    fi

    cd ..
    print_success "Backend setup complete"
else
    print_warning "backend/ directory not found — skipping backend setup"
fi

# Frontend setup
print_section "Setting Up Frontend"
if [ -d "frontend" ]; then
    cd frontend

    # Load NVM for npm
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

    # Install dependencies
    print_success "Installing frontend dependencies (this may take a few minutes)..."
    npm install

    # Check for .env.local
    if [ ! -f ".env.local" ]; then
        if [ -f ".env.example" ]; then
            cp .env.example .env.local
            print_warning "Created frontend/.env.local from .env.example — PLEASE EDIT IT!"
        else
            print_warning "No .env.example found, please create frontend/.env.local manually"
        fi
    else
        print_success "frontend/.env.local already exists"
    fi

    cd ..
    print_success "Frontend setup complete"
else
    print_warning "frontend/ directory not found — skipping frontend setup"
fi

# Root .env check
print_section "Checking Root Environment File"
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        print_warning "Created .env from .env.example — PLEASE EDIT IT!"
    else
        print_warning "No .env.example found at root"
    fi
else
    print_success ".env already exists at root"
fi

# Summary
print_section "Setup Complete!"
echo ""
echo "Core tools installed:"
echo "  ✅ UV: $(uv --version 2>/dev/null || echo 'not found')"
echo "  ✅ Python: $(uv python list 2>/dev/null | grep 3.13 | head -1 || echo 'not found')"
echo "  ✅ Node.js: $(node --version 2>/dev/null || echo 'not found')"
echo "  ✅ Docker: $(docker --version 2>/dev/null || echo 'not found')"
echo ""
echo "Next steps:"
echo "  1. Sign up for Neon PostgreSQL: https://neon.tech"
echo "  2. Get your DATABASE_URL and add to backend/.env"
echo "  3. Generate BETTER_AUTH_SECRET:"
echo "     python3 -c 'import secrets; print(secrets.token_urlsafe(32))'"
echo "  4. Add BETTER_AUTH_SECRET to backend/.env and frontend/.env.local"
echo "  5. Run backend: cd backend && uv run uvicorn app.main:app --reload"
echo "  6. Run frontend: cd frontend && npm run dev"
echo "  7. Or run both: docker-compose up --build"
echo ""
echo "For full installation guide, see: INSTALLATION.md"
echo ""
print_success "Happy coding! 🚀"
