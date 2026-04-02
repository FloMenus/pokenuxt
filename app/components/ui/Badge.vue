<template>
  <span :class="classes">
    <slot />
  </span>
</template>

<script setup lang="ts">
type Color = 'primary' | 'secondary'
type Variant = 'solid' | 'outline'

const props = withDefaults(defineProps<{
  color?: Color
  variant?: Variant
}>(), {
  color: 'primary',
  variant: 'solid',
})

const classes = computed(() => {
  const base = 'inline-flex items-center justify-center px-3 py-0.5 text-sm font-semibold rounded-full'

  const map: Record<Color, Record<Variant, string>> = {
    primary: {
      solid:   'bg-primary text-white',
      outline: 'border-2 border-primary text-primary',
    },
    secondary: {
      solid:   'bg-secondary text-white',
      outline: 'border-2 border-secondary text-secondary',
    },
  }

  return [base, map[props.color][props.variant]]
})
</script>
