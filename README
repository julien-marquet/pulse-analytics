# Pulse – Realtime Product Analytics Platform

## Overview

Pulse is a lightweight event-driven analytics platform designed to collect, process, and visualize product events in near real-time.

The system allows applications to send user events (e.g. page views, clicks, sign-ups), processes them asynchronously, stores them efficiently, and exposes aggregated insights through an API and a dashboard.

This project focuses on **system design, scalability patterns, and clean architecture**, rather than feature completeness.

---

## Architecture

The system is built around an **event-driven pipeline**:

1. **API (NestJS)**
   Receives incoming events via a REST endpoint and validates payloads.

2. **Queue (Redis + BullMQ)**
   Decouples ingestion from processing to ensure responsiveness and scalability.

3. **Worker**
   Processes events asynchronously:

   * enriches data (timestamps, latency)
   * persists events
   * updates aggregates

4. **Database (PostgreSQL)**
   Stores raw events and precomputed daily aggregates.

5. **Frontend (Next.js)**
   Provides a simple dashboard to explore events and visualize metrics.

---

## Key Features

### Event Ingestion

* REST endpoint: `POST /events`
* Payload validation
* Automatic `eventId` generation
* Non-blocking ingestion via queue

### Asynchronous Processing

* Background worker consuming events
* Enrichment with metadata:

  * `processedAt`
  * `latency`
* Decoupled architecture

### Data Storage

* Raw events stored with flexible schema (JSONB)
* Aggregated statistics (daily counts by event type)

### Analytics API

* List events with pagination and filters
* Global metrics (total events, daily activity)
* Aggregations:

  * events per day
  * events per type

### Dashboard

* Overview metrics
* Event exploration
* Basic charts for trends and distribution

---

## Technical Stack

* **Backend**: TypeScript, NestJS
* **Worker**: Node.js (NestJS-based or standalone)
* **Queue**: Redis + BullMQ
* **Database**: PostgreSQL + Prisma
* **Frontend**: Next.js
* **DevOps**: Docker, Docker Compose
* **CI**: GitHub Actions

---

## Design Decisions

### Event-driven architecture

Events are processed asynchronously to:

* improve API responsiveness
* allow independent scaling of ingestion and processing

### Precomputed aggregates

Daily statistics are updated during processing to:

* avoid expensive queries at read time
* keep the dashboard fast

### Flexible event schema

Event properties are stored as JSON to:

* support multiple event types
* keep the system extensible

### Separation of concerns

* API handles ingestion only
* worker handles processing
* database handles storage
* frontend handles visualization

---

## Reliability Considerations

* **Idempotency**
  Events are uniquely identified to prevent duplicate processing.

* **Retry mechanism**
  Failed jobs are retried automatically via BullMQ.

* **Error handling**
  Worker errors are handled without crashing the system.

---

## Getting Started

### Prerequisites

* Docker
* Docker Compose

### Run the project

```bash
docker-compose up --build
```

### Services

* API: http://localhost:3000
* Frontend: http://localhost:3001
* PostgreSQL & Redis included

---

## Example Event

```json
{
  "eventType": "page_viewed",
  "userId": "user_123",
  "sessionId": "sess_456",
  "timestamp": "2026-03-24T10:15:00Z",
  "properties": {
    "page": "/pricing",
    "source": "google"
  }
}
```

---

## Project Structure

```
/apps
  /api
  /worker
  /web
/packages
  /common
/docker
docker-compose.yml
```

---

## What This Project Demonstrates

* Backend architecture (NestJS, modular design)
* Event-driven systems
* Asynchronous processing with queues
* Data modeling (raw + aggregated)
* Fullstack integration
* DevOps fundamentals (Docker, CI)
* Production-oriented thinking (idempotency, retries)

---

## Future Improvements

* Real-time updates (WebSockets)
* Advanced analytics (funnels, cohorts)
* Authentication / multi-tenant support
* Observability (metrics, tracing)

---

## Author

Built as part of a professional portfolio to demonstrate backend and system design capabilities.
