# Plano de Execução — Lucas (Processo 5: Divulgação de Resultado e Premiação)

> **Como usar:** abra este projeto no opencode e mande o prompt inicial abaixo. **[IA]** = feito pelo agente; **[VOCÊ]** = você roda/olha a tela e responde.

**Prompt inicial:**
> `Com base no arquivo PLANO_LUCAS.md, como está a configuração do projeto e quais os próximos passos que preciso fazer?`

**Seu processo:** Processo 5 — Divulgação de Resultado e Entrega de Premiação (`docs/processo-5-divulgacao-de-resultado-e-entrega-de-premiacao.md`)
**Sua branch:** `feat/lucas-revisao-p5`
**Ordem na fila:** 5º

---

## Tarefa 1 — [IA] Validar a configuração do projeto

Checar e **reportar** (não seguir até reportar):

1. **MySQL** em `localhost:3306`, banco `cuphub` (auto-criado). Rodando? Backend conecta?
2. **`src/back/api/src/main/resources/application.properties`** (git-ignored) — todas preenchidas:
   - `spring.datasource.url/username/password`, `security.jwt.secret/expiration`, `resend.api-key`, `resend.from-email` (`cuphub@nousforge.work` p/ envio real), `app.frontend-url=http://localhost:5173`. Se não existir, reporte.
3. **Bun:** `bun --version` (instalar se faltar).
4. **Comandos:** Backend `cd src/back/api && ./mvnw spring-boot:run`; Frontend `cd src/front && bun install && bun run dev` (`http://localhost:5173`).
5. **Skills:** `npx skills add github/thumendes/cuphub-skills --skill '*'` + `cd ~/.claude/skills/cuphub-process-documentation/scripts && npm install`.

**Saída esperada:** relatório do que está OK / falta + comandos para subir back e front.

---

## Tarefa 2 — [VOCÊ + IA] Revisar o Processo 5 contra a implementação

Comparar com `docs/processo-5-divulgacao-de-resultado-e-entrega-de-premiacao.md`, `docs/images/BPMN-p5.svg` e `docs/images/wireframes/processo5/`.

**Roteiro de teste do Processo 5 (Divulgação de Resultado):**
1. Pré-requisito: um torneio **finalizado** — registre a última partida do bracket (Processo 4) até o torneio virar **finished** automaticamente.
2. Acesse o detalhe do torneio (`/torneios/:id`) como **qualquer usuário**: deve aparecer o **banner do campeão em destaque dourado**, seguido do **chaveamento inline** com todos os placares.
3. Clique em **"Ver completo →"** para ir a `/torneios/:id/chaveamento`, que também mostra o **banner do campeão no topo**, com o nome do torneio e a marcação **"Finalizado"**.
4. Confirme que **não há etapa manual** de aprovação de ranking nem registro de premiação — o resultado fica público automaticamente ao fim da última partida.

**Código de referência:** `src/front/src/pages/torneios/TorneioDetalhe.tsx` (banner de campeão + chaveamento inline) e `src/front/src/pages/torneios/Chaveamento.tsx` (banner no topo + "Finalizado"). Observação: o banner já usa o ícone de troféu (lucide) e o nome do campeão com troféu via `<TeamName>` (PR #95).

Compare item a item:
- **Campos/elementos** do banner (nome do campeão, torneio, "Finalizado") batem com a tela?
- **Comandos/botões** ("Ver completo →") e destinos batem?
- **Status** (`finished`) e o gatilho **automático** batem com o código?
- **BPMN** reflete que o início é automático (sem ação do organizador)?
- **Wireframes** refletem as telas reais?

> Use a skill **`cuphub-process-review`** como guia.

---

## Tarefa 3 — [VOCÊ] Reportar: tudo certo ou divergência?

- **"Está tudo certo"** — nada diverge.
- **"Tem divergência em ..."** — por categoria: **campos**, **BPMN**, **wireframe**, comandos, status.

Depois **peça as instruções de alteração**. Regra de ouro: **a implementação é a fonte da verdade**.

---

## Tarefa 4 — [IA] Ajustar a documentação com as skills

- `.md`: `docs/processo-5-divulgacao-de-resultado-e-entrega-de-premiacao.md`.
- **Wireframes:** spec JSON + `generate-wireframes.mjs` → `docs/images/wireframes/processo5/`.
- **BPMN:** `docs/images/BPMN-p5.bpmn` + `render-bpmn.mjs` → regenera `.svg`/`.png`.

---

## Tarefa 5 — [IA] Tarefa de código designada: badge de participação no time

Implementar a **Tarefa 3** de `.opencode/correcao-erros-localizados.md` (indicador visual de participação nos cards de time — `src/front/src/hooks/useAuth.ts` exporta `userId` e `src/front/src/pages/times/Times.tsx` marca "Capitão"/"Meu time" com borda e badge). Siga os passos de lá. Rode `bun run build`.

> Atenção: o `Times.tsx` também recebe campo de busca (tarefa do Gustavo) e o `<TeamName>` (PR #95). Faça o rebase/merge da main antes de começar para evitar conflito, e ao editar o card preserve o `<TeamName>` já existente no `<h3>`.

---

## Tarefa 6 — [IA] Branch e PR

1. `git checkout main && git pull && git checkout -b feat/lucas-revisao-p5`
2. Commits simples (`tipo: descrição`, **sem** co-author). Ex.: `docs: revisao do processo 5` e `feat: indicador de participacao nos cards de time`.
3. `git push -u origin feat/lucas-revisao-p5` e `gh pr create` para o Arthur revisar e mergear.
