<template>
  <div class="min-h-20 flex flex-col">
    <label class="block mb-2">{{ name }}</label>
    <select
      :value="modelValue"
      class="w-full py-1 px-2 border rounded min-h-8"
      @change="handleSelect">
      <option v-for="(label, key) in options" :key="key" :value="key">
        {{ label }}
      </option>
    </select>
  </div>
</template>

<script lang="ts" setup>
import type {SelectProps} from "@/components/controls/components/types.ts"

defineProps<SelectProps>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | undefined): void
}>()

const handleSelect = (event: Event): void => {
  const target = event.target as HTMLSelectElement | null
  const value = target?.value

  emit('update:modelValue', value)
}
</script>
