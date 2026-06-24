# Movie Ticket App

Monorepo movie ticket booking app: **React (Vite, JavaScript)** frontend + **Django REST Framework** backend + **PostgreSQL**. Browse movies, pick seats, and book tickets (no payment in MVP). Deploy to [Render](https://render.com) via Blueprint.

## Stack

- **Frontend**: React 18, Vite, React Router, Axios (JWT in localStorage)
- **Backend**: Django 5, DRF, djangorestframework-simplejwt
- **Database**: PostgreSQL (Render managed DB in production; native install locally)
- **Deploy**: `render.yaml` Blueprint — PostgreSQL + Django web service + static site

## Project structure

```
movie_ticket_app/
├── backend/           # Django API
├── frontend/          # React SPA (.jsx only)
├── .env/              # Local credentials (gitignored)
├── .env.example/      # Committed templates
├── render.yaml        # Render Blueprint
└── README.md
```

## Local setup

### 1. Credentials

```bash
mkdir -p .env
cp .env.example/backend.env.example  .env/backend.env
cp .env.example/frontend.env.example .env/frontend.env
```

Edit `.env/backend.env`:

```env
DATABASE_URL=postgres://USER:PASSWORD@localhost:5432/movie_ticket_dev
SECRET_KEY=local-dev-secret
DEBUG=True
CORS_ALLOWED_ORIGINS=http://localhost:5173
CITY_NAME=YourCity
```

Edit `.env/frontend.env`:

```env
VITE_API_URL=http://localhost:8000
```

### 2. PostgreSQL (native, no Docker)

```bash
sudo apt install postgresql postgresql-contrib
sudo -u postgres createuser --interactive   # create a dev user
sudo -u postgres createdb movie_ticket_dev
```

If PostgreSQL is unavailable, omit `DATABASE_URL` from `.env/backend.env` and Django falls back to SQLite for local development.

### 3. Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_city_data
python manage.py createsuperuser   # optional, for Django admin
python manage.py runserver
```

API runs at `http://localhost:8000`. Admin at `/admin/`.

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`.

## API endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register/` | Public | Create account |
| POST | `/api/auth/login/` | Public | JWT access + refresh |
| POST | `/api/auth/refresh/` | Public | Refresh access token |
| GET | `/api/movies/` | Public | List movies |
| GET | `/api/movies/{id}/` | Public | Movie detail + showtimes |
| GET | `/api/showtimes/{id}/seats/` | Public | Seat availability map |
| POST | `/api/bookings/` | JWT | Book seats |
| GET | `/api/bookings/me/` | JWT | User booking history |

## Render deployment

1. Push this repo to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial movie ticket app"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. In Render: **New → Blueprint** → connect repo → Render reads `render.yaml`.

3. After deploy, set in the **movie-ticket-api** service dashboard:
   - `CORS_ALLOWED_ORIGINS` = your static site URL (e.g. `https://movie-ticket-web.onrender.com`)
   - Strong `SECRET_KEY` if not using generated value

4. Open a Render shell on the API service and seed data once:
   ```bash
   python manage.py seed_city_data
   ```

5. Subsequent Git pushes auto-deploy all three resources.

### Production settings

- `DJANGO_SETTINGS_MODULE=config.settings_production` (set in `render.yaml`)
- `DEBUG=False`, `SECRET_KEY` and `DATABASE_URL` required
- Static files served via WhiteNoise; frontend built separately as static site

## Development commands

```bash
# Backend checks
cd backend && python manage.py check

# Seed / re-seed sample data
python manage.py seed_city_data
python manage.py seed_city_data --clear

# Frontend production build
cd frontend && npm run build
```

## License

MIT
