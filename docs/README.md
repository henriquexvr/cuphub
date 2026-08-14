# CupHub


Arthur Mendes Pereira, thumendess@gmail.com

Gabriel Almeida Pinhão, gabrielpinhao1@gmail.com

Gustavo Carvalho F. Pinheiro, gustavocfpinheiro@gmail.com

Henrique Caldeira Assis Xavier, henriquecaldeirax3@gmail.com

Lucas Guimarães Pós, poslucas27@gmail.com

Pedro Luis Gonçalvez Lopes, plglopes40@gmail.com

---

Professores:

Cleia Marcia Gomes Amaral

Joana Gabriela Ribeiro de Souza

---

_Curso de Engenharia de Software_

_Instituto de Informática e Ciências Exatas – Pontifícia Universidade Católica de Minas Gerais (PUC MINAS), Belo Horizonte – MG – Brasil_

---

**Resumo:** 
O Cup Hub é um sistema web voltado para a gestão de torneios esportivos e competições de eSports, desenvolvido em Java Spring Boot. O projeto surgiu da dificuldade enfrentada por organizadores de campeonatos amadores, que hoje dependem de planilhas, formulários avulsos e aplicativos de mensagens para coordenar seus eventos, o que gera erros e prejudica a experiência dos participantes. O objetivo principal é reunir em uma única plataforma todas as etapas de um torneio, desde as inscrições até a divulgação do vencedor. O sistema foi pensado para três tipos de usuários: o organizador, que configura e administra o evento; o participante, que acompanha chaveamentos e resultados; e o administrador técnico, responsável pela manutenção da plataforma. Entre os principais resultados, destacam-se a geração automática de chaveamentos em diferentes formatos, a criação de dashboards com indicadores de desempenho e um módulo de histórico de partidas, tornando a gestão de torneios mais prática, centralizada e acessível.

---


## 1. Introdução

Este trabalho tem como objetivo desenvolver um sistema para auxiliar na organização e no gerenciamento de torneios e campeonatos, oferecendo recursos que facilitem o processo de inscrição de equipes, geração de chaveamentos, registro de resultados e acompanhamento do desempenho dos participantes. A proposta busca centralizar essas funcionalidades em uma única plataforma, proporcionando maior eficiência, transparência e praticidade tanto para os organizadores quanto para os competidores.

### 1.1 Contextualização

As competições esportivas vêm crescendo de forma significativa nos últimos anos, impulsionadas tanto pela valorização das modalidades tradicionais quanto pelo avanço dos esportes eletrônicos (eSports). O que antes estava concentrado principalmente em grandes federações passou por uma transformação digital, tornando mais acessível a organização de campeonatos, especialmente em ambientes escolares e universitários. Segundo a reportagem “eSports no Brasil: como 2025 redefiniu o cenário competitivo e o que esperar de 2026”, publicada pelo jornal Terra, esse crescimento também pode ser observado no cenário dos eSports no Brasil, que tem ganhado grande destaque nos últimos anos. Em 2025, o país consolidou-se como a segunda maior audiência digital de esportes do mundo, registrando cerca de 59 milhões de espectadores, o que evidencia o fortalecimento e a popularização das competições eletrônicas no país. Diante desse cenário, torna-se cada vez mais necessária a existência de ferramentas que auxiliem na organização e no acompanhamento adequado dessas competições.

A plataforma proposta consiste em uma solução web voltada para a gestão completa de torneios esportivos e competitivos, desde o planejamento inicial até a etapa de premiação. O sistema reúne em um único ambiente as principais atividades envolvidas na organização, permitindo a configuração personalizada do torneio, o gerenciamento das inscrições e a geração automática de chaveamentos. Além disso, possibilita o acompanhamento detalhado das partidas, reduzindo processos manuais e proporcionando mais organização, clareza e confiabilidade das informações para organizadores e participantes.


### 1.2 Problema

