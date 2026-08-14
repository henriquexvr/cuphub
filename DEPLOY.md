# Implantação do CupHub

Guia de deploy em produção — **tudo no [Railway](https://railway.app)** (uma plataforma, um projeto, repositório privado sem paywall).

```
  Railway (mesmo projeto)
  ┌─────────────┐   ┌──────────────────────┐   ┌───────────────┐
  │  Front       │──►│  API (Spring Boot)    │──►│  MySQL         │
  │  Vite + Caddy│   │  Java 25 / Docker     │   │  (gerenciado)  │
  └─────────────┘   └──────────────────────┘   └───────────────┘
```

Três serviços no mesmo projeto Railway: **MySQL**, **API** e **Front**.

> Ordem importa: **MySQL → API** (pega a URL da API) **→ Front** (usa a URL da API; pega a URL do front) **→ volta na API** e preenche o CORS com a URL do front.

> **Por que não Vercel?** O repositório está numa organização privada do GitHub e a Vercel exige plano **Pro** para deployar de org privada. O Railway deploya de repo privado sem custo, então mantemos tudo num lugar só.

---

## Pré-requisitos
- Repositório no GitHub já enviado (com o merge desta branch na `main`).
- Conta no [Railway](https://railway.app).
- Chave de API do [Resend](https://resend.com) com domínio verificado (e-mails).

---

## 1. Banco de dados (MySQL)
1. **New Project** no Railway.
2. **Add a service → Database → MySQL**. Expõe `MYSQLHOST`, `MYSQLPORT`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`.

## 2. API (Spring Boot)
1. No mesmo projeto: **Add a service → GitHub Repo** → este repositório.
2. **Settings:**
   - **Root Directory:** `src/back/api` (o `Dockerfile` é detectado automaticamente).
   - **Networking → Generate Domain** → gera a URL pública (ex.: `https://cuphub-api.up.railway.app`).
3. **Variables:**

   | Variável | Valor |
   |---|---|
   | `SPRING_PROFILES_ACTIVE` | `prod,seed` |
   | `SPRING_DATASOURCE_URL` | `jdbc:mysql://${{MySQL.MYSQLHOST}}:${{MySQL.MYSQLPORT}}/${{MySQL.MYSQLDATABASE}}?allowPublicKeyRetrieval=true&useSSL=false` |
   | `SPRING_DATASOURCE_USERNAME` | `${{MySQL.MYSQLUSER}}` |
   | `SPRING_DATASOURCE_PASSWORD` | `${{MySQL.MYSQLPASSWORD}}` |
   | `SECURITY_JWT_SECRET` | _gere com `openssl rand -hex 32`_ |
   | `RESEND_API_KEY` | _sua chave do Resend_ |
   | `RESEND_FROM_EMAIL` | _remetente do seu domínio_ |
   | `APP_FRONTEND_URL` | _preencher no passo 4_ |
   | `APP_CORS_ALLOWED_ORIGINS` | _preencher no passo 4_ |

4. Sucesso nos logs: `Started ApiApplication` e `Seed concluído! 46 usuários, 16 times, 11 torneios...`.

> **`prod,seed`** popula a demo **e reseta o banco a cada deploy/restart**. Para persistência (banco vazio), use só `prod`.

## 3. Front-end (Vite + Caddy)
1. No mesmo projeto: **Add a service → GitHub Repo** → este repositório (de novo).
2. **Settings → Root Directory:** `src/front` (usa o `Dockerfile` com Caddy).
3. **Networking → Generate Domain** → URL do front (ex.: `https://cuphub.up.railway.app`).
4. **Variables:**

   | Variável | Valor |
   |---|---|
   | `VITE_API_URL` | a URL pública da **API** (passo 2) — **sem** `/api` no final |

   > `VITE_API_URL` é build-time (o Railway injeta as variáveis como build args do Docker). Ao alterá-la, faça **Redeploy**.

## 4. Conectar front ↔ back (CORS)
Volte ao serviço da **API → Variables** e preencha com a URL do **Front** (passo 3):
- `APP_FRONTEND_URL = https://cuphub.up.railway.app`
- `APP_CORS_ALLOWED_ORIGINS = https://cuphub.up.railway.app`

A API redeploya. Fim.

---

## Verificação
```bash
# API no ar?
curl https://SUA-API.up.railway.app/api/tournaments | head

# Login da demo (senha 12345678)
curl -X POST https://SUA-API.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@cuphub.com","password":"12345678"}'
```

Acesse a URL do front e entre com qualquer login (senha **`12345678`**):

| Papel | E-mail |
|---|---|
| Admin | `admin@cuphub.com` |
| Organizador | `roberto.ferreira@cuphub.com` · `ana.lima@cuphub.com` · `marina.souza@cuphub.com` |
| Participante | `joao.silva@aluno.puc.br` (e outros 39) |

---

## Solução de problemas
- **CORS bloqueado:** `APP_CORS_ALLOWED_ORIGINS` deve ser exatamente a URL do front (com `https://`, sem barra final).
- **`Public Key Retrieval is not allowed`:** garanta o `?allowPublicKeyRetrieval=true&useSSL=false` na `SPRING_DATASOURCE_URL`.
- **Build do back/front:** mantenha o builder em **Dockerfile** (não Nixpacks) — cada serviço tem o seu.
- **Front carrega mas não loga:** `VITE_API_URL` errada (build-time → após mudar, **Redeploy** do serviço de front).
