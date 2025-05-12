import {computed, ref} from 'vue';
import type {
  BenchmarkResult,
  ChartDataPoint,
  ClientType,
  ConnectionStatus,
  WSInstance
} from "@/types";
import {WebSocketClient} from "@/components/WebSocketClient.ts";

const wsUrl = ref('ws://localhost:3001/native');
const selectedClient = ref<ClientType>('native');
const messageInterval = ref(500);
const isRunning = ref(false);

const activeClient = ref('Native WebSocket');
const connectionStatus = ref<ConnectionStatus>('Disconnected');
const messagesSent = ref(0);
const messagesReceived = ref(0);
const latencies = ref<number[]>([]);
const connectionTime = ref(0);
const connectionStartTime = ref(0);
const chartData = ref<ChartDataPoint[]>([]);
const benchmarkResults = ref<BenchmarkResult[]>([]);

const chartStartIndex = ref(0);

let ws: WSInstance | null = null;
let messageIntervalId: number | null = null;

const avgLatency = computed(() => {
  if (latencies.value.length === 0) return 0;
  const sum = latencies.value.reduce((acc, val) => acc + val, 0);
  return sum / latencies.value.length;
});

const minLatency = computed(() => {
  if (latencies.value.length === 0) return Infinity;
  return Math.min(...latencies.value);
});

const maxLatency = computed(() => {
  if (latencies.value.length === 0) return 0;
  return Math.max(...latencies.value);
});

export function useWebSocketBenchmark() {
  const updateChartStartIndex = (): void => {
    if (chartData.value.length > 0) {
      chartStartIndex.value = chartData.value[0].time - 1;
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleMessage = (data: any): void => {
    const latency = Date.now() - parseInt(data as string);
    latencies.value.push(latency);
    messagesReceived.value++;

    chartData.value.push({
      time: messagesReceived.value,
      latency: latency
    });

    if (chartData.value.length > 50) {
      chartData.value.shift();
      updateChartStartIndex();
    }
  };

  const startMessageInterval = (): void => {
    messageIntervalId = window.setInterval(() => {
      try {
        const timestamp = Date.now().toString();
        WebSocketClient.sendMessage(ws, selectedClient.value, timestamp);
        messagesSent.value++;
      } catch (error) {
        console.error('Interval: Error sending message:', error);
      }
    }, messageInterval.value);
  };

  const connectWebSocket = async (): Promise<void> => {
    messagesSent.value = 0;
    messagesReceived.value = 0;
    latencies.value = [];
    chartData.value = [];
    connectionStatus.value = 'Connecting';
    connectionStartTime.value = Date.now();

    try {
      ws = await WebSocketClient.createClient(
        selectedClient.value,
        wsUrl.value,
        () => {
          connectionTime.value = Date.now() - connectionStartTime.value;
          connectionStatus.value = 'Connected';
          startMessageInterval();
        },
        () => {
          connectionStatus.value = 'Disconnected';
          if (messageIntervalId !== null) {
            clearInterval(messageIntervalId);
          }
        },
        (error) => {
          console.error('WebSocket error:', error);
          connectionStatus.value = 'Error';
        },
        handleMessage
      );

      activeClient.value = selectedClient.value;
    } catch (error) {
      console.error('Error in connectWebSocket:', error);
      connectionStatus.value = 'Error';
    }
  };

  const startBenchmark = (): void => {
    if (isRunning.value) return;

    isRunning.value = true;
    connectWebSocket();
  };

  const stopBenchmark = (): void => {
    if (!isRunning.value) return;

    isRunning.value = false;

    if (ws) {
      WebSocketClient.closeConnection(ws, selectedClient.value);
      ws = null;
    }

    if (messageIntervalId !== null) {
      clearInterval(messageIntervalId);
      messageIntervalId = null;
    }

    if (messagesReceived.value > 0) {
      benchmarkResults.value.unshift({
        client: activeClient.value,
        avgLatency: avgLatency.value,
        minLatency: minLatency.value === Infinity ? 0 : minLatency.value,
        maxLatency: maxLatency.value,
        messages: messagesReceived.value,
        connectionTime: connectionTime.value,
        timestamp: new Date()
      });
    }

    connectionStatus.value = 'Disconnected';
  };

  const clearResults = (): void => {
    benchmarkResults.value = [];
  };

  const cleanup = (): void => {
    stopBenchmark();
  };

  return {
    wsUrl,
    selectedClient,
    messageInterval,
    isRunning,
    activeClient,
    connectionStatus,
    messagesSent,
    messagesReceived,
    latencies,
    connectionTime,
    chartData,
    benchmarkResults,
    chartStartIndex,

    avgLatency,
    minLatency,
    maxLatency,

    startBenchmark,
    stopBenchmark,
    clearResults,
    cleanup
  };
}
