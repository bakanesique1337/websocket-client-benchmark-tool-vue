<template>
  <div class="bg-gray-100 p-3 rounded-lg">
    <h2 class="text-xl font-semibold pb-3">Benchmark Results</h2>

    <table class="w-full border-collapse">
      <thead>
      <tr class="bg-gray-200">
        <th class="p-2 text-left">Client</th>
        <th class="p-2 text-left">Avg Latency</th>
        <th class="p-2 text-left">Min Latency</th>
        <th class="p-2 text-left">Max Latency</th>
        <th class="p-2 text-left">Messages</th>
        <th class="p-2 text-left">Connection Time</th>
        <th class="p-2 text-left">Time</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(result, index) in results" :key="index" class="border-t">
        <td class="p-2">{{ result.client }}</td>
        <td class="p-2">{{ result.avgLatency.toFixed(2) }} ms</td>
        <td class="p-2">{{ result.minLatency.toFixed(2) }} ms</td>
        <td class="p-2">{{ result.maxLatency.toFixed(2) }} ms</td>
        <td class="p-2">{{ result.messages }}</td>
        <td class="p-2">{{ result.connectionTime }} ms</td>
        <td class="p-2 text-sm">{{ formatTime(result.timestamp) }}</td>
      </tr>
      <tr v-if="results.length === 0">
        <td class="p-4 text-center text-gray-500" colspan="7">No benchmark results yet</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import type {ResultTableProps} from "@/components/resultTable/types.ts";
import {formatTime} from "@/utils/utils.ts";

defineProps<ResultTableProps>()
</script>
