# 🎅 Тайный Санта

Веб-приложение для организации игры "Тайный Санта" с обменом подарками.

## Возможности

- Создание игры с уникальным кодом
- Добавление участников с пожеланиями к подарку
- Автоматическая жеребьёвка (никто не получит сам себя)
- Персональные ссылки для каждого участника
- Участник видит только кому он дарит подарок

## Деплой на Railway (один клик)

1. Залей код на GitHub:
   ```bash
   git add .
   git commit -m "Add unified Dockerfile"
   git push
   ```

2. Зайди на [railway.app](https://railway.app)

3. **New Project** → **Deploy from GitHub repo**

4. Выбери репозиторий — Railway автоматически найдёт Dockerfile и задеплоит

5. (Опционально) Добавь PostgreSQL:
   - **+ New** → **Database** → **PostgreSQL**
   - Railway автоматически подключит его к приложению

6. Готово! 🎉

## Локальный запуск

### Docker Compose (рекомендуется)

```bash
docker-compose up -d --build
```

Приложение: http://localhost:3000

### Единый контейнер (как на Railway)

```bash
docker build -t santa .
docker run -p 8080:8080 santa
```

Приложение: http://localhost:8080

### Без Docker

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Структура

```
Santa/
├── Dockerfile          # Единый контейнер (frontend + backend + nginx)
├── nginx.conf          # Nginx конфигурация
├── start.sh            # Стартовый скрипт
├── railway.json        # Railway конфигурация
├── docker-compose.yml  # Для локальной разработки
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── routes.py
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── api.js
    │   ├── pages/
    │   └── components/
    └── package.json
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
| GET | `/health` | Health check |

## Технологии

- **Backend:** Python 3.11, FastAPI, SQLAlchemy, SQLite/PostgreSQL
- **Frontend:** React 18, Vite, TailwindCSS, React Router
- **Сервер:** Nginx (reverse proxy)
- **Деплой:** Docker, Railway

---

🎄 Счастливого Нового Года! 🎄
