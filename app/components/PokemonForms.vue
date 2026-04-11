<script setup lang="ts">
import type { PokemonForm } from "~/types/pokemon";

const props = defineProps<{
  forms: PokemonForm[];
}>();

const currentIndex = ref(0);
const current = computed(() => props.forms[currentIndex.value]!);

function prev() {
  currentIndex.value =
    (currentIndex.value - 1 + props.forms.length) % props.forms.length;
}

function next() {
  currentIndex.value = (currentIndex.value + 1) % props.forms.length;
}
</script>

<template>
  <div>
    <h2 class="text-lg font-bold text-gray-700 mb-4">Formes</h2>

    <div class="bg-gray-50 rounded-xl p-4">
      <div class="flex items-center gap-3">
        <button
          class="w-8 h-8 shrink-0 flex items-center justify-center rounded-full bg-white shadow hover:shadow-md transition text-gray-500 hover:text-gray-700"
          @click="prev"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        <Transition name="fade" mode="out-in">
          <div
            :key="currentIndex"
            class="flex-1 flex flex-col items-center gap-2 py-2"
          >
            <img
              :src="current.image"
              :alt="current.formName"
              class="w-32 h-32 object-contain"
            />
            <span class="font-semibold text-gray-800">{{
              current.formName
            }}</span>
            <div class="flex flex-wrap justify-center gap-1">
              <UiPokemonType v-for="t in current.types" :key="t" :type="t" />
            </div>
          </div>
        </Transition>

        <button
          class="w-8 h-8 shrink-0 flex items-center justify-center rounded-full bg-white shadow hover:shadow-md transition text-gray-500 hover:text-gray-700"
          @click="next"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>

      <div class="flex justify-center gap-1.5 mt-3">
        <button
          v-for="(_, i) in forms"
          :key="i"
          class="w-2 h-2 rounded-full transition"
          :class="
            i === currentIndex ? 'bg-primary' : 'bg-gray-300 hover:bg-gray-400'
          "
          @click="currentIndex = i"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
