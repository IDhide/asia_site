# Руководство по деплою Asia Site

## Быстрый деплой на сервер

### 1. Подготовка сервера

```bash
# Обновить систему
sudo apt update && sudo apt upgrade -y

# Установить необходимые пакеты
sudo apt install -y python3 python3-pip python3-venv nginx nodejs npm git

# Установить Node.js 18+ (если нужна более новая версия)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

### 2. Клонирование проекта

```bash
# Создать директорию
sudo mkdir -p /var/www
cd /var/www

# Клонировать репозиторий
sudo git clone <your-repo-url> asia-site
cd asia-site

# Установить права
sudo chown -R $USER:$USER /var/www/asia-site
```

### 3. Настройка Backend

```bash
cd /var/www/asia-site/backend

# Создать виртуальное окружение
python3 -m venv venv
source venv/bin/activate

# Установить зависимости
pip install -r requirements.txt

# Создать .env файл
cp .env.example .env
nano .env  # Отредактировать настройки

# Применить миграции
python manage.py migrate

# Создать суперпользователя
python manage.py createsuperuser

# Собрать статику
python manage.py collectstatic --noinput

# Создать директорию для media
mkdir -p media

deactivate
```

### 4. Настройка Frontend

```bash
cd /var/www/asia-site/frontend

# Установить зависимости
npm install

# Создать .env.local
cp .env.example .env.local
nano .env.local  # Отредактировать настройки

# Собрать production версию
npm run build
```

### 5. Установка Systemd сервисов

```bash
# Backend service
sudo cp /var/www/asia-site/deployment/systemd/asia-backend.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable asia-backend
sudo systemctl start asia-backend

# Frontend service
sudo cp /var/www/asia-site/deployment/systemd/asia-frontend.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable asia-frontend
sudo systemctl start asia-frontend

# Проверить статус
sudo systemctl status asia-backend
sudo systemctl status asia-frontend
```

### 6. Настройка Nginx

```bash
# Скопировать конфиг
sudo cp /var/www/asia-site/deployment/nginx/asia-site.conf /etc/nginx/sites-available/

# Отредактировать домен
sudo nano /etc/nginx/sites-available/asia-site.conf
# Заменить your-domain.com на ваш домен

# Создать симлинк
sudo ln -s /etc/nginx/sites-available/asia-site.conf /etc/nginx/sites-enabled/

# Удалить дефолтный конфиг (опционально)
sudo rm /etc/nginx/sites-enabled/default

# Проверить конфигурацию
sudo nginx -t

# Перезапустить Nginx
sudo systemctl restart nginx
```

### 7. Установка SSL (Let's Encrypt)

```bash
# Установить certbot
sudo apt install -y certbot python3-certbot-nginx

# Получить сертификат
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Проверить автообновление
sudo certbot renew --dry-run
```

## Обновление проекта

После внесения изменений в код:

```bash
cd /var/www/asia-site
sudo ./deployment/deploy.sh
```

Или вручную:

```bash
# Pull изменений
cd /var/www/asia-site
git pull origin main

# Backend
cd backend
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
deactivate
sudo systemctl restart asia-backend

# Frontend
cd ../frontend
npm install
npm run build
sudo systemctl restart asia-frontend

# Nginx
sudo nginx -t && sudo systemctl reload nginx
```

## Просмотр логов

```bash
# Backend logs
sudo journalctl -u asia-backend -f

# Frontend logs
sudo journalctl -u asia-frontend -f

# Nginx access logs
sudo tail -f /var/log/nginx/asia-site-access.log

# Nginx error logs
sudo tail -f /var/log/nginx/asia-site-error.log
```

## Troubleshooting

### Backend не запускается

```bash
# Проверить логи
sudo journalctl -u asia-backend -n 100

# Проверить конфигурацию
cd /var/www/asia-site/backend
source venv/bin/activate
python manage.py check
python manage.py showmigrations
```

### Frontend не запускается

```bash
# Проверить логи
sudo journalctl -u asia-frontend -n 100

# Проверить сборку
cd /var/www/asia-site/frontend
npm run build
```

### 502 Bad Gateway

```bash
# Проверить, что сервисы запущены
sudo systemctl status asia-backend
sudo systemctl status asia-frontend

# Проверить порты
sudo netstat -tulpn | grep :8000
sudo netstat -tulpn | grep :3010

# Перезапустить сервисы
sudo systemctl restart asia-backend
sudo systemctl restart asia-frontend
sudo systemctl restart nginx
```

### Проблемы с правами доступа

```bash
# Установить правильные права
sudo chown -R www-data:www-data /var/www/asia-site/backend/media
sudo chown -R www-data:www-data /var/www/asia-site/backend/static
sudo chmod -R 755 /var/www/asia-site
```

## Мониторинг

### Проверка статуса сервисов

```bash
# Все сервисы
sudo systemctl status asia-backend asia-frontend nginx

# Автозапуск
sudo systemctl is-enabled asia-backend
sudo systemctl is-enabled asia-frontend
```

### Использование ресурсов

```bash
# CPU и память
htop

# Дисковое пространство
df -h

# Размер media файлов
du -sh /var/www/asia-site/backend/media
```

## Бэкап

### База данных

```bash
# SQLite backup
cp /var/www/asia-site/backend/db.sqlite3 /var/backups/asia-db-$(date +%Y%m%d).sqlite3

# PostgreSQL backup (если используется)
pg_dump asia_db > /var/backups/asia-db-$(date +%Y%m%d).sql
```

### Media файлы

```bash
# Создать архив
tar -czf /var/backups/asia-media-$(date +%Y%m%d).tar.gz /var/www/asia-site/backend/media
```

### Автоматический бэкап (cron)

```bash
# Добавить в crontab
sudo crontab -e

# Ежедневный бэкап в 3:00
0 3 * * * cp /var/www/asia-site/backend/db.sqlite3 /var/backups/asia-db-$(date +\%Y\%m\%d).sqlite3
0 3 * * * tar -czf /var/backups/asia-media-$(date +\%Y\%m\%d).tar.gz /var/www/asia-site/backend/media
```
