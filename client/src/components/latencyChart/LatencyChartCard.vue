<template>
  <div class="bg-gray-100 p-3 rounded-lg mb-6">
    <h2 class="text-xl font-semibold mb-4">Latency Chart</h2>
    <div class="h-64 w-full p-9">
      <div v-if="data.length > 0" class="h-full w-full">
        <div class="h-full w-full flex flex-col">
          <div class="flex justify-between text-xs text-gray-500">
            <div>Messages</div>
            <div>Latency (ms)</div>
          </div>

          <div class="flex-1 relative border-l border-b">
            <div
              class="absolute -left-8 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
              <div>{{ Math.ceil(maxDisplayLatency) }}</div>
              <div>{{ Math.ceil(maxDisplayLatency / 2) }}</div>
              <div>0</div>
            </div>

            <div
              class="absolute -bottom-4 left-0 w-full flex justify-between text-xs text-gray-500">
              <div>{{ startIndex + 1 }}</div>
              <div>{{ startIndex + Math.floor(data.length / 2) }}</div>
              <div>{{ startIndex + data.length }}</div>
            </div>

            <div class="absolute inset-0 flex items-end">
              <div
                v-for="(point, index) in data"
                :key="index"
                :style="{
                    height: `${(point.latency / maxDisplayLatency) * 100}%`,
                    width: `${95 / data.length}%`
                  }"
                :title="`Message ${point.time}: ${point.latency.toFixed(2)}ms`"
                class="bg-blue-500 mx-px"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="h-full flex items-center justify-center text-gray-500">
        No data available yet. Start a benchmark to see results.
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

import {computed} from "vue";
import type {LatencyChartProps} from "@/components/latencyChart/types.ts";

const props = defineProps<LatencyChartProps>()

const maxDisplayLatency = computed<number>(() => {
  if (props.latencies.length === 0) return 100;
  const max = Math.max(...props.latencies);
  return Math.max(max, 10) * 1.1; // 10% headroom for minimum scale
});

</script>
