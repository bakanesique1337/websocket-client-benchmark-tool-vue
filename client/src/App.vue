<!-- App.vue -->
<template>
  <div class="p-6 mx-auto grid grid-cols-1 gap-3">
    <h1 class="text-3xl font-bold">WebSocket Client Benchmark Tool (Vue.js)</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <ConnectionControls
        v-model:client="selectedClient"
        v-model:interval="messageInterval"
        v-model:url="wsUrl"
        :running="isRunning"
        @clear="clearResults"
        @start="startBenchmark"
        @stop="stopBenchmark"/>

      <StatsCard
        :active="activeClient"
        :avg-latency="avgLatency"
        :max-latency="maxLatency"
        :min-latency="minLatency"
        :received="messagesReceived"
        :sent="messagesSent"
        :status="connectionStatus"
        :time="connectionTime"/>
    </div>

    <LatencyChartCard :data="chartData" :latencies="latencies" :start-index="chartStartIndex"/>

    <ResultTable :results="benchmarkResults"/>
  </div>
</template>

<script lang="ts" setup>
import {onUnmounted} from 'vue';
import StatsCard from "@/components/stats/StatsCard.vue";
import LatencyChartCard from "@/components/latencyChart/LatencyChartCard.vue";
import ResultTable from "@/components/resultTable/ResultTable.vue";
import {useWebSocketBenchmark} from "@/composables/useWebSocketBenchmark.ts";
import ConnectionControls from "@/components/controls/ConnectionControls.vue";

const benchmarkState = useWebSocketBenchmark();
const {
  wsUrl,
  selectedClient,
  messageInterval,
  isRunning,

  activeClient,
  avgLatency,
  maxLatency,
  minLatency,
  messagesReceived,
  messagesSent,
  connectionStatus,
  connectionTime,
  chartData,
  latencies,
  chartStartIndex,
  benchmarkResults,
  startBenchmark,
  stopBenchmark,
  clearResults
} = benchmarkState

onUnmounted(() => {
  stopBenchmark();
});
</script>
