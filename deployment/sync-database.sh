#!/bin/bash

SERVER="root@109.69.20.147"
PROJECT_DIR="/var/www/asia-site"
LOCAL_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "🗄️  Syncing database and media to server..."
echo ""

# Check if local database exists
if [ ! -f "$LOCAL_DIR/backend/db.sqlite3" ]; then
    echo "❌ Local database not found at backend/db.sqlite3"
    echo "Make sure you have data locally first"
    exit 1
fi

echo "📊 Local database found"
echo ""

# Backup remote database if it exists
echo "💾 Backing up remote database (if exists)..."
ssh $SERVER "cd $PROJECT_DIR/backend && [ -f db.sqlite3 ] && cp db.sqlite3 db.sqlite3.backup.$(date +%Y%m%d_%H%M%S) || echo 'No remote database to backup'"

# Copy database
echo "📤 Copying database to server..."
scp "$LOCAL_DIR/backend/db.sqlite3" $SERVER:$PROJECT_DIR/backend/db.sqlite3

# Copy media files
echo "📤 Copying media files to server..."
if [ -d "$LOCAL_DIR/backend/media" ]; then
    rsync -avz --progress "$LOCAL_DIR/backend/media/" $SERVER:$PROJECT_DIR/backend/media/
    echo "✅ Media files synced"
else
    echo "⚠️  No local media directory found"
fi

# Fix permissions
echo "🔧 Fixing permissions..."
ssh $SERVER << 'EOF'
    cd /var/www/asia-site/backend
    chown -R www-data:www-data db.sqlite3 media/
    chmod 664 db.sqlite3
    chmod -R 755 media/
EOF

# Restart backend
echo "🔄 Restarting backend..."
ssh $SERVER "sudo systemctl restart asia-backend"

echo ""
echo "✅ Database and media synced successfully!"
echo ""
echo "🌐 Check your site at http://109.69.20.147"
