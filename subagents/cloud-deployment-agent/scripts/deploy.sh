#!/bin/bash
# Universal Deployment Script for FastAPI + Next.js + PostgreSQL
# Supports: AWS, GCP, Azure, Kubernetes
# Auto-detects cloud provider or uses --provider flag

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default values
PROVIDER=""
APP_NAME="todo-app"
ENVIRONMENT="production"
REGION=""
DRY_RUN=false
SKIP_TESTS=false

# Usage
usage() {
    cat <<EOF
Usage: $0 [OPTIONS]

Deploy FastAPI + Next.js + PostgreSQL application to cloud.

OPTIONS:
    --provider PROVIDER     Cloud provider: aws, gcp, azure, k8s (required if not auto-detected)
    --app-name NAME         Application name (default: todo-app)
    --environment ENV       Environment: dev, staging, production (default: production)
    --region REGION         Cloud region (required for aws/gcp/azure)
    --dry-run               Show what would be deployed without deploying
    --skip-tests            Skip running tests before deployment
    --help                  Show this help message

EXAMPLES:
    # Auto-detect provider and deploy
    $0 --auto-detect

    # Deploy to AWS
    $0 --provider aws --region us-east-1

    # Deploy to GCP
    $0 --provider gcp --region us-central1

    # Deploy to Kubernetes
    $0 --provider k8s

    # Dry run (show what would be deployed)
    $0 --provider aws --region us-east-1 --dry-run
EOF
    exit 1
}

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --provider)
            PROVIDER="$2"
            shift 2
            ;;
        --app-name)
            APP_NAME="$2"
            shift 2
            ;;
        --environment)
            ENVIRONMENT="$2"
            shift 2
            ;;
        --region)
            REGION="$2"
            shift 2
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --skip-tests)
            SKIP_TESTS=true
            shift
            ;;
        --auto-detect)
            PROVIDER="auto"
            shift
            ;;
        --help)
            usage
            ;;
        *)
            echo "Unknown option: $1"
            usage
            ;;
    esac
done

# Auto-detect cloud provider
detect_provider() {
    echo -e "${YELLOW}Auto-detecting cloud provider...${NC}"

    # Check for kubectl (Kubernetes)
    if command -v kubectl &> /dev/null; then
        if kubectl cluster-info &> /dev/null; then
            echo -e "${GREEN}✓ Kubernetes cluster detected${NC}"
            PROVIDER="k8s"
            return
        fi
    fi

    # Check for AWS CLI
    if command -v aws &> /dev/null; then
        if aws sts get-caller-identity &> /dev/null; then
            echo -e "${GREEN}✓ AWS credentials detected${NC}"
            PROVIDER="aws"
            return
        fi
    fi

    # Check for GCP CLI
    if command -v gcloud &> /dev/null; then
        if gcloud auth list --filter=status:ACTIVE --format="value(account)" &> /dev/null; then
            echo -e "${GREEN}✓ GCP credentials detected${NC}"
            PROVIDER="gcp"
            return
        fi
    fi

    # Check for Azure CLI
    if command -v az &> /dev/null; then
        if az account show &> /dev/null; then
            echo -e "${GREEN}✓ Azure credentials detected${NC}"
            PROVIDER="azure"
            return
        fi
    fi

    echo -e "${RED}✗ No cloud provider detected. Please specify --provider${NC}"
    exit 1
}

# Validate environment
validate() {
    echo -e "${YELLOW}Validating environment...${NC}"

    # Check Docker
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}✗ Docker not found. Please install Docker.${NC}"
        exit 1
    fi

    # Check provider-specific tools
    case $PROVIDER in
        aws)
            if ! command -v aws &> /dev/null; then
                echo -e "${RED}✗ AWS CLI not found${NC}"
                exit 1
            fi
            if [ -z "$REGION" ]; then
                echo -e "${RED}✗ --region required for AWS${NC}"
                exit 1
            fi
            ;;
        gcp)
            if ! command -v gcloud &> /dev/null; then
                echo -e "${RED}✗ gcloud CLI not found${NC}"
                exit 1
            fi
            if [ -z "$REGION" ]; then
                echo -e "${RED}✗ --region required for GCP${NC}"
                exit 1
            fi
            ;;
        azure)
            if ! command -v az &> /dev/null; then
                echo -e "${RED}✗ Azure CLI not found${NC}"
                exit 1
            fi
            ;;
        k8s)
            if ! command -v kubectl &> /dev/null; then
                echo -e "${RED}✗ kubectl not found${NC}"
                exit 1
            fi
            ;;
    esac

    echo -e "${GREEN}✓ Environment validated${NC}"
}

# Run tests
run_tests() {
    if [ "$SKIP_TESTS" = true ]; then
        echo -e "${YELLOW}⊘ Skipping tests${NC}"
        return
    fi

    echo -e "${YELLOW}Running tests...${NC}"

    # Backend tests
    if [ -f "backend/pyproject.toml" ]; then
        cd backend
        uv run pytest tests/ -v || {
            echo -e "${RED}✗ Backend tests failed${NC}"
            exit 1
        }
        cd ..
        echo -e "${GREEN}✓ Backend tests passed${NC}"
    fi

    # Frontend tests
    if [ -f "frontend/package.json" ]; then
        cd frontend
        npm test -- --passWithNoTests || {
            echo -e "${RED}✗ Frontend tests failed${NC}"
            exit 1
        }
        cd ..
        echo -e "${GREEN}✓ Frontend tests passed${NC}"
    fi
}

# Build Docker images
build_images() {
    echo -e "${YELLOW}Building Docker images...${NC}"

    # Backend
    docker build -t ${APP_NAME}-backend:latest ./backend
    echo -e "${GREEN}✓ Backend image built${NC}"

    # Frontend
    docker build -t ${APP_NAME}-frontend:latest ./frontend
    echo -e "${GREEN}✓ Frontend image built${NC}"
}

