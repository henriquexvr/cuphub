<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{ to: number; dur?: number; suffix?: string }>()
const val = ref(0)

onMounted(() => {
  const dur = props.dur ?? 1600
  let start: number | null = null
  const tick = (now: number) => {
    if (start === null) start = now
    const p = Math.min(1, (now - start) / dur)
    const eased = 1 - Math.pow(1 - p, 3)
    val.value = Math.round(eased * props.to)
    if (p < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
})
</script>

<template><span>{{ val }}{{ suffix ?? '' }}</span></template>
