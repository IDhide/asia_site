#!/bin/bash

set -e

# Конфигурация
SERVER="root@109.69.20.147"
PROJECT_DIR="/var/www/asia-site"
LOCAL_DIR="$(cd "$(dirname "$0")/.." && pwd)"

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Deploying Asia Site to server...${NC}"
echo ""

# Проверка SSH подключения
echo -e "${YELLOW}🔐 Checking SSH connection...${NC}"
if ! ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no $SERVER "echo 'SSH connection successful'" > /dev/null 2>&1; then
    echo -e "${RED}❌ Cannot connect to server${NC}"
    echo "Please check:"
    echo "  - Server is running"
    echo "  - SSH key is configured"
    echo "  - Server address is correct: $SERVER"
    exit 1
fi
echo -e "${GREEN}✅ SSH connection OK${NC}"
echo ""

# Создание директории проекта на сервере (если не существует)
echo -e "${YELLOW}📁 Preparing project directory...${NC}"
ssh $SERVER "mkdir -p $PROJECT_DIR"

# Синхронизация файлов
echo -e "${YELLOW}📤 Syncing files to server...${NC}"
rsync -avz --progress \
    --timeout=300 \
    -e "ssh -o ConnectTimeout=30 -o ServerAliveInterval=10 -o ServerAliveCountMax=3" \
    --exclude 'node_modules' \
    --exclude '.next' \
    --exclude 'venv' \
    --exclude '__pycache__' \
    --exclude '*.pyc' \
    --exclude '.git' \
    --exclude '.env' \
    --exclude '.env.local' \
    --exclude 'media' \
    --exclude 'staticfiles' \
    --exclude 'static_root' \
    --exclude '.DS_Store' \
    --exclude 'db.sqlite3' \
    $LOCAL_DIR/ $SERVER:$PROJECT_DIR/

echo -e "${GREEN}✅ Files synced${NC}"
echo ""

# Copy production environment files
echo -e "${YELLOW}⚙️  Copying production environment files...${NC}"

# Copy backend .env.production to server as .env
if [ -f "$LOCAL_DIR/backend/.env.production" ]; then
    scp "$LOCAL_DIR/backend/.env.production" $SERVER:$PROJECT_DIR/backend/.env
    echo -e "${GREEN}✅ Backend .env copied${NC}"
else
    echo -e "${RED}❌ backend/.env.production not found locally${NC}"
fi

# Copy frontend .env.production to server as .env.local
if [ -f "$LOCAL_DIR/frontend/.env.production" ]; then
    scp "$LOCAL_DIR/frontend/.env.production" $SERVER:$PROJECT_DIR/frontend/.env.local
    echo -e "${GREEN}✅ Frontend .env.local copied${NC}"
else
    echo -e "${RED}❌ frontend/.env.production not found locally${NC}"
fi

echo ""

# Запуск деплоя на сервере
echo -e "${YELLOW}🔧 Running deployment script on server...${NC}"
ssh $SERVER "cd $PROJECT_DIR && chmod +x deployment/deploy.sh && sudo ./deployment/deploy.sh"

echo ""
echo -e "${GREEN}🎉 Deployment complete!${NC}"
echo ""
echo -e "${BLUE}📝 Next steps:${NC}"
echo "1. Update environment files on server:"
echo "   ssh $SERVER"
echo "   nano $PROJECT_DIR/backend/.env"
echo "   nano $PROJECT_DIR/frontend/.env.local"
echo ""
echo "2. Update nginx config with your domain:"
echo "   sudo nano /etc/nginx/sites-available/asia-site.conf"
echo ""
echo "3. Setup SSL certificate:"
echo "   sudo certbot --nginx -d your-domain.com -d www.your-domain.com"
echo ""
echo "4. View logs:"
echo "   Backend:  ssh $SERVER 'sudo journalctl -u asia-backend -f'"
echo "   Frontend: ssh $SERVER 'sudo journalctl -u asia-frontend -f'"
echo ""
echo -e "${BLUE}🌐 Your site will be available at:${NC}"
echo "   http://109.69.20.147 (after configuration)"
echo "   https://your-domain.com (after SSL setup)"
