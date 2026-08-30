import React from "react";
import { APP_CONFIG } from "../lib/config";
import { SystemService } from "../services/api";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const health = await SystemService.checkHealth();

  return (
    <div className="container">
      <section className="hero">
        <h1 className="hero-title">
          Christian Matrimony Platform <br />
          <span>Serving Bidar, Karnataka</span>
        </h1>
        <p className="hero-subtitle">
          Phase 1 Foundation successfully established. Verified service abstractions for FastAPI, Aiven MySQL, Upstash Redis, and Cloudflare R2.
        </p>

        <div
          className={`status-pill ${
            health.status === "healthy" ? "status-healthy" : "status-degraded"
          }`}
        >
          <span className="status-dot" />
          <span>System Status: {health.status.toUpperCase()}</span>
        </div>
      </section>

      <section className="card-grid">
        <div className="card">
          <div className="card-icon">⚡</div>
          <h3 className="card-title">FastAPI Backend</h3>
          <p className="card-desc">
            Production REST API with OpenAPI/Swagger docs, structured logging, CORS, and unified error handling.
          </p>
        </div>

        <div className="card">
          <div className="card-icon">🗄️</div>
          <h3 className="card-title">Aiven MySQL & Alembic</h3>
          <p className="card-desc">
            SQLAlchemy 2.0 connection pool with PyMySQL, SSL support, and Alembic database migration management.
          </p>
        </div>

        <div className="card">
          <div className="card-icon">☁️</div>
          <h3 className="card-title">Cloudflare R2 Storage</h3>
          <p className="card-desc">
            S3-compatible object storage service abstraction with upload, retrieve, delete, and presigned URL capabilities.
          </p>
        </div>

        <div className="card">
          <div className="card-icon">🏎️</div>
          <h3 className="card-title">Upstash Redis</h3>
          <p className="card-desc">
            Low-latency managed Redis caching and session store configuration foundation.
          </p>
        </div>

        <div className="card">
          <div className="card-icon">📱</div>
          <h3 className="card-title">Flutter Mobile Foundation</h3>
          <p className="card-desc">
            Modular Flutter & Dart client structure with routing, theme system, and HTTP API client.
          </p>
        </div>

        <div className="card">
          <div className="card-icon">🛡️</div>
          <h3 className="card-title">Admin Management Portal</h3>
          <p className="card-desc">
            Next.js App Router admin application foundation with isolated routes for authentication and analytics.
          </p>
        </div>
      </section>
    </div>
  );
}
