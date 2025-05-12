<template>
  <div class="bg-gray-100 p-3 rounded-lg flex flex-col">
    <h2 class="text-xl font-semibold pb-3">Connection Settings</h2>
    <InputElement
        :model-value="url"
        name="WebSocket Server URL"
        placeholder="wss://websocket-echo.com/"
        type="url"
        @update:modelValue="updateUrl"/>

    <SelectElement
        :model-value="client"
        :options="clientTypeNameMap"
        name="Client Library"
        @update:modelValue="updateClient"/>

    <InputElement
        :min="1"
        :model-value="interval"
        name="Message Interval (ms)"
        type="number"
        @update:modelValue="updateInterval"/>

    <div class="flex gap-4">
      <ButtonElement
          :disabled="running"
          class="bg-blue-500 hover:bg-blue-600"
          @click="$emit('start')">
        Start
      </ButtonElement>

      <ButtonElement
          :disabled="!running"
          class="bg-red-500 hover:bg-red-600"
          @click="$emit('stop')"
      >
        Stop
      </ButtonElement>

      <ButtonElement
          class="bg-gray-500 hover:bg-gray-600"
          @click="$emit('clear')"
      >
        Clear Results
      </ButtonElement>
    </div>
  </div>
</template>

<script lang="ts" setup>

import {type ClientType, clientTypeNameMap} from "@/types";
import ButtonElement from "@/components/controls/components/ButtonElement.vue";
import SelectElement from "@/components/controls/components/SelectElement.vue";
import InputElement from "@/components/controls/components/InputElement.vue";
import type {ConnectionControlProps} from "@/components/controls/components/types.ts";

defineProps<ConnectionControlProps>();

const emit = defineEmits<{
  (e: 'start'): void,
  (e: 'stop'): void,
  (e: 'clear'): void,
  (e: 'update:url', value: string): void;
  (e: 'update:client', value: ClientType): void;
  (e: 'update:interval', value: number): void;
}>()

const updateUrl = (value: string | number | undefined) => {
  emit('update:url', value as string);
};

const updateClient = (value: string | undefined) => {
  if (value !== undefined) {
    emit('update:client', value as ClientType);
    return;
  }
  emit('update:client', '' as ClientType);
};

const updateInterval = (value: string | number | undefined) => {
  if (value !== undefined) {
    emit('update:interval', value as number);
  }
  return
};
</script>
