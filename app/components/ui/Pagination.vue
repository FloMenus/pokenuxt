<script setup lang="ts">
const props = defineProps<{
  page: number
  total: number
  perPage: number
}>()

const emit = defineEmits<{
  change: [page: number]
}>()

const totalPages = computed(() => Math.ceil(props.total / props.perPage))

const pages = computed(() => {
  const current = props.page
  const last = totalPages.value
  const delta = 2
  const range: (number | '...')[] = []

  const left = Math.max(1, current - delta)
  const right = Math.min(last, current + delta)

  if (left > 1) {
    range.push(1)
    if (left > 2) range.push('...')
  }

  for (let i = left; i <= right; i++) {
    range.push(i)
  }

  if (right < last) {
    if (right < last - 1) range.push('...')
    range.push(last)
  }

  return range
})

function go(p: number | '...') {
  if (typeof p === 'number' && p !== props.page) {
    emit('change', p)
  }
}
</script>

<template>
  <div class="flex items-center justify-center gap-1">
    <button
      class="px-3 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer"
      :class="page <= 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'"
      :disabled="page <= 1"
      @click="go(page - 1)"
    >
      ←
    </button>

    <template v-for="p in pages" :key="p">
      <span v-if="p === '...'" class="px-2 py-1.5 text-sm text-gray-400">…</span>
      <button
        v-else
        class="w-9 h-9 rounded-lg text-sm font-medium transition cursor-pointer"
        :class="p === page
          ? 'bg-primary text-white'
          : 'text-gray-600 hover:bg-gray-100'"
        @click="go(p)"
      >
        {{ p }}
      </button>
    </template>

    <button
      class="px-3 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer"
      :class="page >= totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'"
      :disabled="page >= totalPages"
      @click="go(page + 1)"
    >
      →
    </button>
  </div>
</template>