A gestão de torneios competitivos ainda enfrenta dificuldades devido à falta de uma plataforma que concentre todas as etapas do evento em um único ambiente. Atualmente, a organização costuma depender de processos fragmentados, utilizando ferramentas distintas como formulários genéricos para inscrições, aplicativos de mensagens para comunicação e planilhas para controle de chaves e resultados. Essa utilização de recursos separados aumenta o trabalho dos organizadores e amplia as chances de erros, falhas de comunicação e inconsistências nas informações, além de limitar o crescimento e a profissionalização das competições.

Essa fragmentação gera diversos problemas operacionais, afetando a organização desde o momento da inscrição até a divulgação dos resultados. O uso de métodos manuais para montar chaves e registrar partidas pode resultar em equívocos e retrabalho, enquanto a ausência de um banco de dados centralizado dificulta a visualização clara e organizada das informações. Para os participantes, isso se traduz em uma experiência menos satisfatória, já que o acesso a classificações, cronogramas e resultados costuma ser demorado e disperso, prejudicando a percepção de organização e profissionalismo do evento.

Dessa forma, o principal desafio é a inexistência de uma plataforma integrada, intuitiva e financeiramente acessível, que permita aos organizadores administrar todas as etapas do torneio em um único sistema e ofereça aos participantes uma experiência mais clara, organizada e transparente ao longo de toda a competição.


### 1.3 Objetivo geral

Desenvolver um sistema web em Java Spring Boot com banco de dados para automatizar os processos de gestão de torneios e campeonatos, permitindo que os organizadores criem e configurem os eventos, gerenciem inscrições de times, gerem chaveamentos automaticamente, registrem resultados e acompanhem o desempenho dos participantes.

#### 1.3.1 Objetivos específicos

Modelar os processos de negócio (como o fluxo de inscrição e a validação de resultados) utilizando a notação BPMN para garantir a clareza e a rastreabilidade em cada etapa do torneio;

Projetar e desenvolver os módulos de geração automática de chaveamentos (eliminatórias simples, dupla eliminação, pontuação obtida, etc.) e obter classificações;

Desenvolver relatórios de desempenho por rodada, fornecendo dashboards interativos com indicadores de desempenho (KPIs) que apoiem a tomada de decisão dos organizadores e estatísticas detalhadas para os competidores;

Estruturar um módulo de consulta de histórico que permita o acesso a resultados estatísticos de partidas passadas;

Implementar um mecanismo de transparência do processo de chaveamento das equipes, permitindo aos participantes visualizar os critérios utilizados na formação das partidas, como seleção aleatória ou definição manual pelo organizador do torneio.


### 1.4 Justificativas

A principal motivação para o desenvolvimento deste projeto está na lacuna identificada nas ferramentas voltadas ao gerenciamento de torneios esportivos amadores. Embora existam plataformas que auxiliem nesse tipo de organização, como o “Placar.app”, muitas delas são direcionadas a modalidades específicas, como tênis e padel, o que limita sua abrangência.

Diante desse contexto, optou-se pelo desenvolvimento de uma solução mais ampla e escalável, capaz de atender diferentes modalidades e concentrar, em um único ambiente, todas as funcionalidades necessárias para a organização e participação em torneios. A proposta é oferecer uma ferramenta prática, acessível e que facilite a gestão tanto para organizadores quanto para competidores.

Além disso, o projeto proporciona a aplicação prática de conceitos fundamentais da Engenharia de Software, como levantamento e análise de requisitos, modelagem de processos e desenvolvimento incremental por meio de Sprints. Dessa forma, contribui não apenas para a resolução de um problema identificado, mas também para o aprimoramento técnico e acadêmico dos desenvolvedores envolvidos.


## 2. Participantes do processo

-Organizador do torneio:

Descrição: Geralmente homens e mulheres entre 20 e 50 anos, com nível de instrução superior e alta familiaridade com ferramentas digitais. Podem ser gestores de ligas profissionais, donos de arenas de e-sports ou líderes de comunidades acadêmicas/esportivas.

