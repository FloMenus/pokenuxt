<script setup lang="ts">
defineProps<{
  height: number;
  weight: number;
}>();
</script>

<template>
  <div class="grid grid-cols-2 gap-4">
    <div class="bg-gray-50 rounded-xl p-4 flex flex-col items-center gap-1">
      <span class="text-xs text-gray-400 uppercase font-semibold">Taille</span>
      <span class="text-lg font-bold text-gray-800">
        {{ (height / 10).toFixed(1) }} m
      </span>
    </div>
    <div class="bg-gray-50 rounded-xl p-4 flex flex-col items-center gap-1">
      <span class="text-xs text-gray-400 uppercase font-semibold">Poids</span>
      <span class="text-lg font-bold text-gray-800">
        {{ (weight / 10).toFixed(1) }} kg
      </span>
    </div>
  </div>
</template>
