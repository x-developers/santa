# 🎅 Тайный Санта

Веб-приложение для организации игры "Тайный Санта" с обменом подарками.

## Возможности

- Создание игры с уникальным кодом
- Добавление участников с пожеланиями к подарку
- Автоматическая жеребьёвка (никто не получит сам себя)
- Персональные ссылки для каждого участника
- Участник видит только кому он дарит подарок

## Деплой на Railway

### Способ 1: Через GitHub (рекомендуется)

1. Залей код на GitHub
2. Зайди на [railway.app](https://railway.app)
3. **New Project** → **Deploy from GitHub repo**

#### Backend:
1. Выбери репозиторий
2. Укажи **Root Directory**: `backend`
3. Railway автоматически задеплоит
4. Скопируй URL бэкенда (например `https://santa-backend-xxx.up.railway.app`)

#### Frontend:
1. В том же проекте нажми **+ New Service** → **GitHub Repo**
2. Выбери тот же репозиторий  
3. Укажи **Root Directory**: `frontend`
4. Добавь переменную окружения:
   ```
   VITE_API_URL=https://santa-backend-xxx.up.railway.app
   ```
5. Задеплой

### Способ 2: Через CLI

```bash
# Установи Railway CLI
npm install -g @railway/cli

# Залогинься
railway login

# Backend
cd backend
railway init
railway up

# Скопируй URL бэкенда, затем

# Frontend  
cd ../frontend
railway init
railway variables set VITE_API_URL=https://your-backend-url.up.railway.app
railway up
```

## Локальный запуск

### Docker (рекомендуется)

```bash
docker-compose up -d --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:8000

### Без Docker

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## API

| Метод | Endpoint | Описание |
|-------|----------|----------|
| POST | `/api/games` | Создать игру |
| GET | `/api/games/{code}` | Получить игру |
| POST | `/api/games/{code}/participants` | Добавить участника |
| DELETE | `/api/games/{code}/participants/{id}` | Удалить участника |
| POST | `/api/games/{code}/shuffle` | Провести жеребьёвку |
| POST | `/api/games/{code}/reshuffle` | Перераспределить |
| GET | `/api/participant/{token}` | Получить своё задание |

## Структура

```
Santa/
├── backend/
│   ├── app/
│   │   ├── main.py      # FastAPI приложение
│   │   ├── database.py  # SQLite подключение
│   │   ├── models.py    # SQLAlchemy модели
│   │   ├── schemas.py   # Pydantic схемы
│   │   └── routes.py    # API endpoints
│   ├── Dockerfile
│   ├── railway.json
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api.js       # API клиент
│   │   ├── pages/       # Страницы
│   │   ├── components/  # Компоненты
│   │   └── App.jsx
│   ├── Dockerfile
│   ├── railway.json
│   └── package.json
├── data/                # SQLite (локально)
├── docker-compose.yml
└── README.md
```

## Переменные окружения

### Backend
| Переменная | Описание | По умолчанию |
|------------|----------|--------------|
| `PORT` | Порт сервера | `8000` |
| `DATABASE_URL` | SQLite путь | `sqlite:///./data/santa.db` |

### Frontend
| Переменная | Описание | По умолчанию |
|------------|----------|--------------|
| `PORT` | Порт сервера | `3000` |
| `VITE_API_URL` | URL бэкенда | `` (пустая строка = тот же домен) |

## Технологии

- **Backend:** Python 3.11, FastAPI, SQLAlchemy, SQLite
- **Frontend:** React 18, Vite, TailwindCSS, React Router
- **Деплой:** Docker, Railway

---

🎄 Счастливого Нового Года! 🎄
