## Air Monitor – Local Development & Docker Setup

### Local environment files

- **Create service env files**
  - Create `.env.collector` in the project root.
  - Create `.env.processor` in the project root.
- **Copy from example envs**
  - Copy the content from the provided example env files (e.g. `.env.collector.example`, `.env.processor.example`) into the new files.
  - **Important**: most variables are overridden by `docker-compose.yml`, so you only need to make sure the **Google API key** (or any other external API credentials) is correctly filled in both env files.

### Build & run with Docker Compose

- **Build and start all services**

```bash
docker compose up --build
```

This will start:

- **collector-service** (HTTP on `localhost:3001`) *note: this only has health checks on /health*
- **processor-service** (HTTP on `localhost:3000`) 
- **PostgreSQL** and **RabbitMQ** (internal-only, not exposed to the host)

### API documentation (Swagger)

- **Open the Swagger UI** for the processor service:
  - Go to `http://localhost:3000/api` in your browser.
  - You should see the generated OpenAPI/Swagger documentation for the Processor Service.

### WebSocket example

- **Open the WebSocket demo page**:
  - Open `documentation/websocket-example.html` in your browser (from the project root).
  - With the stack running via Docker Compose, this page will connect to the running processor service and show the WebSocket example in action.

### Check documentation/architecture.md for info about features made and project structure
