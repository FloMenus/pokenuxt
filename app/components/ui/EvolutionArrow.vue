<script setup lang="ts">
defineProps<{
  labels: string[];
}>();
</script>

<template>
  <div class="flex flex-col items-center mx-3 w-24 shrink-0">
    <div class="text-center mb-1 space-y-0.5 min-h-8">
      <span
        v-for="label in labels"
        :key="label"
        class="block text-xs text-gray-500 leading-tight"
      >
        {{ label }}
      </span>
    </div>
    <div class="flex items-center text-gray-300">
      <div class="h-px w-8 bg-gray-300" />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="10"
        height="14"
        viewBox="0 0 10 14"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="1,1 9,7 1,13" />
      </svg>
    </div>
  </div>
</template>
