export const clientTypeNameMap = {
  'native': 'Native WebSocket',
  'isomorphic': 'isomorphic-ws',
  'sockjs': 'SockJS',
  'socketio': 'Socket.IO'
}

export type ClientType = keyof typeof clientTypeNameMap

export type ConnectionStatus = 'Connected' | 'Connecting' | 'Disconnected' | 'Error'

// eslint-disable-next-line
export type WSInstance = WebSocket | any

export interface ChartDataPoint {
  time: number;
  latency: number;
}

export interface BenchmarkResult {
  client: string;
  avgLatency: number;
  minLatency: number;
  maxLatency: number;
  messages: number;
  connectionTime: number;
  timestamp: Date;
}

export type ErrorCallback = (error: Error | Event) => void;
export type MessageCallback = (data: string | ArrayBuffer | Blob | object) => void;

export interface WebSocketLike {
  send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void;

  close(code?: number, reason?: string): void;
}

export interface SocketIOClient extends Omit<WebSocketLike, 'send' | 'close'> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  emit(event: string, data: any): void;

  disconnect(): void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on(event: string, callback: (data?: any) => void): void;
}

