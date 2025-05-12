import express from 'express';
import http from 'http';
import { Server as SocketIOServer, Socket as SocketIOSocket } from 'socket.io';
import { WebSocketServer, WebSocket } from 'ws';
import * as sockjs from 'sockjs';

const app = express();
const server = http.createServer(app);

const PORT: number = parseInt(process.env.PORT || '3001', 10);

const sockjs_echo = sockjs.createServer({
    prefix: '/sockjs',
});

sockjs_echo.on('connection', (conn) => {
    if (!conn) {
        return;
    }
    console.log(`[SockJS] Client connected: ${conn.id}, protocol: ${conn.protocol}`);

    conn.on('data', (message: string) => {
        console.log(`[SockJS] Received message from ${conn.id}: ${message}`);
        conn.write(message);
    });

    conn.on('close', () => {
        console.log(`[SockJS] Client disconnected: ${conn.id}`);
    });
});

sockjs_echo.installHandlers(server, { prefix: '/sockjs' });

const io = new SocketIOServer(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket: SocketIOSocket) => {
    console.log(`[Socket.IO] User connected: ${socket.id} on path: ${socket.nsp.name}`);

    socket.on('echo', (data: any, callback?: (response: any) => void) => {
        console.log(`[Socket.IO] Received 'echo' from ${socket.id} with data:`, data);
        socket.emit('echo', data);
        if (callback) {
            callback({ status: "ok", receivedData: data });
        }
    });

    socket.on('disconnect', () => {
        console.log(`[Socket.IO] User disconnected: ${socket.id}`);
    });
});

const wss = new WebSocketServer({
    noServer: true
});

wss.on('connection', (ws: WebSocket, req) => {
    const clientIp = req.socket.remoteAddress;
    console.log(`[Native WS] Client connected from ${clientIp} on path ${req.url}`);

    ws.on('message', (message: Buffer) => {
        const messageString = message.toString();
        console.log(`[Native WS] Received message: ${messageString}`);
        ws.send(messageString);
    });

    ws.on('close', () => {
        console.log(`[Native WS] Client disconnected from ${clientIp}`);
    });

    ws.on('error', (error) => {
        console.error(`[Native WS] Error for client ${clientIp}:`, error);
    });
});

server.on('upgrade', (request, socket, head) => {
    const pathname = request.url;
    console.log(`[HTTP Upgrade] Attempting upgrade for path: ${pathname}`);

    if (pathname === '/native') {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
        });
    } else {
        console.log(`[HTTP Upgrade] No specific handler for Native WS path ${pathname}, destroying socket. Socket.IO/SockJS might handle it if their paths match.`);
        if (!pathname?.startsWith('/sockjs') && !pathname?.startsWith(io.path() || '/socket.io')) {
            socket.destroy();
        }
    }
});

server.listen(PORT, () => {
    console.log(`HTTP server listening on *:${PORT}`);
    console.log(`  - Socket.IO accessible at root: http://localhost:${PORT}/ (upgrades via /socket.io/ or similar)`);
    console.log(`  - SockJS accessible on prefix: http://localhost:${PORT}/sockjs`);
    console.log(`  - Native WebSocket accessible on path: ws://localhost:${PORT}/native`);
});
