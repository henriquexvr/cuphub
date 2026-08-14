# Roteiro — Apresentação Final CupHub (v1)

**Duração-alvo:** 8–10 min · **6 integrantes, todos com fala** · deck em Slidev
(as falas também estão nas *notas do apresentador* de cada slide — `http://localhost:3030/presenter/`)

| # | Slide | Quem fala | Tempo |
|---|-------|-----------|-------|
| 1 | A dor (planilha/WhatsApp/formulário) | **Arthur** | ~30s |
| 2 | Reveal CupHub | **Arthur** | ~15s |
| 3 | A solução (fluxo + 3 papéis) | **Pedro** | ~50s |
| 4 | 6 processos TO-BE + BPMN | **Gabriel** | ~70s |
| 5 | Chaveamento ao vivo (Proc. 3+4) | **Henrique** | ~80s |
| 6 | Modelo de dados (7 entidades + ER) | **Gustavo** | ~60s |
| 7 | Indicadores de desempenho | **Lucas** | ~60s |
| 8 | Tecnologias | **Henrique** | ~45s |
| 9 | Conclusão | **Arthur** | ~40s |
| 10 | Perguntas | — | — |

**Total estimado:** ~8 min de fala + respiro/transições = dentro de 8–10 min.

---

## Falas (rascunho v1 — ajustem ao jeito de cada um, sem decorar)

### 1 · Arthur — abertura
> "Imagina organizar um campeonato de 16 times. Agora imagina fazer isso com uma planilha, um grupo de WhatsApp e um formulário do Google — ao mesmo tempo. É esse caos que a gente foi resolver."

### 2 · Arthur — reveal
> "Esse caos vira uma coisa só. CupHub: da inscrição ao troféu, numa plataforma só." → *"Pedro, mostra como."*

### 3 · Pedro — solução
> "O CupHub cobre o ciclo inteiro de um campeonato sem sair da plataforma: inscrição, aprovação, chaveamento, resultados e estatísticas. E faz isso com três papéis — organizador cria e gerencia, participante inscreve o time e acompanha, moderador aprova os torneios antes de irem ao ar." → *"Gabriel detalha cada etapa."*

### 4 · Gabriel — processos TO-BE
> "Cada um dos seis processos foi modelado em BPMN e virou tela de verdade. À direita, o BPMN da gestão de torneios — esse mesmo diagrama é o que roda hoje. Modelamos os seis assim." → *"O coração disso é o chaveamento. Henrique."*

### 5 · Henrique — chaveamento (clica ▶ Simular torneio)
> "Isso não é vídeo — é o algoritmo do sistema. Cada placar registrado define o vencedor e propaga pra próxima rodada. Se o número de times não é potência de 2, ele cria os 'byes' sozinho. Quando a final acaba, o campeão é divulgado na hora." → *"Tudo isso precisa de dados bem modelados. Gustavo."*

### 6 · Gustavo — modelo de dados
> "O sistema gira em torno de sete entidades: usuário cria times, times se inscrevem em torneios, torneios geram partidas. Tudo com UUID, em MySQL versionado por Flyway — o banco é reconstruível do zero a qualquer momento." → *"Em cima desses dados, o Lucas extrai os indicadores."*

### 7 · Lucas — indicadores
> "O CupHub não só organiza: ele mede. Preenchimento de vagas, conclusão de partidas, aceitação de convites, aproveitamento dos times — calculados a partir dos dados reais, num endpoint próprio. E o mercado existe: 59 milhões acompanham e-sports no Brasil, e o amador não tinha ferramenta." → *"Como construímos isso? Henrique."*

### 8 · Henrique — tecnologias
> "Back-end em Spring Boot 4 com Java 25, JWT e e-mail via Resend. Front em React 19 com Vite e Tailwind, conversando com a API por React Query. Persistência em MySQL versionada com Flyway. Cada escolha resolve um problema do fluxo que mostramos." → *"Pra fechar, Arthur."*

### 9 · Arthur — conclusão
> "Começamos com três ferramentas que não conversavam. Terminamos com uma plataforma que leva o campeonato da inscrição ao troféu — modelada, implementada e testada. O próximo passo já está em andamento: o deploy público e o vídeo da aplicação. Obrigado — perguntas?"

---

## Cobertura da rubrica
- ✅ Contextualização do problema (slide 1) · Descrição da solução (3)
- ✅ Processos TO-BE (4) · Modelo de dados (6) · Indicadores (7) · Tecnologias (8) · Conclusão (9)
- ✅ Todos os 6 integrantes com fala · Tempo dentro de 8–10 min

## Pendências antes da versão final
- [ ] Trocar BPMN-p1 por todos os 6 (ou um carrossel) se sobrar tempo
- [ ] Substituir os valores dos KPIs pelos números reais do deploy com seed
- [ ] Embutir o app real rodando (iframe) no slide do chaveamento, se houver deploy
- [ ] Revisão ortográfica final + ensaio cronometrado
