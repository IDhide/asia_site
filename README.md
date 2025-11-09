# Asia Site - Официальный сайт артистки Асия

Проект с Django backend и Next.js frontend.

## � СПервая установка

### 1. Установка зависимостей

```bash
# Backend
cd backend
python3 -m venv venv
source venv/bin/activate  # На Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser

# Frontend
cd ../frontend
npm install
cp .env.example .env.local
```

### 2. Запуск для разработки

```bash
# Backend (в одном терминале)
cd backend
source venv/bin/activate
python manage.py runserver 8000

# Frontend (в другом терминале)
cd frontend
npm run dev
```

- Backend: `http://localhost:8000`
- Frontend: `http://localhost:3010`
- Django Admin: `http://localhost:8000/admin`

## 🎨 Технологии

- Django 4.2 + Django REST Framework
- Next.js 15.3 + React 19 + TypeScript
- SQLite (dev) / PostgreSQL (production)
