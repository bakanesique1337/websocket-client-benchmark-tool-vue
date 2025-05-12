<template>
  <div class="min-h-20 flex flex-col">
    <label class="block mb-2">
      {{ name }}
    </label>
    <input
      :min="min"
      :placeholder="placeholder"
      :type="type"
      :value="modelValue"
      class="w-full py-1 px-3 border rounded"
      @input="handleInputEvent"
    />
    <span
      v-if="error"
      class="text-red-500 text-xs pt-1">
    {{ error }}
  </span>
  </div>
</template>

<script lang="ts" setup>
import type {InputProps} from "@/components/controls/components/types.ts";
import {ref} from "vue";

type ModelValue = Required<InputProps>['modelValue']

const props = defineProps<InputProps>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: ModelValue | undefined): void
}>()

const error = ref('')

const updateModelValue = (value: string | undefined): void => {
  if (props.type === 'number') {
    emit('update:modelValue', (typeof value === 'string' && value.length ? Number(value) : undefined) as ModelValue)
  } else {
    emit('update:modelValue', value as ModelValue)
  }
}

const handleInputEvent = (event: Event): void => {
  const target = event.target as HTMLInputElement | null
  const value = target?.value

  if (props.min && Number(value) < props.min) {
    error.value = `Minimum value — ${props.min}`
    return
  }

  updateModelValue(value)
  error.value = ''
}

</script>