Papel no sistema: Possui controle total sobre a configuração do torneio, cria e define o formato da disputa, gerencia a aprovação das inscrições, gera o chaveamento das equipes, valida resultados, acompanha relatórios e indicadores, encerra o torneio e divulga o vencedor.

Necessidades: Centralização de dados para evitar uso de múltiplas planilhas e automação de tarefas repetitivas.

-Participante:

Descrição: Geralmente homens e mulheres entre 15 e 50 anos, com diferentes níveis de educação e familiaridade tecnológica diversas. Em maioria, acessa o sistema pelo smartphone para acompanhar informações do torneio.

Papel no sistema: Acessa o sistema para consultar chaveamento e/ou classificação geral, verifica datas e horários das partidas e acessa estatísticas individuais e/ou time.

Necessidades: Acesso rápido e simplificado às informações do torneio, visualização clara da classificação e do chaveamento da competição, e possibilidade de acompanhar a evolução do time ao longo da competição.

## 3. Modelagem do processo de negócio

### 3.1. Análise da situação atual

Atualmente, a organização de torneios esportivos e competições eletrônicas pode ser realizada com o auxílio de diferentes plataformas digitais especializadas na gestão de eventos competitivos. Essas ferramentas têm como objetivo automatizar tarefas administrativas e facilitar o acompanhamento das competições por organizadores e participantes. Entre as plataformas mais utilizadas estão sistemas de geração de chaveamentos e gerenciamento de campeonatos, como ferramentas de criação de brackets e aplicativos de gestão de torneios esportivos. Esses sistemas oferecem funcionalidades que vão desde o cadastro de participantes até o acompanhamento dos resultados em tempo real. 

De forma geral, os sistemas existentes seguem um fluxo semelhante de funcionamento, composto por etapas que refletem o ciclo de vida de um torneio: criação do evento, inscrição de participantes, geração do chaveamento, execução das partidas e divulgação dos resultados. 

Criação e configuração do torneio 

O primeiro passo nos sistemas atuais consiste na criação do torneio pelo organizador. Nessa etapa, o usuário responsável define informações básicas do evento, como nome da competição, modalidade esportiva, número máximo de participantes e formato de disputa. Algumas plataformas também permitem configurar regras específicas, definir se haverá disputa de terceiro lugar ou estabelecer critérios de classificação e pontuação. 

Processo de inscrição dos participantes 

Após a criação do torneio, os organizadores disponibilizam um mecanismo de inscrição para os participantes. Em alguns sistemas, os próprios competidores podem se registrar diretamente na plataforma por meio de um formulário online ou link compartilhado. Em outros casos, o organizador realiza manualmente o cadastro das equipes ou jogadores no sistema. 

Algumas plataformas também permitem a definição de limites de participantes, categorias ou divisões dentro do torneio, bem como a coleta de informações adicionais como nome da equipe, lista de jogadores e contato dos responsáveis. Em determinadas soluções mais avançadas, também é possível realizar o pagamento da taxa de inscrição diretamente pela plataforma. 

Geração do chaveamento 

Uma das principais funcionalidades dessas plataformas é a geração automática do chaveamento do torneio. Após o encerramento das inscrições, o sistema utiliza algoritmos para distribuir os participantes nas chaves da competição de acordo com o formato previamente definido. 

Execução das partidas e registro de resultados 

Durante a realização do torneio, os organizadores utilizam o sistema para registrar os resultados das partidas conforme elas acontecem. A cada resultado inserido, a plataforma atualiza automaticamente a progressão do torneio, gerando os próximos confrontos ou atualizando a classificação geral. 

Em plataformas mais completas, é possível acompanhar o andamento das partidas em tempo real, gerenciar cronogramas, controlar múltiplos locais de jogo e ajustar horários caso ocorram atrasos ou mudanças no calendário. 

Acompanhamento e divulgação das informações 

Outro recurso comum nas plataformas atuais é a disponibilização pública das informações do torneio. Por meio de links compartilháveis, participantes e espectadores podem acompanhar o andamento da competição, visualizar o chaveamento atualizado, consultar classificações e verificar resultados das partidas. 

