# System Architecture & Service Abstractions

## 1. Overview

The Christian Matrimony platform is structured as a unified monorepo serving Christian communities initially centered in **Bidar, Karnataka, India**.

## 2. Technology Stack & Roles

| Layer | Technology | Hosting / Provider |
|---|---|---|
| **Website** | Next.js (App Router), React, TypeScript | Vercel |
| **Admin Panel** | Next.js (App Router), React, TypeScript | Vercel |
| **Mobile App** | Flutter, Dart | Google Play & Apple App Store |
| **Backend API** | Python, FastAPI, Uvicorn | Render |
| **Database** | MySQL 8.0, SQLAlchemy 2.0, Alembic | Aiven MySQL |
| **Cache & Realtime** | Redis 7+ | Upstash Redis |
| **Media / Photos** | S3-compatible Object Storage | Cloudflare R2 |
| **Monitoring** | Sentry SDK | Sentry Cloud |

## 3. Service Layer Abstraction Design

Every external dependency is cleanly decoupled via abstract interfaces (`ABC` in Python) in `backend/app/services/`:

- **`IStorageService` (`storage.py`)**: Abstract object storage. Default implementation `CloudflareR2StorageService` handles uploading, streaming retrieval, deletion, and presigned URLs.
- **`DatabaseService` (`database.py`)**: Manages SQLAlchemy engine connection pooling with automatic reconnection (`pool_pre_ping=True`) and dependency injection for FastAPI request contexts (`get_db`).
- **`RedisService` (`redis.py`)**: Managed Upstash Redis connection singleton with automatic timeout guards.
- **`ISmsService` (`sms.py`)**: Interface prepared for Indian SMS providers (Fast2SMS, MSG91, Textlocal).
- **`IPaymentService` (`payment.py`)**: Interface prepared for Indian UPI payment gateways (Razorpay, Cashfree, PhonePe).
- **`IEmailService` (`email.py`)**: Interface prepared for transactional email services.
- **`INotificationService` (`notification.py`)**: Interface prepared for Firebase Cloud Messaging (FCM).

## 4. Security & Environment Principles

1. **Zero Secrets in Code**: All sensitive credentials (`DATABASE_URL`, `REDIS_URL`, `R2_*`, etc.) must exclusively reside in `.env` files.
2. **Strict Git Exclusion**: `.gitignore` strictly ignores all `.env` files while committing template `.env.example` files.
3. **CORS Isolation**: Restricts API calls strictly to permitted origins (`web`, `admin`, mobile apps).
