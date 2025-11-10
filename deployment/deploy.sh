#!/bin/bash

set -e

echo "🚀 Starting deployment of Asia Site..."

PROJECT_DIR="/var/www/asia-site"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}Please run with sudo${NC}"
    exit 1
fi

# Check for required packages
echo -e "${YELLOW}🔍 Checking required packages...${NC}"
if ! dpkg -l | grep -q python3-venv; then
    echo -e "${RED}❌ python3-venv is not installed${NC}"
    echo -e "${YELLOW}Installing python3-venv...${NC}"
    apt update
    apt install -y python3.10-venv
    echo -e "${GREEN}✅ python3-venv installed${NC}"
fi

echo -e "${YELLOW}📥 Pulling latest code...${NC}"
cd $PROJECT_DIR
git pull origin main || echo "No git repository found, skipping pull"

# ========== BACKEND DEPLOYMENT ==========
echo -e "${YELLOW}🐍 Deploying Backend (Django)...${NC}"
cd $BACKEND_DIR

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment and install dependencies
source venv/bin/activate
echo "Installing Python dependencies..."
pip install -r requirements.txt
pip install gunicorn  # For production

# Run Django management commands
echo "Running Django migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput

# Create media directory if it doesn't exist
mkdir -p media

# Set permissions
chown -R www-data:www-data $BACKEND_DIR
chmod -R 755 $BACKEND_DIR

deactivate

echo -e "${GREEN}✅ Backend deployed successfully${NC}"

# ========== FRONTEND DEPLOYMENT ==========
echo -e "${YELLOW}⚛️  Deploying Frontend (Next.js)...${NC}"
cd $FRONTEND_DIR

# Install dependencies
echo "Installing npm dependencies..."
npm ci --production=false

# Build Next.js application
echo "Building Next.js application..."
npm run build

# Set permissions
chown -R www-data:www-data $FRONTEND_DIR
chmod -R 755 $FRONTEND_DIR

echo -e "${GREEN}✅ Frontend deployed successfully${NC}"

# ========== RESTART SERVICES ==========
echo -e "${YELLOW}🔄 Restarting services...${NC}"

# Restart backend
systemctl restart asia-backend
echo "Backend service restarted"

# Restart frontend
systemctl restart asia-frontend
echo "Frontend service restarted"

# Reload nginx
nginx -t && systemctl reload nginx
echo "Nginx reloaded"

# ========== CHECK STATUS ==========
echo -e "${YELLOW}📊 Checking service status...${NC}"

if systemctl is-active --quiet asia-backend; then
    echo -e "${GREEN}✅ Backend is running${NC}"
else
    echo -e "${RED}❌ Backend is not running${NC}"
    systemctl status asia-backend --no-pager
fi

if systemctl is-active --quiet asia-frontend; then
    echo -e "${GREEN}✅ Frontend is running${NC}"
else
    echo -e "${RED}❌ Frontend is not running${NC}"
    systemctl status asia-frontend --no-pager
fi

echo -e "${GREEN}🎉 Deployment complete!${NC}"
echo ""
echo "View logs:"
echo "  Backend:  sudo journalctl -u asia-backend -f"
echo "  Frontend: sudo journalctl -u asia-frontend -f"
echo "  Nginx:    sudo tail -f /var/log/nginx/asia-site-error.log"