Esse tipo de recurso permite maior transparência e facilita o acesso às informações, reduzindo a necessidade de comunicação manual por meio de mensagens ou planilhas compartilhadas. Em alguns sistemas, as atualizações são exibidas em tempo real, garantindo que todos os envolvidos tenham acesso às informações mais recentes sobre o torneio. 

Limitações das soluções atuais 

Apesar de oferecerem recursos importantes para a organização de campeonatos, muitas plataformas disponíveis no mercado apresentam algumas limitações. Algumas soluções são focadas em modalidades esportivas específicas, o que restringe sua utilização em diferentes tipos de competição. Outras plataformas possuem funcionalidades limitadas em suas versões gratuitas ou apresentam interfaces pouco intuitivas para usuários iniciantes. 

Além disso, em muitos casos, a organização do torneio ainda depende da utilização de ferramentas complementares, como aplicativos de mensagens para comunicação com os participantes ou planilhas externas para controle adicional de informações. Isso pode gerar fragmentação na gestão do evento e dificultar a centralização das informações em um único ambiente. 

### 3.2. Descrição geral da proposta de solução

O Cup Hub é uma plataforma web criada para ajudar na organização completa de torneios esportivos e competitivos, do começo ao fim, ou seja, desde a criação do evento até a divulgação dos resultados. A ideia é facilitar a vida tanto de quem organiza quanto de quem participa, trazendo tudo em um só lugar de forma simples e acessível.

### Escopo e funcionalidades centrais

Hoje, organizar um torneio costuma envolver um monte de ferramentas diferentes: formulários avulsos para inscrição, grupos de WhatsApp para comunicação e planilhas para controlar as chaves. O Cup Hub resolve isso ao reunir tudo em um único sistema. Por meio dele, o organizador consegue criar e configurar o torneio do jeito que quiser, cuidar das inscrições dos times, gerar os chaveamentos de forma automática (mata-mata simples, pontuação, entre outros), registrar os resultados das partidas e acompanhar o desempenho de todos os participantes por meio de painéis visuais com indicadores.

### Limites da solução

O Cup Hub não tem a intenção de substituir sistemas financeiros, plataformas de transmissão ao vivo ou ferramentas de conversa entre jogadores. O foco é nos processos de organização e informação do torneio. Nesta primeira versão, não haverá integração com pagamentos nem chat interno.

### Ligação com as estratégias do negócio

A estratégia central do Cup Hub é entrar no mercado de forma gratuita, assim reduzindo as barreiras para novos organizadores. Com isso, a plataforma consegue crescer em número de usuários e torneios cadastrados antes de explorar outras fontes de receita no futuro. Essa abordagem coloca o Cup Hub diretamente em competição com plataformas já existentes que focam em modalidades específicas e ainda pagas. Ao oferecer suporte a múltiplas modalidades esportivas e de eSports sem cobrar nada, o Cup Hub se torna uma alternativa mais atraente, especialmente para comunidades amadoras, escolares e universitárias que não têm orçamento para ferramentas pagas.

### Ligação com os objetivos do projeto

O objetivo principal do projeto é automatizar os processos de gestão de torneios e campeonatos, permitindo que organizadores criem eventos, gerenciem inscrições, gerem chaveamentos e acompanhem o desempenho dos participantes de forma centralizada. Para alcançar isso, o sistema é desenvolvido em Java Spring Boot com banco de dados, tecnologia que viabiliza a construção de uma aplicação robusta e escalável. Cada Sprint entrega uma parte funcional conectada a um objetivo específico: a modelagem dos fluxos em BPMN, a geração automática de chaveamentos, os relatórios e dashboards de desempenho por rodada e o módulo de histórico de partidas, garantindo um desenvolvimento organizado e com entregas claras.

### Oportunidades de Melhoria

