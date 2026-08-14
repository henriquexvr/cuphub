---
theme: default
title: CupHub
titleTemplate: '%s'
background: '#0a0a0a'
class: text-center
highlighter: shiki
transition: slide-left
mdc: true
fonts:
  sans: Inter
  provider: google
  weights: '400,500,600,700,800,900'
---

<div class="cold">
<div class="eyebrow" v-motion :initial="{ opacity: 0, y: 16 }" :enter="{ opacity: 1, y: 0, transition: { delay: 150 } }">Organizar um campeonato amador hoje</div>
<div class="tools">
<div class="tool" v-motion :initial="{ opacity: 0, y: 24 }" :enter="{ opacity: 1, y: 0, transition: { delay: 500 } }"><div class="ti">📊</div><div class="tl">Planilha</div><div class="td">chaveamento na mão</div></div>
<div class="tool" v-motion :initial="{ opacity: 0, y: 24 }" :enter="{ opacity: 1, y: 0, transition: { delay: 720 } }"><div class="ti">💬</div><div class="tl">WhatsApp</div><div class="td">inscrição que se perde</div></div>
<div class="tool" v-motion :initial="{ opacity: 0, y: 24 }" :enter="{ opacity: 1, y: 0, transition: { delay: 940 } }"><div class="ti">📝</div><div class="tl">Formulário</div><div class="td">placar que ninguém atualiza</div></div>
</div>
<div class="punch" v-click>Três ferramentas. Nenhuma conversa entre si.</div>
</div>

<!--
ARTHUR — abertura (~30s) · NÃO leia "somos o grupo tal"
"Imagina organizar um campeonato de 16 times. Agora imagina fazer isso com uma planilha, um grupo de WhatsApp e um formulário do Google — ao mesmo tempo. É esse caos que a gente foi resolver."
[avança ao clicar a frase de baixo, e parte pro reveal]
-->

---
layout: center
class: text-center
title: Reveal
---

<HeroReveal />

<!--
ARTHUR — reveal (~15s)
"Esse caos vira uma coisa só." [deixa a animação terminar] "CupHub: da inscrição ao troféu, numa plataforma só."
[passa a palavra: "Pedro, mostra como."]
-->

---
class: text-center
title: A solução
---

<div class="wrap">
<div class="kicker">A solução</div>
<div class="title">Um fluxo. Três papéis. <span class="hl">Zero abas soltas.</span></div>
<div class="flow">
<div class="step" v-click><span class="sn">→</span>Inscrição</div>
<div class="step" v-click><span class="sn">→</span>Aprovação</div>
<div class="step" v-click><span class="sn">→</span>Chaveamento</div>
<div class="step" v-click><span class="sn">→</span>Resultados</div>
<div class="step" v-click><span class="sn">→</span>Estatísticas</div>
</div>
<div class="roles" v-click><span class="role">Organizador</span><span class="role">Participante</span><span class="role">Moderador</span></div>
</div>

<!--
PEDRO — visão geral (~50s)
"O CupHub cobre o ciclo inteiro de um campeonato, sem sair da plataforma." [revela cada etapa do fluxo no clique]
"E faz isso com três papéis: o organizador cria e gerencia, o participante inscreve seu time e acompanha, e o moderador aprova os torneios antes de irem ao ar."
[handoff: "Gabriel detalha cada etapa desse fluxo."]
-->

---
class: process-slide
title: Processos TO-BE
---

<div class="cols2">
<div class="head"><div class="kicker">Modelagem TO-BE</div><div class="subtitle">Seis processos, do edital ao pódio</div></div>
<div class="grid2">
<div class="plist">
<div class="prow" v-click><span class="pn">01</span><div><b>Gestão de torneios</b><span>criação + aprovação</span></div></div>
<div class="prow" v-click><span class="pn">02</span><div><b>Inscrição de times</b><span>capitão inscreve, organizador aprova</span></div></div>
<div class="prow" v-click><span class="pn">03</span><div><b>Geração de chaveamento</b><span>sorteio + byes automáticos</span></div></div>
<div class="prow" v-click><span class="pn">04</span><div><b>Execução das partidas</b><span>placar → vencedor automático</span></div></div>
<div class="prow" v-click><span class="pn">05</span><div><b>Divulgação do resultado</b><span>campeão em destaque</span></div></div>
<div class="prow" v-click><span class="pn">06</span><div><b>Estatísticas & desempenho</b><span>indicadores do negócio</span></div></div>
</div>
<div class="bpmn-frame" v-click><img src="/diagrams/BPMN-p1.svg" alt="BPMN do processo de gestão de torneios" /><div class="bpmn-cap">BPMN · Processo 01 — modelado e implementado</div></div>
</div>
</div>

<!--
GABRIEL — processos TO-BE (~70s)
"Cada um dos seis processos foi modelado em BPMN e virou tela de verdade no sistema." [revela 01..06]
"À direita, o BPMN do processo de gestão de torneios — esse mesmo diagrama é o que roda hoje na aplicação. Modelamos os seis assim."
[handoff: "E o coração disso tudo é o chaveamento. Henrique mostra rodando."]
-->

---
class: text-center
title: Chaveamento
---

<div class="wrap">
<div class="kicker">Processos 03 + 04, ao vivo</div>
<div class="subtitle">O chaveamento se resolve <span class="hl">sozinho</span></div>
<Bracket />
</div>

<!--
HENRIQUE — demo do chaveamento (~80s) · clica "▶ Simular torneio"
"Isso não é vídeo — é o algoritmo do sistema." [clica Simular]
"Cada placar registrado define o vencedor automaticamente e propaga pra próxima rodada. Se o número de times não é potência de 2, o sistema cria os 'byes' sozinho."
"Quando a final acaba, o campeão é divulgado na hora — sem ninguém apertar nada." [deixa chegar no campeão]
[handoff: "Tudo isso precisa de dados bem modelados. Gustavo."]
-->

