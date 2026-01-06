# Meshwork Studio | Application Overview

Meshwork Studio is a professional-grade visual systems architecture designer built with React and React Flow. It features a "Neo-Brutalist" design aesthetic and is architected to scale from a local-first prototype to a Firebase-backed production application.

## 1. Core Features
- **Visual Canvas:** An infinite canvas powered by `reactflow` for architecting distributed systems.
- **Node Library:** A rich set of pre-configured architecture components (Compute, Storage, Networking, Security).
- **Template System:** Quick-start blueprints for famous architectures (Airbnb, Netflix, Uber).
- **AI Integration (BYOK):** "Bring Your Own Key" support for Google Gemini to generate documentation and ASCII representations of visual diagrams.
- **Local-First with Firebase Path:** Uses a custom `safeStorage` bridge to fallback to in-memory/localStorage while keeping the `firebaseService` ready for backend connection.
- **Command Palette:** Global navigation and action shortcuts (`Cmd/Ctrl + K`).

## 2. Component & Node Architecture

### Custom Node Types (`components/nodes/`)
- **ServerNode:** Represents physical or virtual servers with status indicators.
- **DatabaseNode:** Configurable via `DatabaseSelectorModal`. Supports over 30+ DB types (PostgreSQL, Redis, Mongo, etc.).
- **ServiceNode:** Represents microservices or logic units.
- **ClientNode:** Toggles between Phone, Laptop, and Desktop form factors via `ClientConfigModal`.
- **LoadBalancerNode:** Circular node for traffic distribution.
- **MiddlewareNode:** Multi-purpose pill for Gateways, Auth, Cache, and Proxies.
- **QueueNode:** Dashed-border node for message brokers (Kafka, RabbitMQ).
- **ExternalServiceNode:** Dashed styling for SaaS/Cloud integrations (Stripe, AWS, OpenAI).
- **JunctionNode:** Small connector for splitting/routing edges.

### Connections (Edges)
- **Typed Connections:** Supported via `ConnectionSettingsModal`.
- **Protocols:** HTTP/REST, gRPC, WebSockets, AMQP, JDBC, etc.
- **Visual Feedback:** Animated for streaming data, static for database/internal connections.

## 3. Tech Stack
- **Framework:** React 18 (ESM via `esm.sh`).
- **Diagramming:** React Flow 11.
- **Styling:** Tailwind CSS + Material UI (MUI) v5.
- **Icons:** Lucide-React.
- **AI Engine:** `@google/genai` (utilizing `gemini-3-flash-preview`).
- **Persistence:** Firebase (App, Auth, Firestore) with local fallback.

## 4. AI Interaction Model
The application integrates with the **Gemini API** for:
- **ASCII Export:** Analyzing the visual state (Nodes + Edges) and generating high-quality Unicode/Box-drawing diagrams.
- **Configuration:** Managed via the `SettingsPage` with secure storage of API keys.

## 5. Development Roadmap
- **Collaboration:** Real-time multi-user editing via Firestore.
- **Export:** Transforming visual meshes into Terraform (HCL) or Docker Compose files.
- **Simulation:** Real-time data flow animation on the edges.