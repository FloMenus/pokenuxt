<script setup lang="ts">
const search = ref("");

defineEmits<{
  search: [search: string];
}>();
</script>

<template>
  <div
    class="flex items-center bg-white border border-gray-300 rounded-full focus-within:border-primary transition"
  >
    <input
      v-model="search"
      type="text"
      placeholder="Rechercher un Pokémon..."
      class="flex-1 px-4 outline-none bg-transparent"
    />
    <UiButton @click="$emit('search', search)">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2.5"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
        />
      </svg>
      Rechercher
    </UiButton>
  </div>
</template>
