# CupHub

Este trabalho tem como objetivo desenvolver um sistema para auxiliar na organização e no gerenciamento de torneios e campeonatos, oferecendo recursos que facilitem o processo de inscrição de equipes, geração de chaveamentos, registro de resultados e acompanhamento do desempenho dos participantes. A proposta busca centralizar essas funcionalidades em uma única plataforma, proporcionando maior eficiência, transparência e praticidade tanto para os organizadores quanto para os competidores.

## Integrantes

* Arthur Mendes Pereira, thumendess@gmail.com

* Gabriel Almeida Pinhão, gabrielpinhao1@gmail.com

* Gustavo Carvalho Ferreira Pinheiro, gustavocfpinheiro@gmail.com

* Henrique Caldeira Assis Xavier, henriquecaldeirax3@gmail.com

* Lucas Guimarães Pós, poslucas27@gmail.com

* Pedro Luis Gonçalvez Lopes, plglopes40@gmail.com

## Professor

* Joana Gabriela Ribeiro de Souza
* Cleia Marcia Gomes Amaral

## Instruções de utilização

### Pré-requisitos

- **Java 25** ou superior
- **Node.js 18+** ou **Bun**
- **MySQL 8+** (ou MariaDB compatível)

### Configuração do banco de dados

1. Certifique-se de que o MySQL está rodando na porta padrão (3306).
2. O banco de dados `cuphub` será criado automaticamente na primeira execução.

### Configuração do back-end

1. Acesse a pasta do back-end:
   ```bash
   cd src/back/api
   ```

2. Copie o arquivo de exemplo de configuração:
   ```bash
   copy src\main\resources\application.properties.example src\main\resources\application.properties
   ```

3. Edite o `application.properties` conforme necessário (usuário/senha do MySQL, chaves JWT, etc.).

### Execução do back-end

```bash
cd src/back/api
.\mvnw spring-boot:run
```

A API estará disponível em `http://localhost:8080`.

### Configuração e execução do front-end

1. Acesse a pasta do front-end:
   ```bash
   cd src/front
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

O front-end estará disponível em `http://localhost:5173`.

### Comandos úteis (front-end)

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera a versão de produção |
| `npm run lint` | Verifica problemas de estilo |
| `npm run typecheck` | Verifica erros de tipos TypeScript |
| `npm run format` | Formata o código com Prettier |

## Implantação (Deploy)

A aplicação é publicada inteiramente no **[Railway](https://railway.app)** em três serviços: **front-end** (Vite + Caddy), **API** (Spring Boot / Java 25, Docker) e **MySQL** (gerenciado).

* **Aplicação no ar:** **https://cuphub.up.railway.app**
* **API:** https://cuphub-api.up.railway.app

O passo a passo completo (criação dos serviços, variáveis de ambiente, CORS e verificação) está em **[DEPLOY.md](DEPLOY.md)**.

Acesso de demonstração (senha `12345678`): `admin@cuphub.com` (admin), `roberto.ferreira@cuphub.com` (organizador), `joao.silva@aluno.puc.br` (participante).

## Apresentação e demonstração

* **Slides (PDF):** [presentation/CupHub.pdf](presentation/CupHub.pdf)
* **Vídeo de demonstração:** [docs/video/CupHub-demo.mp4](docs/video/CupHub-demo.mp4)

## Uso de IA no desenvolvimento

O CupHub foi desenvolvido com apoio de agentes de IA para a implementação, seguindo um fluxo guiado por contexto em que a modelagem e as decisões de projeto eram feitas pelo time.

### Fluxo de trabalho

1. **Modelagem:** o processo de negócio e os requisitos eram modelados pelo grupo.
2. **Issue:** cada funcionalidade virava uma issue no GitHub, escrita a partir da modelagem de processos e dos requisitos.
3. **Plano de implementação:** da issue, montávamos um arquivo `.md` descrevendo o que deveria ser feito (escopo, regras de negócio e critérios esperados).
4. **Enriquecer o prompt** Nessa etapa de planejamento usamos a skill **Superpowers**, em especial as sub-skills de *brainstorming* e de *perguntas*, para refinar e enriquecer o contexto antes de pedir a implementação.
5. **Implementação com IA:** esse arquivo era passado como contexto ao agente, que implementava seguindo o plano.
6. **Commit individual:** cada integrante era responsável por fazer o commit da sua parte, revisando o que foi gerado antes de integrá-lo.

### O que era feito pelo time

* Modelagem de processos, levantamento de requisitos e definição do escopo de cada issue.
* Escrita dos planos que direcionavam o agente.
* Revisão e integração do código gerado.

### Aprendizados

O principal ponto foi que a qualidade da saída dependia da qualidade do contexto: issues e planos bem especificados produziram implementações mais aderentes aos requisitos. Foi uma forma inicial de trabalhar com IA, baseada em contexto manual por tarefa.
