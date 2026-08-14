<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'

const step = ref(0)
const MAX = 7
let timer: any = null

// Resultados pré-definidos (mata-mata de 8 times)
const qf = [
  { home: 'Fênix FC',         away: 'Dragões Rubros',  hs: 3, as: 1, w: 'home' },
  { home: 'Lobos do Norte',   away: 'Tubarões Azuis',  hs: 2, as: 0, w: 'home' },
  { home: 'Falcões Dourados', away: 'Trovão FC',       hs: 1, as: 2, w: 'away' },
  { home: 'Cobras Negras',    away: 'Leões da Serra',  hs: 0, as: 4, w: 'away' },
]
const sf = [ { hs: 2, as: 1, w: 'home' }, { hs: 1, as: 3, w: 'away' } ]
const fin = { hs: 2, as: 0, w: 'home' }

const wname = (m: any) => (m.w === 'home' ? m.home : m.away)

function play() {
  reset()
  timer = setInterval(() => {
    if (step.value >= MAX) { clearInterval(timer); return }
    step.value++
  }, 1600)
}
function reset() { if (timer) clearInterval(timer); step.value = 0 }
onUnmounted(() => timer && clearInterval(timer))

// Posições no "palco" (coordenadas absolutas)
const P = {
  qf: [{ x: 0, y: 0 }, { x: 0, y: 140 }, { x: 0, y: 280 }, { x: 0, y: 420 }],
  sf: [{ x: 300, y: 70 }, { x: 300, y: 350 }],
  f:  { x: 600, y: 210 },
  champ: { x: 905, y: 224 },
}

const qfWinner   = (i: number) => wname(qf[i])
const sfHomeName = (i: number) => (step.value >= i * 2 + 1 ? qfWinner(i * 2)     : null)
const sfAwayName = (i: number) => (step.value >= i * 2 + 2 ? qfWinner(i * 2 + 1) : null)
const sfWinner   = (i: number) => (sf[i].w === 'home' ? sfHomeName(i) : sfAwayName(i))
const fHomeName  = () => (step.value >= 5 ? sfWinner(0) : null)
const fAwayName  = () => (step.value >= 6 ? sfWinner(1) : null)
const finWinner  = () => (fin.w === 'home' ? fHomeName() : fAwayName())
const champName  = () => (step.value >= 7 ? finWinner() : null)

const matches = computed(() => {
  const out: any[] = []
  qf.forEach((m, i) => out.push({
    key: 'qf' + i, ...P.qf[i], home: m.home, away: m.away, hs: m.hs, as: m.as,
    resolved: step.value >= i + 1, winner: m.w,
  }))
  sf.forEach((m, i) => out.push({
    key: 'sf' + i, ...P.sf[i], home: sfHomeName(i), away: sfAwayName(i), hs: m.hs, as: m.as,
    resolved: step.value >= 5 + i, winner: m.w,
  }))
  out.push({
    key: 'fin', ...P.f, home: fHomeName(), away: fAwayName(), hs: fin.hs, as: fin.as,
    resolved: step.value >= 7, winner: fin.w, final: true,
  })
  return out
})

const connectors = computed(() => [
  { d: 'M210 42 H255 V112 H300',  on: step.value >= 1 },
  { d: 'M210 182 H255 V112 H300', on: step.value >= 2 },
  { d: 'M210 322 H255 V392 H300', on: step.value >= 3 },
  { d: 'M210 462 H255 V392 H300', on: step.value >= 4 },
  { d: 'M510 112 H555 V252 H600', on: step.value >= 5 },
  { d: 'M510 392 H555 V252 H600', on: step.value >= 6 },
  { d: 'M810 252 H905',           on: step.value >= 7 },
])
</script>

<template>
  <div class="bw">
    <div class="stage">
      <svg class="wires" viewBox="0 0 1115 510" preserveAspectRatio="none">
        <path v-for="(c, i) in connectors" :key="i" :d="c.d"
              class="wire" :class="{ on: c.on }" fill="none" />
      </svg>

      <!-- partidas -->
      <div v-for="m in matches" :key="m.key" class="mcard"
           :class="{ resolved: m.resolved, final: m.final }"
           :style="{ left: m.x + 'px', top: m.y + 'px' }">
        <div class="row" :class="{ win: m.resolved && m.winner === 'home', lose: m.resolved && m.winner === 'away' }">
          <span class="tname">{{ m.home || 'A definir' }}</span>
          <span class="score">{{ m.resolved ? m.hs : '·' }}</span>
        </div>
        <div class="row" :class="{ win: m.resolved && m.winner === 'away', lose: m.resolved && m.winner === 'home' }">
          <span class="tname">{{ m.away || 'A definir' }}</span>
          <span class="score">{{ m.resolved ? m.as : '·' }}</span>
        </div>
      </div>

      <!-- campeão -->
      <transition name="pop">
        <div v-if="champName()" class="champ"
             :style="{ left: P.champ.x + 'px', top: P.champ.y + 'px' }">
          <div class="trophy">🏆</div>
          <div class="clabel">Campeão</div>
          <div class="cname">{{ champName() }}</div>
        </div>
      </transition>
    </div>

    <div class="controls">
      <button class="btn primary" @click="play">▶ Simular torneio</button>
      <button class="btn ghost" @click="reset">↺ Reiniciar</button>
      <span class="legend">Quartas → Semis → Final</span>
    </div>
  </div>
