# Setup script for The Evolution of Todo — Windows PowerShell
# Run with: powershell -ExecutionPolicy Bypass -File setup.ps1

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "The Evolution of Todo — Setup Script" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

function Print-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Print-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Print-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

function Print-Section {
    param([string]$Title)
    Write-Host ""
    Write-Host "======================================" -ForegroundColor Cyan
    Write-Host $Title -ForegroundColor Cyan
    Write-Host "======================================" -ForegroundColor Cyan
    Write-Host ""
}

# Check for Administrator privileges
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Print-Warning "This script should be run as Administrator for best results"
    Print-Warning "Some installations may fail without admin privileges"
    Write-Host ""
}

# Check for WSL 2
Print-Section "Checking WSL 2"
$wslVersion = wsl --status 2>$null
if ($LASTEXITCODE -eq 0) {
    Print-Success "WSL 2 is installed"
} else {
    Print-Warning "WSL 2 not detected. Installing WSL 2..."
    wsl --install
    Print-Warning "Please restart your computer and re-run this script"
    exit
}

# Check for winget (Windows Package Manager)
Print-Section "Checking winget"
if (Get-Command winget -ErrorAction SilentlyContinue) {
    Print-Success "winget is installed"
} else {
    Print-Error "winget not found. Please install from Microsoft Store: 'App Installer'"
    Print-Warning "Continuing without winget — some installations may be manual"
}

# Install Git
Print-Section "Installing Git"
if (Get-Command git -ErrorAction SilentlyContinue) {
    $gitVersion = git --version
    Print-Success "Git already installed ($gitVersion)"
} else {
    if (Get-Command winget -ErrorAction SilentlyContinue) {
        winget install --id Git.Git -e --source winget
        Print-Success "Git installed"
    } else {
        Print-Warning "Please download Git from: https://git-scm.com/download/win"
    }
}

# Install UV
Print-Section "Installing UV"
if (Get-Command uv -ErrorAction SilentlyContinue) {
    $uvVersion = uv --version
    Print-Success "UV already installed ($uvVersion)"
} else {
    powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
    Print-Success "UV installed"
    $env:Path += ";$env:USERPROFILE\.local\bin"
}

# Install Python 3.13 via UV
Print-Section "Installing Python 3.13"
$pythonList = uv python list 2>$null
if ($pythonList -match "3.13") {
    Print-Success "Python 3.13 already installed"
} else {
    uv python install 3.13.0
    Print-Success "Python 3.13 installed"
}

# Install Node.js
Print-Section "Installing Node.js 22 LTS"
if (Get-Command node -ErrorAction SilentlyContinue) {
    $nodeVersion = node --version
    Print-Success "Node.js already installed ($nodeVersion)"
} else {
    if (Get-Command winget -ErrorAction SilentlyContinue) {
        winget install OpenJS.NodeJS.LTS
        Print-Success "Node.js 22 LTS installed"
    } else {
        Print-Warning "Please download Node.js from: https://nodejs.org/"
    }
}

# Install Docker Desktop
Print-Section "Installing Docker Desktop"
if (Get-Command docker -ErrorAction SilentlyContinue) {
    $dockerVersion = docker --version
    Print-Success "Docker already installed ($dockerVersion)"
} else {
    Print-Warning "Docker Desktop not found"
    Print-Warning "Please download from: https://www.docker.com/products/docker-desktop/"
    Print-Warning "Make sure to enable WSL 2 integration in Docker Desktop settings"
}

# Backend setup in WSL
Print-Section "Setting Up Backend (in WSL)"
wsl bash -c "cd ~/projects/ToDo-Spec-Driven 2>/dev/null && cd backend && uv sync"
if ($LASTEXITCODE -eq 0) {
    Print-Success "Backend dependencies installed in WSL"
} else {
    Print-Warning "Could not set up backend in WSL"
    Print-Warning "Please run 'bash setup.sh' inside WSL Ubuntu"
}

# Frontend setup in WSL
Print-Section "Setting Up Frontend (in WSL)"
wsl bash -c "cd ~/projects/ToDo-Spec-Driven 2>/dev/null && cd frontend && npm install"
if ($LASTEXITCODE -eq 0) {
    Print-Success "Frontend dependencies installed in WSL"
} else {
    Print-Warning "Could not set up frontend in WSL"
    Print-Warning "Please run 'npm install' in frontend/ inside WSL Ubuntu"
}

# Summary
Print-Section "Setup Complete!"
Write-Host ""
Write-Host "Core tools status:"
if (Get-Command uv -ErrorAction SilentlyContinue) {
    $uvVersion = uv --version
    Write-Host "  ✅ UV: $uvVersion" -ForegroundColor Green
} else {
    Write-Host "  ❌ UV: not found" -ForegroundColor Red
}

if (Get-Command node -ErrorAction SilentlyContinue) {
    $nodeVersion = node --version
    Write-Host "  ✅ Node.js: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "  ❌ Node.js: not found" -ForegroundColor Red
}

if (Get-Command docker -ErrorAction SilentlyContinue) {
    $dockerVersion = docker --version
    Write-Host "  ✅ Docker: $dockerVersion" -ForegroundColor Green
} else {
    Write-Host "  ❌ Docker: not found" -ForegroundColor Red
}

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Open WSL Ubuntu: wsl"
Write-Host "  2. Navigate to project: cd ~/projects/ToDo-Spec-Driven"
Write-Host "  3. Run setup inside WSL: bash setup.sh"
Write-Host "  4. Follow INSTALLATION.md for detailed setup"
Write-Host ""
Print-Success "Happy coding! 🚀"
