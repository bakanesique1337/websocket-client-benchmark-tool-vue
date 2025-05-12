<template>
  <div class="bg-gray-100 p-3 rounded-lg">
    <h2 class="text-xl font-semibold pb-3">Current Connection</h2>

    <div class="grid grid-cols-1 gap-3">
      <div class="flex justify-between">
        <span>Status:</span>
        <span :class="{
        'text-green-600 font-semibold': status === 'Connected',
        'text-yellow-600': status === 'Connecting',
        'text-red-600 font-semibold': status === 'Disconnected'
        || status === 'Error'
      }">
        {{ status }}
      </span>
      </div>

      <div class="flex justify-between">
        <span>Client Library:</span>
        <span class="font-semibold">{{ active }}</span>
      </div>

      <div>
        <div class="flex justify-between">
          <span>Messages Sent:</span>
          <span class="font-semibold">{{ sent }}</span>
        </div>

        <div class="flex justify-between">
          <span>Messages Received:</span>
          <span class="font-semibold">{{ received }}</span>
        </div>
      </div>

      <div>
        <div class="flex justify-between">
          <span>Average Latency:</span>
          <span class="font-semibold">{{ avgLatency.toFixed(2) }} ms</span>
        </div>

        <div class="flex justify-between">
          <span>Min Latency:</span>
          <span class="font-semibold">{{
              minLatency === Infinity ? '∞' : minLatency.toFixed(2)
            }} ms</span>
        </div>

        <div class="flex justify-between">
          <span>Max Latency:</span>
          <span class="font-semibold">{{ maxLatency.toFixed(2) }} ms</span>
        </div>
      </div>

      <div class="flex justify-between align-bottom">
        <span>Connection Time:</span>
        <span class="font-semibold">{{ time }} ms</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type {StatsProps} from "@/components/stats/types.ts";

defineProps<StatsProps>();
</script>