Uma das maiores lacunas que existem hoje no mercado é a falta de uma ferramenta que funcione para vários tipos de esportes e que seja fácil de usar. Plataformas já existentes costumam focar em modalidades específicas, já o Cup Hub entra justamente nesse espaço, oferecendo suporte a diversas modalidades esportivas e de eSports em um único ambiente, o que alivia o trabalho de quem organiza e melhora muito a experiência de quem acompanha.

Para versões futuras, já analisamos possíveis melhorias:

- Envio de notificações automáticas por e-mail ou celular para lembrar os participantes de datas e horários das partidas;  
- Criação de um aplicativo mobile, já que a maioria dos participantes acessa o sistema pelo celular;  
- Suporte a múltiplos idiomas para alcançar comunidades além do Brasil;  
- API pública para que outras plataformas e desenvolvedores possam integrar dados dos torneios.

### 3.3. Modelagem dos processos

[PROCESSO 1 - Criação e configuração do torneio]

[PROCESSO 2 - Gerenciar Inscrições de times]

[PROCESSO 3 - Geração do chaveamento]

[PROCESSO 4 - Execução das partidas e registro de resultados]

[PROCESSO 5 - Divulgação de resultado e entrega de premiação]

[PROCESSO 6 - Acompanhamento e exibição de estatisticas e desempenho]

## 4. Projeto da solução

_O documento a seguir apresenta o detalhamento do projeto da solução. São apresentadas duas seções que descrevem, respectivamente: modelo relacional e tecnologias._

[Projeto da solução](solution-design.md "Detalhamento do projeto da solução: modelo relacional e tecnologias.")


## 5. Indicadores de desempenho

_O documento a seguir apresenta os indicadores de desempenho dos processos._

[Indicadores de desempenho dos processos](performance-indicators.md)


## 6. Interface do sistema

_A sessão a seguir apresenta a descrição do produto de software desenvolvido._ 

[Documentação da interface do sistema](interface.md)

## 7. Conclusão

O Cup Hub surgiu da necessidade de integrar em uma única plataforma as etapas de um torneio esportivo que hoje se encontram fragmentadas entre diversas ferramentas. Por meio de um processo de desenvolvimento incremental aplicado ao longo de oito Sprints, o sistema foi construindo funcionalidades que atendem desde a criação e configuração de torneios até o acompanhamento de desempenho dos participantes, resultando em uma solução dinâmica e acessível a diferentes perfis de usuários.

Do ponto de vista prático, o sistema facilita a realização de torneios ao eliminar a dependência de formulários avulsos planilhas e aplicativos de mensagens para cada etapa da competição Inscrições geração de chaveamentos registro de resultados e acompanhamento de desempenho passam a ocorrer em um único ambiente reduzindo erros operacionais e agilizando processos administrativos tanto para organizadores quanto para participantes

Em termos de visibilidade o Cup Hub disponibiliza indicadores de desempenho KPIs e um módulo de histórico que permitem aos organizadores acompanhar métricas como taxa de preenchimento de vagas e aprovação de inscrições enquanto participantes acessam classificações resultados e o desempenho do seu time ao longo da competição toda informação fica centralizada e acessível de forma transparente

Além disso a arquitetura do sistema é bem escalável permitindo a adição de novas funcionalidades como notificações automáticas aplicativo mobile suporte a múltiplos idiomas e integração via API pública sem necessidade de refatorações significativas

# REFERÊNCIAS

-https://www.terra.com.br/gameon/esports/esports-no-brasil-como-2025-redefiniu-o-cenario-competitivo-e-o-que-esperar-de-2026,5bf3bed204bcfb245adcf7cff098bb5ejh74oyho.html#google_vignette

# APÊNDICES


_Atualizar os links e adicionar novos links para que a estrutura do código esteja corretamente documentada._


## Apêndice A - Código fonte

[Código do front-end](../src/front) -- repositório do código do front-end

[Código do back-end](../src/back)  -- repositório do código do back-end


## Apêndice B - Apresentação final


[Slides da apresentação final](presentations/)


[Vídeo da apresentação final](video/)