# Deploy to AWS
deploy_aws() {
    echo -e "${YELLOW}Deploying to AWS...${NC}"

    # Push images to ECR
    aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$REGION.amazonaws.com

    # Tag and push backend
    docker tag ${APP_NAME}-backend:latest $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$REGION.amazonaws.com/${APP_NAME}-backend:latest
    docker push $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$REGION.amazonaws.com/${APP_NAME}-backend:latest

    # Tag and push frontend
    docker tag ${APP_NAME}-frontend:latest $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$REGION.amazonaws.com/${APP_NAME}-frontend:latest
    docker push $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$REGION.amazonaws.com/${APP_NAME}-frontend:latest

    # Deploy via CloudFormation or ECS
    if [ -f "infrastructure/aws/cloudformation.yaml" ]; then
        aws cloudformation deploy \
            --template-file infrastructure/aws/cloudformation.yaml \
            --stack-name ${APP_NAME}-${ENVIRONMENT} \
            --parameter-overrides Environment=$ENVIRONMENT \
            --region $REGION
    fi

    echo -e "${GREEN}✓ Deployed to AWS${NC}"
}

# Deploy to GCP
deploy_gcp() {
    echo -e "${YELLOW}Deploying to GCP...${NC}"

    # Get project ID
    PROJECT_ID=$(gcloud config get-value project)

    # Push images to GCR
    docker tag ${APP_NAME}-backend:latest gcr.io/$PROJECT_ID/${APP_NAME}-backend:latest
    docker push gcr.io/$PROJECT_ID/${APP_NAME}-backend:latest

    docker tag ${APP_NAME}-frontend:latest gcr.io/$PROJECT_ID/${APP_NAME}-frontend:latest
    docker push gcr.io/$PROJECT_ID/${APP_NAME}-frontend:latest

    # Deploy to Cloud Run
    gcloud run deploy ${APP_NAME}-backend \
        --image gcr.io/$PROJECT_ID/${APP_NAME}-backend:latest \
        --region $REGION \
        --platform managed \
        --allow-unauthenticated

    gcloud run deploy ${APP_NAME}-frontend \
        --image gcr.io/$PROJECT_ID/${APP_NAME}-frontend:latest \
        --region $REGION \
        --platform managed \
        --allow-unauthenticated

    echo -e "${GREEN}✓ Deployed to GCP${NC}"
}

# Deploy to Azure
deploy_azure() {
    echo -e "${YELLOW}Deploying to Azure...${NC}"

    # Create resource group
    az group create --name ${APP_NAME}-rg --location eastus

    # Push images to ACR
    az acr login --name ${APP_NAME}registry
    docker tag ${APP_NAME}-backend:latest ${APP_NAME}registry.azurecr.io/${APP_NAME}-backend:latest
    docker push ${APP_NAME}registry.azurecr.io/${APP_NAME}-backend:latest

    docker tag ${APP_NAME}-frontend:latest ${APP_NAME}registry.azurecr.io/${APP_NAME}-frontend:latest
    docker push ${APP_NAME}registry.azurecr.io/${APP_NAME}-frontend:latest

    # Deploy to App Service
    az webapp create \
        --resource-group ${APP_NAME}-rg \
        --plan ${APP_NAME}-plan \
        --name ${APP_NAME}-backend \
        --deployment-container-image-name ${APP_NAME}registry.azurecr.io/${APP_NAME}-backend:latest

    echo -e "${GREEN}✓ Deployed to Azure${NC}"
}

# Deploy to Kubernetes
deploy_k8s() {
    echo -e "${YELLOW}Deploying to Kubernetes...${NC}"

    # Apply manifests
    if [ -f "kubernetes/deployment.yaml" ]; then
        kubectl apply -f kubernetes/deployment.yaml
    elif [ -f "skills/cloud-native-devops/blueprints/kubernetes-deployment.yaml" ]; then
        kubectl apply -f skills/cloud-native-devops/blueprints/kubernetes-deployment.yaml
    else
        echo -e "${RED}✗ No Kubernetes manifests found${NC}"
        exit 1
    fi

    # Wait for rollout
    kubectl rollout status deployment/${APP_NAME}-backend -n ${APP_NAME}
    kubectl rollout status deployment/${APP_NAME}-frontend -n ${APP_NAME}

    echo -e "${GREEN}✓ Deployed to Kubernetes${NC}"
}

# Main execution
main() {
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}   Universal Deployment Script${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""

    # Auto-detect provider if needed
    if [ "$PROVIDER" = "auto" ] || [ -z "$PROVIDER" ]; then
        detect_provider
    fi

    echo "Provider: $PROVIDER"
    echo "App Name: $APP_NAME"
    echo "Environment: $ENVIRONMENT"
    [ -n "$REGION" ] && echo "Region: $REGION"
    echo ""

    if [ "$DRY_RUN" = true ]; then
        echo -e "${YELLOW}DRY RUN MODE - No changes will be made${NC}"
        exit 0
    fi

    # Validate
    validate

    # Run tests
    run_tests

    # Build images
    build_images

    # Deploy based on provider
    case $PROVIDER in
        aws)
            deploy_aws
            ;;
        gcp)
            deploy_gcp
            ;;
        azure)
            deploy_azure
            ;;
        k8s)
            deploy_k8s
            ;;
        *)
            echo -e "${RED}✗ Unknown provider: $PROVIDER${NC}"
            exit 1
            ;;
    esac

    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}   Deployment Complete!${NC}"
    echo -e "${GREEN}========================================${NC}"
}

# Run main
main
