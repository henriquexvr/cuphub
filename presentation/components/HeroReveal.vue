<script setup lang="ts">
import { ref } from 'vue'
import { onSlideEnter } from '@slidev/client'

// Remonta o bloco a cada entrada no slide para reexecutar a animação.
const k = ref(0)
onSlideEnter(() => { k.value++ })
</script>

<template>
  <div :key="k" class="hero">
    <div class="bloom" />
    <div class="glow" aria-hidden="true">Cup<span>Hub</span></div>
    <h1 class="word">Cup<span class="hl">Hub</span></h1>
    <div class="tag">da inscrição ao troféu</div>
  </div>
</template>

<style scoped>
.hero {
  position: relative;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  height: 100%;
}

/* curva que acelera no final: anticipação lenta -> estouro */
.word, .glow {
  font-family: 'Anton', sans-serif;
  font-size: 11rem; line-height: .9; letter-spacing: .01em;
  text-transform: none; margin: 0;
}
.word { color: oklch(0.97 0 0); position: relative; z-index: 2; }
.word .hl { color: oklch(0.852 0.199 91.936); }

/* cópia desfocada por trás = brilho que cresce e estoura */
.glow {
  position: absolute; z-index: 1; color: oklch(0.852 0.199 91.936);
  filter: blur(28px); opacity: 0;
}
.glow span { color: oklch(0.852 0.199 91.936); }

/* bloom radial atrás de tudo */
.bloom {
  position: absolute; z-index: 0; width: 70vw; height: 70vw; max-width: 900px; max-height: 900px;
  border-radius: 50%;
  background: radial-gradient(circle, oklch(0.852 0.199 91.936 / 0.35) 0%, transparent 62%);
  opacity: 0;
}

.tag {
  margin-top: 1.6rem; z-index: 2;
  font-family: 'Inter', sans-serif; font-weight: 600;
  font-size: 1.5rem; letter-spacing: .02em; color: oklch(0.72 0 0);
  opacity: 0;
}

/* ---- animações ---- */
.word  { animation: heroWord 1.7s cubic-bezier(0.7, 0, 0.84, 0) both; }
.glow  { animation: heroGlow 1.9s cubic-bezier(0.7, 0, 0.84, 0) both; }
.bloom { animation: heroBloom 2s cubic-bezier(0.7, 0, 0.84, 0) both; }
.tag   { animation: heroTag .7s cubic-bezier(0.2, 0.8, 0.2, 1) 1.55s both; }

@keyframes heroWord {
  0%   { opacity: 0; transform: scale(0.7);  filter: blur(12px); }
  60%  { opacity: .85; }
  100% { opacity: 1; transform: scale(1);    filter: blur(0); }
}
@keyframes heroGlow {
  0%   { opacity: 0;  transform: scale(0.6); }
  78%  { opacity: .35; }
  92%  { opacity: .9; }  /* estouro de brilho no final */
  100% { opacity: .55; transform: scale(1.04); }
}
@keyframes heroBloom {
  0%   { opacity: 0;  transform: scale(0.45); }
  100% { opacity: .9; transform: scale(1); }
}
@keyframes heroTag {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* respeita reduce-motion: mantém o aparecer, corta o movimento */
@media (prefers-reduced-motion: reduce) {
  .word, .glow, .bloom, .tag {
    animation: fadeOnly .5s ease both; filter: none; transform: none;
  }
  @keyframes fadeOnly { from { opacity: 0; } to { opacity: 1; } }
  .glow { opacity: .5; }
  .bloom { opacity: .9; }
}
</style>
