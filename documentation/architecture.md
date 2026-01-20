## Architecture Overview

This project is an **air quality monitoring system** built as a small microservice-based backend, using a NestJS monorepo and Docker for local orchestration.

At a high level:

- **Collector Service**: pulls air quality data from external providers (e.g. Google), validates it, and publishes alert events into a message queue.
- **Processor Service**: consumes those alert events, stores them in a PostgreSQL database, and exposes them via a REST API (with Swagger docs) and WebSocket updates.
- **Shared libraries**: provide reusable building blocks for logging, messaging, and air-quality domain logic so both services stay small and focused.

Both microservices, plus PostgreSQL and RabbitMQ, run in Docker and communicate over an internal Docker network. Only the HTTP APIs of the services are exposed to your machine.

---

## Services and Features

- **Collector Service**
  - Periodically fetches air quality data for configured locations.
  - Applies business rules (e.g. thresholds, AQI checks) before creating alerts.
  - Publishes alert events into RabbitMQ for downstream processing.
  - Exposes simple health endpoints (e.g. for readiness checks).

- **Processor Service**
  - Listens to alert events from RabbitMQ and persists them in PostgreSQL.
  - Provides a **REST API** for querying the latest alerts and related data.
  - Exposes a **Swagger UI** at `http://localhost:3000/api` (when running via Docker Compose in development).
  - Sends real-time notifications over **WebSockets**, demonstrated by `documentation/websocket-example.html`.
  - Exposes simple health endpoints (e.g. for readiness checks).

---

## Shared Building Blocks

- **Core library**
  - Centralises logging and other cross-cutting concerns so both services have consistent observability.

- **Messaging library**
  - Standardises how services talk to RabbitMQ (queue names, connection handling, event patterns).
  - Makes it easy to plug additional event producers or consumers into the same queue.

- **Air-quality library**
  - Wraps external air-quality providers (e.g. Google APIs).
  - Defines the domain model for readings, pollutants, conditions, and alerts.
  - Provides helpers for mapping raw provider data into the internal alert model.

---

## Runtime & Deployment Model

- Everything is designed to run through **Docker Compose**:
  - `collector-service` (HTTP on `localhost:3001`, health only).
  - `processor-service` (HTTP + Swagger + WebSockets on `localhost:3000`).
  - `postgres` (database) and `rabbitmq` (message broker), both internal-only.
- Environment files (`.env.collector` and `.env.processor`) are used mainly for **external API keys**, while most infrastructure settings (ports, database URL, RabbitMQ URL, queue name) are provided via `docker-compose.yml`.
