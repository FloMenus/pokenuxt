<script setup lang="ts">
useHead({
  titleTemplate: (title) => (title ? `${title} - PokéNuxt` : "PokéNuxt"),
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