---
class: data-slide
title: Modelo de dados
---

<div class="cols2">
<div class="head"><div class="kicker">Modelo de dados</div><div class="subtitle">Sete entidades, um relacional enxuto</div></div>
<div class="grid2">
<div>
<div class="ents">
<span class="ent" v-click>User</span>
<span class="ent" v-click>Team</span>
<span class="ent" v-click>TeamMember</span>
<span class="ent" v-click>TeamInvite</span>
<span class="ent" v-click>Tournament</span>
<span class="ent" v-click>Registration</span>
<span class="ent" v-click>Match</span>
</div>
<div class="data-note" v-click>UUIDs · MySQL + Flyway · integridade por chaves estrangeiras</div>
</div>
<div class="er-frame" v-click><img src="/diagrams/model-relacional.jpeg" alt="Modelo relacional do CupHub" /></div>
</div>
</div>

<!--
GUSTAVO — modelo de dados (~60s)
"O sistema gira em torno de sete entidades." [revela uma a uma]
"O usuário cria times; times se inscrevem em torneios; torneios geram partidas. Tudo com UUID, em MySQL versionado por Flyway — então o banco é reconstruível do zero a qualquer momento."
[handoff: "E em cima desses dados, o Lucas extrai os indicadores."]
-->

---
class: text-center
title: Indicadores
---

<div class="wrap">
<div class="kicker">Indicadores de desempenho</div>
<div class="subtitle">Números que o sistema calcula <span class="hl">sozinho</span></div>
<div class="kpis">
<div class="kpi" v-motion :initial="{ opacity: 0, y: 28 }" :enter="{ opacity: 1, y: 0, transition: { delay: 100 } }"><div class="num"><CountUp :to="90" suffix="%" /></div><div class="lbl">Preenchimento de vagas</div></div>
<div class="kpi" v-motion :initial="{ opacity: 0, y: 28 }" :enter="{ opacity: 1, y: 0, transition: { delay: 280 } }"><div class="num"><CountUp :to="89" suffix="%" /></div><div class="lbl">Conclusão de partidas</div></div>
<div class="kpi" v-motion :initial="{ opacity: 0, y: 28 }" :enter="{ opacity: 1, y: 0, transition: { delay: 460 } }"><div class="num"><CountUp :to="74" suffix="%" /></div><div class="lbl">Aceitação de convites</div></div>
<div class="kpi" v-motion :initial="{ opacity: 0, y: 28 }" :enter="{ opacity: 1, y: 0, transition: { delay: 640 } }"><div class="num"><CountUp :to="59" suffix="M" /></div><div class="lbl">Espectadores de e-sports no Brasil</div></div>
</div>
<div class="kpi-src" v-click>Calculados no endpoint <code>/api/indicators</code> — não são números de slide.</div>
</div>

<!--
LUCAS — indicadores (~60s)
"O CupHub não só organiza: ele mede." [os números sobem do zero ao entrar no slide]
"Preenchimento de vagas, conclusão de partidas, aceitação de convites, aproveitamento dos times — tudo calculado a partir dos dados reais, num endpoint próprio."
"E o mercado existe: 59 milhões de pessoas acompanham e-sports no Brasil, e o amador não tinha ferramenta."
[handoff: "Como a gente construiu isso? Henrique."]
-->

---
class: text-center
title: Tecnologias
---

<div class="wrap">
<div class="kicker">Tecnologias</div>
<div class="subtitle">Stack moderna, escolhas <span class="hl">deliberadas</span></div>
<div class="stack">
<div class="scol" v-click><div class="sh">Back-end</div><span>Spring Boot 4</span><span>Java 25</span><span>JWT</span><span>Resend</span></div>
<div class="scol" v-click><div class="sh">Front-end</div><span>React 19</span><span>Vite</span><span>Tailwind 4</span><span>React Query</span></div>
<div class="scol" v-click><div class="sh">Dados</div><span>MySQL</span><span>Flyway</span><span>JPA / Hibernate</span></div>
</div>
</div>

<!--
HENRIQUE — tecnologias (~45s)
"Back-end em Spring Boot 4 com Java 25, autenticação JWT e envio de e-mail via Resend. Front em React 19 com Vite e Tailwind, conversando com a API por React Query. Persistência em MySQL versionada com Flyway."
"Não é stack de tutorial: cada escolha resolve um problema do fluxo que mostramos."
[handoff: "Pra fechar, Arthur."]
-->

---
class: text-center
title: Conclusão
---

<div class="wrap">
<div class="kicker">Conclusão</div>
<div class="title">Do <span class="strike">caos de três abas</span> ao <span class="hl">troféu</span></div>
<div class="conc">
<div v-click>✓ Seis processos modelados e implementados</div>
<div v-click>✓ Sistema completo, testado e versionado</div>
<div v-click>✓ No ar em <span class="hl">cuphub.up.railway.app</span></div>
</div>
</div>

<!--
ARTHUR — conclusão (~40s)
"A gente começou com três ferramentas que não conversavam. Termina com uma plataforma que leva o campeonato da inscrição ao troféu — modelada, implementada, testada e no ar."
"Podem acessar agora em cuphub.up.railway.app."
"Obrigado — perguntas?"
-->

---
layout: center
class: text-center
title: Encerramento
---

<div class="wrap">
<div class="end-word">Cup<span class="hl">Hub</span></div>
<div class="end-url">cuphub.up.railway.app</div>
<div class="end-team">Arthur · Pedro · Henrique · Gustavo · Gabriel · Lucas</div>
</div>

<!--
[slide de descanso para perguntas]
-->
