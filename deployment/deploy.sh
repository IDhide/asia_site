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

# Check python3-venv
if ! dpkg -l python3.10-venv 2>/dev/null | grep -q "^ii"; then
    echo -e "${RED}❌ python3-venv is not installed${NC}"
    echo -e "${YELLOW}Installing python3-venv...${NC}"
    apt update
    apt install -y python3.10-venv
    echo -e "${GREEN}✅ python3-venv installed${NC}"
else
    echo -e "${GREEN}✅ python3-venv is already installed${NC}"
fi

# Check Node.js and npm
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo -e "${YELLOW}Installing Node.js 20.x...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
    echo -e "${GREEN}✅ Node.js installed${NC}"
    node --version
    npm --version
else
    echo -e "${GREEN}✅ Node.js $(node --version) is already installed${NC}"
fi

# Check Nginx
if ! command -v nginx &> /dev/null; then
    echo -e "${RED}❌ Nginx is not installed${NC}"
    echo -e "${YELLOW}Installing Nginx...${NC}"
    apt install -y nginx
    systemctl enable nginx
    systemctl start nginx
    echo -e "${GREEN}✅ Nginx installed${NC}"
else
    echo -e "${GREEN}✅ Nginx is already installed${NC}"
fi

# Check and create swap if needed
if [ ! -f /swapfile ]; then
    echo -e "${YELLOW}Creating swap file (2GB)...${NC}"
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
    echo -e "${GREEN}✅ Swap created${NC}"
else
    # Ensure swap is enabled
    swapon /swapfile 2>/dev/null || true
    echo -e "${GREEN}✅ Swap is available${NC}"
fi

echo -e "${YELLOW}📥 Pulling latest code...${NC}"
if [ -d "$PROJECT_DIR/.git" ]; then
    cd $PROJECT_DIR
    git pull origin main
else
    echo "No git repository found, skipping pull"
fi

# ========== BACKEND DEPLOYMENT ==========
echo -e "${YELLOW}🐍 Deploying Backend (Django)...${NC}"
cd $BACKEND_DIR

# Remove old venv if it's broken
if [ -d "venv" ] && [ ! -f "venv/bin/activate" ]; then
    echo "Removing broken virtual environment..."
    rm -rf venv
fi

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to create virtual environment${NC}"
        echo "Trying to diagnose the issue..."
        which python3
        python3 --version
        python3 -m venv --help
        exit 1
    fi
    echo -e "${GREEN}✅ Virtual environment created${NC}"
fi

# Activate virtual environment and install dependencies
if [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
    echo -e "${GREEN}✅ Virtual environment activated${NC}"
else
    echo -e "${RED}❌ Virtual environment activation script not found${NC}"
    echo "Contents of venv directory:"
    ls -la venv/ || echo "venv directory doesn't exist"
    exit 1
fi
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
# Set memory limit for node
export NODE_OPTIONS="--max-old-space-size=768"
# Install all dependencies (including dev) - needed for next.config.ts
npm install

# Build Next.js application
echo "Building Next.js application..."
npm run build

# Note: We keep dev dependencies because next.config.ts requires TypeScript at runtime

# Fix npm cache permissions
if [ -d /var/www/.npm ]; then
    chown -R www-data:www-data /var/www/.npm
fi

# Set permissions
chown -R www-data:www-data $FRONTEND_DIR
chmod -R 755 $FRONTEND_DIR

echo -e "${GREEN}✅ Frontend deployed successfully${NC}"

# ========== SETUP SYSTEMD SERVICES ==========
echo -e "${YELLOW}🔧 Setting up systemd services...${NC}"

# Install/Update backend service
echo "Updating backend service..."
cp $PROJECT_DIR/deployment/systemd/asia-backend.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable asia-backend
echo -e "${GREEN}✅ Backend service updated${NC}"

# Install/Update frontend service
echo "Updating frontend service..."
cp $PROJECT_DIR/deployment/systemd/asia-frontend.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable asia-frontend
echo -e "${GREEN}✅ Frontend service updated${NC}"

# ========== RESTART SERVICES ==========
echo -e "${YELLOW}🔄 Restarting services...${NC}"

# Restart backend
if systemctl restart asia-backend; then
    echo -e "${GREEN}✅ Backend service restarted${NC}"
else
    echo -e "${RED}❌ Backend service failed to start${NC}"
    echo "Checking logs..."
    journalctl -u asia-backend -n 20 --no-pager
fi

# Restart frontend
if systemctl restart asia-frontend; then
    echo -e "${GREEN}✅ Frontend service restarted${NC}"
else
    echo -e "${RED}❌ Frontend service failed to start${NC}"
    echo "Checking logs..."
    journalctl -u asia-frontend -n 20 --no-pager
fi

# Setup Nginx config
echo -e "${YELLOW}🌐 Setting up Nginx...${NC}"
if [ -f "$PROJECT_DIR/deployment/nginx/asia-site.conf" ]; then
    cp $PROJECT_DIR/deployment/nginx/asia-site.conf /etc/nginx/sites-available/asia-site.conf
    
    # Enable site if not already enabled
    if [ ! -L /etc/nginx/sites-enabled/asia-site.conf ]; then
        ln -s /etc/nginx/sites-available/asia-site.conf /etc/nginx/sites-enabled/
        echo "Nginx site enabled"
    fi
    
    # Remove default site if exists
    if [ -L /etc/nginx/sites-enabled/default ]; then
        rm /etc/nginx/sites-enabled/default
        echo "Default site disabled"
    fi
    
    # Test and reload nginx
    if nginx -t 2>/dev/null; then
        systemctl reload nginx
        echo -e "${GREEN}✅ Nginx reloaded${NC}"
    else
        echo -e "${RED}❌ Nginx config has errors${NC}"
        nginx -t
    fi
else
    echo -e "${YELLOW}⚠️  Nginx config not found${NC}"
fi

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
