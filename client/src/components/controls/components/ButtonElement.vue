<template>
  <button
    :disabled="disabled"
    class="text-white py-2 px-4 rounded"
    @click="handleClick"
  >
    <slot/>
  </button>
</template>

<script lang="ts" setup>
import type {ButtonProps} from "@/components/controls/components/types.ts";

const props = defineProps<ButtonProps>();

const emit = defineEmits<{
  (e: 'click', event: MouseEvent | KeyboardEvent): void
}>()

const handleClick = (event: MouseEvent | KeyboardEvent): void => {
  if (props.disabled) return

  emit('click', event)
}

</script>
