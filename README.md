# WebSocket Benchmark Tool for Vue.js

This is a full-stack benchmarking tool for comparing the performance of different
WebSocket client libraries in a Vue.js application.

It includes:

- A multi-protocol **echo server** (WebSocket, Socket.IO, SockJS)
- A unified **Vue 3 client** interface to test each library under the same conditions
- Built-in metrics display for benchmarking results

## 🧪 Benchmark Metrics

The following metrics are collected and displayed in real-time:

- **Messages Sent**
- **Messages Received**
- **Average Latency**
- **Minimum Latency**
- **Maximum Latency**
- **Connection Time**

## ⚙️ Tech Stack

### Server

- Node.js + TypeScript
- `ws` (native WebSocket)
- `socket.io`
- `sockjs`
- Express

### Client

- Vue 3 + Vite
- TypeScript
- Composition API
- Custom `WebSocketClient` class for abstraction

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/username/websocket-benchmark-vue.git
cd websocket-benchmark-vue
```

2. Install dependencies (client + server)

```bash
npm install
```

Or, if using pnpm or yarn, install accordingly in both the root and subfolders (if separated).

3. Start the echo server

```bash
npx nodemon server.ts
```

The server will start WebSocket, Socket.IO, and SockJS endpoints.

4. Start the Vue client

```bash
npm run dev
```

## 🌐 WebSocket Endpoints

| Client Library   | Endpoint  |
|------------------|-----------|
| Native WebSocket | `/native` |
| isomorphic-ws    | `/native` |
| Socket.IO        | `/`       |
| SockJS           | `/sockjs` |

# License

MIT
