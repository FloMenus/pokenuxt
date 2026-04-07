<template>
  <button :class="classes" v-bind="$attrs">
    <slot />
  </button>
</template>

<script setup lang="ts">
type Color = 'primary' | 'secondary'
type Variant = 'solid' | 'outline' | 'ghost'

const props = withDefaults(defineProps<{
  color?: Color
  variant?: Variant
}>(), {
  color: 'primary',
  variant: 'solid',
})

const classes = computed(() => {
  const base = 'inline-flex items-center justify-center gap-2 px-4 py-2 font-semibold rounded-full transition cursor-pointer'

  const map: Record<Color, Record<Variant, string>> = {
    primary: {
      solid:   'bg-primary text-white hover:bg-primary-600',
      outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
      ghost:   'text-primary hover:bg-primary-50',
    },
    secondary: {
      solid:   'bg-secondary text-white hover:bg-secondary-600',
      outline: 'border-2 border-secondary text-secondary hover:bg-secondary hover:text-white',
      ghost:   'text-secondary hover:bg-secondary-50',
    },
  }

  return [base, map[props.color][props.variant]]
})
</script>
