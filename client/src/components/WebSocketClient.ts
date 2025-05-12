import type {
  ClientType,
  ErrorCallback,
  MessageCallback,
  SocketIOClient,
  WebSocketLike,
  WSInstance
} from "@/types";
import SockJS from 'sockjs-client/dist/sockjs';

export class WebSocketClient {
  static async createClient(
    clientType: ClientType,
    url: string,
    onOpen: () => void,
    onClose: () => void,
    onError: ErrorCallback,
    onMessage: MessageCallback
  ): Promise<WSInstance> {
    switch (clientType) {
      case 'native':
        return this.createNativeWebSocket(url, onOpen, onClose, onError, onMessage);
      case 'isomorphic':
        return this.createIsomorphicWebSocket(url, onOpen, onClose, onError, onMessage);
      case 'sockjs':
        return this.createSockJSWebSocket(url, onOpen, onClose, onError, onMessage);
      case 'socketio':
        return this.createSocketIOWebSocket(url, onOpen, onClose, onError, onMessage);
      default:
        throw new Error(`Unsupported client type: ${clientType}`);
    }
  }

  static sendMessage(ws: WSInstance, clientType: ClientType, message: string): void {
    if (!ws) return;

    try {
      if (clientType === 'socketio') {
        (ws as SocketIOClient).emit('echo', message);
      } else {
        (ws as WebSocketLike).send(message);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  static closeConnection(ws: WSInstance, clientType: ClientType): void {
    if (!ws) return;

    try {
      if (clientType === 'socketio') {
        (ws as SocketIOClient).disconnect();
      } else {
        (ws as WebSocketLike).close();
      }
    } catch (error) {
      console.error('Error closing connection:', error);
    }
  }

  private static createNativeWebSocket(
    url: string,
    onOpen: () => void,
    onClose: () => void,
    onError: ErrorCallback,
    onMessage: MessageCallback
  ): WebSocket {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      onOpen();
    };
    ws.onclose = () => {
      onClose();
    };
    ws.onerror = (error: Event) => {
      onError(error);
    };
    ws.onmessage = (event: MessageEvent) => {
      onMessage(event.data);
    };

    return ws;
  }

  private static async createIsomorphicWebSocket(
    url: string,
    onOpen: () => void,
    onClose: () => void,
    onError: ErrorCallback,
    onMessage: MessageCallback
  ): Promise<WSInstance> {
    try {
      const {default: IsomorphicWebSocket} = await import('isomorphic-ws');

      const ws = new IsomorphicWebSocket(url);

      ws.onopen = onOpen;
      ws.onclose = onClose;
      ws.onerror = (error: Event) => onError(error);
      ws.onmessage = (event: MessageEvent) => onMessage(event.data);

      return ws;
    } catch (error) {
      throw new Error(`Failed to load isomorphic-ws: ${error}`);
    }
  }

  private static async createSockJSWebSocket(
    url: string,
    onOpen: () => void,
    onClose: () => void,
    onError: ErrorCallback,
    onMessage: MessageCallback
  ): Promise<WSInstance> {
    try {
      const sockjsUrl = url.replace('wss://', 'https://').replace('ws://', 'http://');
      const ws = new SockJS(sockjsUrl);

      ws.onopen = onOpen;
      ws.onclose = onClose;
      ws.onerror = (error: Event) => onError(error);
      ws.onmessage = (event: MessageEvent) => onMessage(event.data);

      return ws;
    } catch (error) {
      throw new Error(`Failed to load SockJS: ${error}`);
    }
  }

  private static async createSocketIOWebSocket(
    url: string,
    onOpen: () => void,
    onClose: () => void,
    onError: ErrorCallback,
    onMessage: MessageCallback
  ): Promise<WSInstance> {
    try {
      const {io} = await import('socket.io-client');

      const ws = io(url, {
        transports: ['websocket'],
        upgrade: false
      });

      ws.on('connect', onOpen);
      ws.on('disconnect', onClose);
      ws.on('connect_error', (error: Error) => onError(error));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ws.on('echo', (data: any) => onMessage(data));

      return ws;
    } catch (error) {
      throw new Error(`Failed to load Socket.IO: ${error}`);
    }
  }
}
