# NEUROTEST

Full-stack web application for automated test/quiz generation and management.  
Frontend: React + Vite. Backend: Django + Django REST Framework.  
AI-powered test generation via OpenAI.

---

## Tech Stack

### Frontend
- React
- Vite
- react-router-dom
- jwt-decode

### Backend
- Python 3.x
- Django
- Django REST Framework
- djangorestframework-simplejwt (JWT auth)
- python-decouple (env config)
- django-cors-headers
- openai (OpenAI client)

---

## Key Features
- Generate tests from a topic using AI (OpenAI integration).  
- User authentication with JWT (login / register).  
- Create / retrieve / delete tests and save test results.  
- Responsive front-end (Vite + React).  
- Backend API served by Django REST Framework.  
- CORS configured to allow the Vite dev server (default `http://localhost:5173`).

---

Getting started (Local development)
Frontend (React + Vite)

Open new terminal, go to frontend folder:

cd front/neuro-test-app

Install dependencies:

```npm install```

Start dev server:

```npm run dev```

Vite will start (default port 5173). Frontend dev URL is usually http://localhost:5173.

If API base is configurable, ensure the frontend points to the backend API (check src/utils/fetchWithAuth.js and replace API_URL if needed):
```export const API_URL = "http://127.0.0.1:8000";```


Backend (Django)

Environment variables (.env)

Create a .env file in back/ai_test_platform/. Example:
```
# Django

SECRET_KEY=your_django_secret_key
DEBUG=True
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=127.0.0.1
DB_PORT=5432

# OpenAI
OPENAI_API_KEY=sk-...
```


Open terminal and go to the backend folder:

cd back/

Create & activate virtual environment:

```python -m venv .venv```
# Git Bash:
```source .venv/Scripts/activate```
# CMD / PowerShell:
# .venv\Scripts\activate


Install dependencies (install recommended packages or your requirements.txt):
cd back/ai_test_platform

```pip install django djangorestframework djangorestframework-simplejwt python-decouple django-cors-headers openai```
or 
```pip install -r requirements.txt```

Run migrations:

```python manage.py migrate```


(Optional) Create superuser:

```python manage.py createsuperuser```


Start the backend:

```python manage.py runserver```


Backend API will be available at http://127.0.0.1:8000/.
