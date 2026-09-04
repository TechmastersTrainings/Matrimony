# Christian Matrimony Platform

A production-ready Christian Matrimony platform initially serving **Bidar, Karnataka, India**.

## Monorepo Architecture

```
christian-matrimony/
├── backend/          # Python + FastAPI REST API
├── web/              # Next.js + React + TypeScript Website
├── admin/            # Next.js + React + TypeScript Admin Panel
├── mobile/           # Flutter + Dart Mobile App (Android / iOS)
├── infrastructure/   # Docker configuration and deployment definitions
├── docs/             # Technical specifications and guides
├── README.md         # Repository overview and instructions
└── .gitignore        # Monorepo git exclusion rules
```

## Technology Stack

* **Website**: Next.js (App Router), React, TypeScript
* **Admin Panel**: Next.js (App Router), React, TypeScript
* **Mobile App**: Flutter, Dart
* **Backend**: Python 3.11+, FastAPI, Uvicorn, Pydantic v2
* **Database**: MySQL on Aiven (managed) via SQLAlchemy & PyMySQL
* **Database Migrations**: Alembic
* **Cache & Memory Store**: Upstash Redis
* **Media & Photo Storage**: Cloudflare R2 (S3 compatible)
* **Image Processing**: Pillow
* **Containerization**: Docker, Docker Compose
* **Monitoring**: Sentry

## Quick Start (Local Development)

### 1. Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your credentials
uvicorn app.main:app --reload --port 8000
```
- API Docs: `http://localhost:8000/docs`
- Health Check: `http://localhost:8000/health`

### 2. Website

```bash
cd web
npm install
cp .env.example .env.local
npm run dev -- -p 3000
```
- Web Application: `http://localhost:3000`

### 3. Admin Panel

```bash
cd admin
npm install
cp .env.example .env.local
npm run dev -- -p 3001
```
- Admin Panel: `http://localhost:3001`
- Admin Login: `http://localhost:3001/login`
- Admin Dashboard: `http://localhost:3001/dashboard`

### 4. Mobile App

```bash
cd mobile
flutter pub get
flutter run
```

## Git Branching Strategy

- `main`: Production-ready code
- `develop`: Active integration branch
- `feature/*`: Specific feature branches

---
© 2026 Christian Matrimony Platform. All rights reserved.
