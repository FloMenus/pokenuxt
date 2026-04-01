<template>
  <div class="min-h-screen flex flex-col bg-gray-900">

    <header class="fixed top-0 left-0 right-0 z-50 bg-gray-800 shadow">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <h1 class="text-green-500 text-2xl font-bold">PokeNuxt</h1>
          </div>
          <div class="flex gap-4">
            <NuxtLink to="/" class="text-gray-300 hover:text-green-500 transition">
              Accueil
            </NuxtLink>
          </div>
        </div>
      </nav>
    </header>

    <main class="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 mt-16">
      <slot />
    </main>

    <footer class="bg-gray-800 border-t border-gray-700 mt-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center text-gray-400">
          <p>&copy; 2026 PokeNuxt</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
</style>