</template>

<style scoped>
.bw { display: flex; flex-direction: column; align-items: center; gap: 1.1rem; }
.stage {
  position: relative; width: 1115px; height: 510px; zoom: 0.74;
  font-family: 'Inter', sans-serif;
}
.wires { position: absolute; inset: 0; width: 1115px; height: 510px; pointer-events: none; }
.wire {
  stroke: oklch(1 0 0 / 0.12); stroke-width: 2.5;
  stroke-dasharray: 620; stroke-dashoffset: 620;
  transition: stroke-dashoffset .7s ease, stroke .7s ease;
}
.wire.on { stroke-dashoffset: 0; stroke: oklch(0.852 0.199 91.936 / 0.55); }

.mcard {
  position: absolute; width: 210px; height: 84px;
  background: oklch(0.205 0 0); border: 1px solid oklch(1 0 0 / 0.08);
  border-radius: 12px; overflow: hidden; display: flex; flex-direction: column;
  transition: border-color .4s ease, box-shadow .4s ease, transform .4s ease;
}
.mcard.resolved { border-color: oklch(1 0 0 / 0.16); }
.mcard.final { box-shadow: 0 0 0 1px oklch(0.852 0.199 91.936 / 0.25); }
.row {
  flex: 1; display: flex; align-items: center; justify-content: space-between;
  padding: 0 14px; font-size: 15px; font-weight: 600; color: oklch(0.85 0 0);
  transition: all .45s cubic-bezier(.2,.8,.2,1); border-left: 3px solid transparent;
}
.row + .row { border-top: 1px solid oklch(1 0 0 / 0.06); }
.tname { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.score { font-variant-numeric: tabular-nums; opacity: .5; font-weight: 800; }
.row.win {
  color: oklch(0.95 0.06 95); border-left-color: oklch(0.852 0.199 91.936);
  background: linear-gradient(90deg, oklch(0.852 0.199 91.936 / 0.14), transparent);
}
.row.win .score { opacity: 1; color: oklch(0.852 0.199 91.936); }
.row.lose { opacity: .4; }

.champ {
  position: absolute; width: 190px; padding: 18px 16px; text-align: center;
  background: linear-gradient(160deg, oklch(0.852 0.199 91.936), oklch(0.7 0.16 70));
  border-radius: 16px; color: oklch(0.16 0 0);
  box-shadow: 0 0 50px oklch(0.852 0.199 91.936 / 0.45);
  animation: glow 1.8s ease-in-out infinite alternate;
}
.trophy { font-size: 40px; line-height: 1; }
.clabel { font-size: 11px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; opacity: .7; margin-top: 6px; }
.cname { font-size: 20px; font-weight: 900; margin-top: 2px; }
@keyframes glow {
  from { box-shadow: 0 0 32px oklch(0.852 0.199 91.936 / 0.35); transform: translateY(0); }
  to   { box-shadow: 0 0 64px oklch(0.852 0.199 91.936 / 0.6); transform: translateY(-4px); }
}
.pop-enter-active { transition: opacity .6s ease, transform .7s cubic-bezier(.2,1.25,.4,1); }
.pop-enter-from { opacity: 0; transform: scale(.7) rotate(-6deg); }

.controls { display: flex; align-items: center; gap: 14px; font-family: 'Inter', sans-serif; }
.btn {
  border-radius: 10px; padding: 9px 18px; font-size: 14px; font-weight: 700;
  cursor: pointer; border: 1px solid transparent; transition: all .2s;
}
.btn.primary { background: oklch(0.852 0.199 91.936); color: oklch(0.16 0 0); }
.btn.primary:hover { filter: brightness(1.08); transform: translateY(-1px); }
.btn.ghost { background: transparent; border-color: oklch(1 0 0 / 0.2); color: oklch(0.8 0 0); }
.btn.ghost:hover { border-color: oklch(1 0 0 / 0.4); }
.legend { font-size: 12px; color: oklch(0.6 0 0); letter-spacing: .04em; }
</style>
