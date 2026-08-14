# Roteiro do Vídeo da Aplicação — CupHub (≤ 5 min)

**Gravação:** tela do app em **https://cuphub.up.railway.app** (já com dados de demonstração).
**Senha de todos os usuários:** `12345678`.
**Meta de tempo:** ~4min40 (folga sob o limite de 5 min).

> 💡 **Antes de gravar:** abra abas/janelas anônimas já logadas em cada papel (admin, organizador, participante) pra trocar rápido. Deixe os torneios da demo abertos em abas. Faça um ensaio cronometrado. Grave em 1080p, navegador em tela cheia, **um tema só** (claro ou escuro).

| Tempo | Cena | O que fazer na tela | Fala |
|---|---|---|---|
| 0:00–0:20 | **Home** | Abrir o site; rolar mostrando torneios em andamento / inscrições abertas / finalizados | "O CupHub centraliza o ciclo inteiro de um campeonato. Esta é a home: torneios em andamento, com inscrições abertas e finalizados, num lugar só." |
| 0:20–0:45 | **Login + papéis** | Entrar como `roberto.ferreira@cuphub.com` (organizador); mostrar o dashboard | "A plataforma tem três papéis. Entro como organizador e caio no meu painel, com meus times e torneios ativos." |
| 0:45–1:15 | **Proc. 1 — Gestão de torneios** | "Novo torneio" → passo 1 (nome, datas, máx. times) → passo 2 (pontuação) → enviar; status "aguardando aprovação" | "Processo 1: criação. Preencho identificação e regras de pontuação em duas etapas, e o torneio segue para aprovação." |
| 1:15–1:35 | **Moderação** | Entrar como `admin@cuphub.com` → Moderador → aprovar o torneio pendente | "Como administrador, reviso os torneios pendentes e aprovo." |
| 1:35–2:05 | **Proc. 2 — Inscrição de times** | Como participante (`joao.silva@aluno.puc.br`), abrir **Copa de Verão 2026** → escolher o time → "Inscrever". Depois, como organizador, aprovar a inscrição | "Processo 2: inscrição. Como capitão, inscrevo meu time num torneio aberto; o organizador aprova ou rejeita." |
| 2:05–2:45 | **Proc. 3 + 4 — Chaveamento e partidas** | Abrir **Liga Aberta BH 2026** (16 times, em andamento) → Chaveamento (mostrar o bracket grande). Como organizador, "Registrar placar" numa partida agendada → bracket atualiza | "Processos 3 e 4, o coração do sistema: gero o chaveamento automaticamente — aqui um mata-mata de 16 times. Registro um placar e o sistema calcula o vencedor e o propaga para a próxima rodada, sozinho." |
| 2:45–3:10 | **Proc. 5 — Divulgação** | Abrir **Copa PUC 2025** (finalizado) → banner dourado do campeão + chaveamento completo | "Processo 5: divulgação. Quando a final acaba, o campeão é destacado automaticamente, com o chaveamento completo visível para todos." |
| 3:10–3:40 | **Times e convites** | Times → abrir **Leões da PUC** → membros; como capitão, mostrar o convite por e-mail | "Cada time tem capitão e membros, e o capitão convida novos jogadores por e-mail — o convidado aceita por um link." |
| 3:40–4:20 | **Proc. 6 — Indicadores** | Como admin → tela **Indicadores** (global): preenchimento **90%**, conclusão **89%**, aceitação **74%**, aproveitamento. Abrir também indicadores de um torneio e de um time | "Processo 6: desempenho. A plataforma calcula indicadores reais — preenchimento de vagas, conclusão de partidas, aceitação de convites e aproveitamento — no nível da plataforma, de cada torneio e de cada time." |
| 4:20–4:40 | **Fechamento** | Voltar à home; mostrar a URL | "Tudo isso no ar, em cuphub.up.railway.app. CupHub — da inscrição ao troféu." |

---

## Checklist de gravação
- [ ] Tema único (claro **ou** escuro) do começo ao fim
- [ ] Cursor visível; cliques sem pressa (dá tempo de ler a tela)
- [ ] Sem dados sensíveis na tela (e-mails da demo tudo bem)
- [ ] Áudio limpo (sem eco/ruído)

## Entrega do arquivo
- Exportar em **1080p, H.264 (.mp4)**.
- **Manter abaixo de 100 MB** (limite de arquivo do GitHub sem Git LFS). Se passar, comprimir:
  ```bash
  ffmpeg -i video-original.mp4 -vcodec libx264 -crf 28 -preset slow -acodec aac -b:a 128k docs/video/cuphub-demo.mp4
  ```
- Colocar o `.mp4` em **`docs/video/`** e commitar (o vídeo vai no repositório, não como link).
