<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    active?: boolean;
    size?: "sm" | "md" | "lg";
  }>(),
  {
    active: false,
    size: "md",
  },
);

const sizeClass = computed(
  () =>
    ({
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-7 h-7",
    })[props.size],
);
</script>

<template>
  <button
    class="transition cursor-pointer"
    :class="active ? 'text-primary' : 'text-gray-300 hover:text-primary'"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      :class="sizeClass"
      viewBox="0 0 24 24"
      :fill="active ? 'currentColor' : 'none'"
      stroke="currentColor"
      stroke-width="2"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      />
    </svg>
  </button>
</template>
