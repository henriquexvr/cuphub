package com.cuphub.api.config;

import com.cuphub.api.entity.*;
import com.cuphub.api.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
@Profile("seed")
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final TeamInviteRepository teamInviteRepository;
    private final TournamentRepository tournamentRepository;
    private final TournamentRegistrationRepository registrationRepository;
    private final MatchRepository matchRepository;
    private final PasswordEncoder passwordEncoder;

    private static final String PASSWORD = "12345678";

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Iniciando seed do banco de dados...");
        clearDatabase();

        // ── Usuários ────────────────────────────────────────────────────────────────
        User admin = user("Carlos Almeida", "admin@cuphub.com", "admin", avatar(68));
        User org1 = user("Roberto Ferreira", "roberto.ferreira@cuphub.com", "organizer", avatar(11));
        User org2 = user("Ana Lima", "ana.lima@cuphub.com", "organizer", avatar(45));
        User org3 = user("Paulo Mendes", "paulo.mendes@cuphub.com", "organizer", avatar(57));
        User org4 = user("Marina Souza", "marina.souza@cuphub.com", "organizer", avatar(31));
        User org5 = user("Eduardo Rocha", "eduardo.rocha@cuphub.com", "organizer", avatar(60));

        String[][] participantsData = {
            {"João Silva", "joao.silva"}, {"Maria Santos", "maria.santos"},
            {"Pedro Oliveira", "pedro.oliveira"}, {"Lucas Rodrigues", "lucas.rodrigues"},
            {"Ana Costa", "ana.costa"}, {"Gabriel Martins", "gabriel.martins"},
            {"Júlia Ferreira", "julia.ferreira"}, {"Rafael Souza", "rafael.souza"},
            {"Isabela Carvalho", "isabela.carvalho"}, {"Thiago Lima", "thiago.lima"},
            {"Beatriz Pereira", "beatriz.pereira"}, {"Matheus Alves", "matheus.alves"},
            {"Camila Gomes", "camila.gomes"}, {"Felipe Nascimento", "felipe.nascimento"},
            {"Larissa Ribeiro", "larissa.ribeiro"}, {"Henrique Campos", "henrique.campos"},
            {"Natália Araújo", "natalia.araujo"}, {"Vinícius Cardoso", "vinicius.cardoso"},
            {"Fernanda Melo", "fernanda.melo"}, {"Diego Barros", "diego.barros"},
            {"Bruno Teixeira", "bruno.teixeira"}, {"Amanda Vieira", "amanda.vieira"},
            {"Ricardo Moura", "ricardo.moura"}, {"Letícia Nunes", "leticia.nunes"},
            {"Gustavo Pinto", "gustavo.pinto"}, {"Carolina Dias", "carolina.dias"},
            {"André Ramos", "andre.ramos"}, {"Patrícia Lopes", "patricia.lopes"},
            {"Marcelo Freitas", "marcelo.freitas"}, {"Sofia Cunha", "sofia.cunha"},
            {"Rodrigo Pires", "rodrigo.pires"}, {"Mariana Castro", "mariana.castro"},
            {"Leonardo Dias", "leonardo.dias"}, {"Bianca Rocha", "bianca.rocha"},
            {"Caio Monteiro", "caio.monteiro"}, {"Yasmin Duarte", "yasmin.duarte"},
            {"Otávio Barbosa", "otavio.barbosa"}, {"Helena Fonseca", "helena.fonseca"},
            {"Daniel Correia", "daniel.correia"}, {"Vitória Andrade", "vitoria.andrade"},
        };
        List<User> p = new ArrayList<>();
        for (int i = 0; i < participantsData.length; i++) {
            p.add(user(participantsData[i][0], participantsData[i][1] + "@aluno.puc.br",
                    "participant", avatar((i % 70) + 1)));
        }

        // ── Times ────────────────────────────────────────────────────────────────────
        // {nome, descrição, keyword-banner, capitão, membro1, membro2}
        Object[][] teamsData = {
            {"Fênix FC", "Garra e capacidade de virada nos momentos decisivos.", "soccer", 0, 16, 17},
            {"Dragões Vermelhos", "Precisão e força dos alunos de Engenharia.", "football", 1, 18, 19},
            {"Leões da PUC", "O time mais tradicional do campus, referência em técnica.", "soccer,team", 2, 20, 21},
            {"Trovão Azul", "Velocidade e troca de passes rápidos.", "futsal", 3, 22, 23},
            {"Corvos FC", "Estratégia e esquemas táticos inusitados.", "soccer,field", 4, 24, 25},
            {"Falcões Negros", "A revelação da última temporada, jovens famintos por títulos.", "football,player", 5, 26, 27},
            {"Esmeraldas FC", "Disciplina e respeito às regras dentro de campo.", "soccer,ball", 6, 28, 29},
            {"Tempestade FC", "Pressão constante e viradas nos minutos finais.", "stadium", 7, 30, 31},
            {"Lobos do Cerrado", "Marcação agressiva e jogo coletivo intenso.", "soccer,goal", 8, 32, 33},
            {"Tubarões Brancos", "Ataque veloz e finalização certeira.", "futsal,court", 9, 34, 35},
            {"Águias Douradas", "Visão de jogo e domínio do meio-campo.", "football,field", 10, 36, 37},
            {"Furacão Verde", "Intensidade do primeiro ao último minuto.", "soccer,grass", 11, 38, 39},
            {"Cobras Negras", "Defesa sólida e contra-ataques letais.", "futsal,indoor", 12, 16, 18},
            {"Titãs do Campus", "Força física e bolas paradas ensaiadas.", "football,stadium", 13, 20, 22},
            {"Meteoros FC", "Transições rápidas e pressão alta.", "soccer,match", 14, 24, 26},
            {"Panteras FC", "Técnica refinada e posse de bola.", "football,grass", 15, 28, 30},
        };
        List<Team> teams = new ArrayList<>();
        for (int i = 0; i < teamsData.length; i++) {
            Object[] td = teamsData[i];
            teams.add(team((String) td[0], (String) td[1], banner((String) td[2], i + 1),
                    p.get((int) td[3]), List.of(p.get((int) td[4]), p.get((int) td[5]))));
        }

        // ── Convites de time (status variados → alimenta KPI de aceitação) ───────────
        // accepted (maioria), pending, rejected, expired
        String[][] inviteSpec = {
            {"0", "accepted"}, {"0", "accepted"}, {"0", "pending"},
            {"1", "accepted"}, {"1", "accepted"}, {"1", "rejected"},
            {"2", "accepted"}, {"2", "accepted"}, {"2", "accepted"},
            {"3", "accepted"}, {"3", "pending"},
            {"4", "accepted"}, {"4", "accepted"}, {"4", "expired"},
            {"5", "accepted"}, {"5", "accepted"},
            {"6", "accepted"}, {"6", "rejected"},
            {"7", "accepted"}, {"7", "accepted"},
            {"8", "accepted"}, {"8", "pending"},
            {"9", "accepted"}, {"9", "accepted"},
            {"10", "accepted"}, {"11", "accepted"}, {"11", "expired"},
            {"12", "accepted"}, {"13", "accepted"}, {"14", "pending"}, {"15", "accepted"},
        };
        int inviteN = 0;
        for (String[] spec : inviteSpec) {
            Team t = teams.get(Integer.parseInt(spec[0]));
            String status = spec[1];
            String email = "convidado" + (++inviteN) + "@aluno.puc.br";
            LocalDateTime expires = "expired".equals(status)
                    ? LocalDateTime.now().minusDays(2)
                    : LocalDateTime.now().plusDays(7);
            invite(t, email, status, expires);
        }

        // ── Torneios ─────────────────────────────────────────────────────────────────

        // 1. Rascunho
        tournament("Copa Interna PUC 2026",
                "Competição interna anual reunindo os times dos diferentes cursos da PUC Minas, fortalecendo a integração no início do ano letivo.",
                banner("trophy", 101),
                LocalDateTime.of(2026, 3, 10, 9, 0), LocalDateTime.of(2026, 3, 28, 18, 0),
                8, 3, 1, 0, "Torneio em planejamento. Confirmar quadras com a coordenação.",
                null, "draft", org1);

        // 2 e 3. Aguardando aprovação
        tournament("Liga Universitária Mineira 2026",
                "Segunda edição da liga que reúne times de diversas universidades de Belo Horizonte em pontos corridos.",
                banner("stadium,crowd", 102),
                LocalDateTime.of(2026, 4, 5, 10, 0), LocalDateTime.of(2026, 6, 20, 18, 0),
                12, 3, 1, 0, "Verificar disponibilidade das quadras do complexo da UFMG.",
                null, "pending_approval", org2);

        tournament("Taça Cidade BH 2026",
                "Torneio aberto às equipes amadoras da capital, em formato mata-mata de fim de semana.",
                banner("football,night", 103),
                LocalDateTime.of(2026, 7, 11, 9, 0), LocalDateTime.of(2026, 7, 26, 18, 0),
                16, 3, 1, 0, "Aguardando parecer da coordenação sobre patrocínio.",
                null, "pending_approval", org4);

        // 4. Aprovado (com algumas inscrições aprovadas para preencher o indicador)
        Tournament aprovado = tournament("Copa dos Campeões BH 2026",
                "Mata-mata exclusivo para os campeões das últimas edições da liga universitária. Disputa de alto nível entre as melhores equipes.",
                banner("soccer,trophy", 104),
                LocalDateTime.of(2026, 5, 3, 9, 0), LocalDateTime.of(2026, 5, 17, 18, 0),
                4, 3, 1, 0, "Aprovado. Aguardando abertura das inscrições para times convidados.",
                null, "approved", org3);
        approveAll(aprovado, teams.subList(0, 3));

        // 5 e 6. Inscrições abertas (mistura approved / pending / rejected)
        Tournament inscricoes = tournament("Copa de Verão 2026",
                "Torneio relâmpago de fim de semestre no formato mata-mata. Inscrições abertas para todos os times cadastrados.",
                banner("beach,soccer", 105),
                LocalDateTime.of(2026, 12, 5, 9, 0), LocalDateTime.of(2026, 12, 19, 18, 0),
                8, 3, 1, 0, "Comunicar participantes sobre horários por e-mail até 01/12.",
                null, "registration_open", org1);
        for (Team t : teams.subList(0, 6)) registration(inscricoes, t, "approved", "Inscrição confirmada.", null);
        registration(inscricoes, teams.get(6), "pending", "Equipe reforçada para esta edição.", null);
        registration(inscricoes, teams.get(7), "pending", "Grupo unido e bem preparado.", null);
        registration(inscricoes, teams.get(8), "rejected", "Fora do prazo de inscrição.", "Inscrição enviada após o encerramento.");

        Tournament relampago = tournament("Torneio Relâmpago 2026",
                "Disputa rápida em dois dias, com jogos de tempo reduzido e muita emoção. Ideal para encerrar o semestre.",
                banner("futsal,arena", 106),
                LocalDateTime.of(2026, 11, 14, 9, 0), LocalDateTime.of(2026, 11, 16, 18, 0),
                8, 3, 1, 0, "Definir tabela de jogos após o fim das inscrições.",
                null, "registration_open", org5);
        for (Team t : teams.subList(8, 12)) registration(relampago, t, "approved", "Inscrição confirmada.", null);
        registration(relampago, teams.get(12), "pending", "Aguardando confirmação do elenco.", null);
        registration(relampago, teams.get(13), "pending", "Interessados em participar.", null);
        registration(relampago, teams.get(14), "pending", "Garantindo nossa vaga.", null);
        registration(relampago, teams.get(15), "rejected", "Limite de vagas atingido.", "Torneio já com lista de espera.");

        // 7. Em andamento — bracket de 8 times (quartas + semis concluídas, final agendada)
        Tournament interturmas = tournament("Campeonato Interturmas 2025.2",
                "O tradicional campeonato entre turmas do segundo semestre. Semifinais decididas; a final promete emoção até o último segundo.",
                banner("soccer,team,celebration", 107),
                LocalDateTime.of(2025, 9, 8, 9, 0), LocalDateTime.of(2025, 11, 30, 18, 0),
                8, 3, 1, 0, "Final marcada para 30/11 no ginásio principal.",
                null, "in_progress", org2);
        List<Team> g7 = teams.subList(0, 8);
        approveAll(interturmas, g7);
        bracket(interturmas, g7, 2, 7L);

        // 8. Em andamento — bracket GRANDE de 16 times (1ª fase + oitavas concluídas)
        Tournament ligaAberta = tournament("Liga Aberta BH 2026",
                "A maior competição amadora da cidade, com 16 equipes em chave única. As quartas de final já estão definidas.",
                banner("stadium,fans", 108),
                LocalDateTime.of(2026, 2, 1, 9, 0), LocalDateTime.of(2026, 4, 30, 18, 0),
                16, 3, 1, 0, "Quartas de final marcadas para o próximo fim de semana.",
                null, "in_progress", org4);
        List<Team> g8 = new ArrayList<>(teams); // 16 times
        approveAll(ligaAberta, g8);
        bracket(ligaAberta, g8, 2, 23L);

        // 9. Em andamento — bracket pequeno de 4 times (semis concluídas)
        Tournament express = tournament("Copa Express 2026",
                "Mini-torneio de quatro equipes convidadas, com semifinais já realizadas. Final em breve.",
                banner("soccer,goal,net", 109),
                LocalDateTime.of(2026, 1, 12, 9, 0), LocalDateTime.of(2026, 1, 26, 18, 0),
                4, 3, 1, 0, "Final entre os vencedores das semifinais a ser agendada.",
                null, "in_progress", org5);
        List<Team> g9 = teams.subList(8, 12);
        approveAll(express, g9);
        bracket(express, g9, 1, 13L);

        // 10. Finalizado — bracket completo de 8 times
        Tournament copaPuc = tournament("Copa PUC 2025",
                "Edição histórica com grandes partidas e reviravoltas. Oito times disputaram o título mais cobiçado do campus.",
                banner("trophy,winner", 110),
                LocalDateTime.of(2025, 4, 7, 9, 0), LocalDateTime.of(2025, 6, 28, 18, 0),
                8, 3, 1, 0, "Campeão definido na grande final. Confira o chaveamento completo.",
                null, "finished", org3);
        List<Team> g10 = teams.subList(0, 8);
        approveAll(copaPuc, g10);
        bracket(copaPuc, g10, 3, 5L);

        // 11. Finalizado — bracket completo de 16 times
        Tournament superliga = tournament("Superliga Universitária 2025",
                "A temporada que reuniu 16 equipes em uma jornada de mata-mata até a grande decisão. Recorde de público nas finais.",
                banner("stadium,championship", 111),
                LocalDateTime.of(2025, 8, 2, 9, 0), LocalDateTime.of(2025, 11, 15, 18, 0),
                16, 3, 1, 0, "Temporada encerrada. Chaveamento completo disponível.",
                null, "finished", org1);
        List<Team> g11 = new ArrayList<>(teams);
        approveAll(superliga, g11);
        bracket(superliga, g11, 4, 41L);

        log.info("Seed concluído! {} usuários, {} times, {} torneios, {} partidas, {} convites.",
                userRepository.count(), teamRepository.count(), tournamentRepository.count(),
                matchRepository.count(), teamInviteRepository.count());
        log.info("Logins: admin@cuphub.com · roberto.ferreira@cuphub.com · ana.lima@cuphub.com · marina.souza@cuphub.com");
        log.info("Senha de todos os usuários: {}", PASSWORD);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────────

    private void clearDatabase() {
        // deleteAllInBatch() emite DELETE imediato (na ordem das FKs), evitando que
        // o Hibernate reordene os INSERTs antes dos DELETEs dentro da transação.
        matchRepository.deleteAllInBatch();
        registrationRepository.deleteAllInBatch();
        teamInviteRepository.deleteAllInBatch();
        teamMemberRepository.deleteAllInBatch();
        teamRepository.deleteAllInBatch();
        tournamentRepository.deleteAllInBatch();
        userRepository.deleteAllInBatch();
        log.info("Banco limpo. Inserindo dados...");
    }

    private String avatar(int n) {
        return "https://i.pravatar.cc/150?img=" + n;
    }

    private String banner(String keywords, int lock) {
        return "https://loremflickr.com/1200/400/" + keywords + "?lock=" + lock;
    }

    private User user(String name, String email, String role, String image) {
        User u = new User();
        u.setName(name);
        u.setEmail(email);
        u.setPassword(passwordEncoder.encode(PASSWORD));
        u.setRole(role);
        u.setImage(image);
        return userRepository.save(u);
    }

    private Team team(String name, String description, String bannerUrl, User captain, List<User> members) {
        Team t = Team.builder()
                .name(name)
                .description(description)
                .bannerUrl(bannerUrl)
                .captain(captain)
                .build();
        teamRepository.save(t);

        teamMemberRepository.save(TeamMember.builder().team(t).user(captain).role("captain").build());
        for (User m : members) {
            teamMemberRepository.save(TeamMember.builder().team(t).user(m).role("member").build());
        }
        return t;
    }

    private void invite(Team team, String email, String status, LocalDateTime expiresAt) {
        TeamInvite i = TeamInvite.builder()
                .team(team)
                .invitedEmail(email)
                .status(status)
                .expiresAt(expiresAt)
                .build();
        teamInviteRepository.save(i);
    }

    private Tournament tournament(String name, String description, String bannerUrl,
                                   LocalDateTime startDate, LocalDateTime endDate,
                                   int maxTeams, int win, int draw, int loss,
                                   String notes, String rejectionReason,
                                   String status, User organizer) {
        Tournament t = Tournament.builder()
                .name(name)
                .description(description)
                .bannerUrl(bannerUrl)
                .startDate(startDate)
                .endDate(endDate)
                .maxTeams(maxTeams)
                .pointsWin(win)
                .pointsDraw(draw)
                .pointsLoss(loss)
                .notes(notes)
                .rejectionReason(rejectionReason)
                .status(status)
                .organizer(organizer)
                .build();
        return tournamentRepository.save(t);
    }

    private void approveAll(Tournament tournament, List<Team> teams) {
        for (Team t : teams) {
            registration(tournament, t, "approved", "Inscrição confirmada.", null);
        }
    }

    private void registration(Tournament tournament, Team team, String status, String notes, String rejectionReason) {
        TournamentRegistration r = TournamentRegistration.builder()
                .tournament(tournament)
                .team(team)
                .status(status)
                .notes(notes)
                .rejectionReason(rejectionReason)
                .build();
        registrationRepository.save(r);
    }

    /**
     * Gera um chaveamento mata-mata (single elimination) para uma lista de times
     * cujo tamanho é potência de 2. As {@code finishedRounds} primeiras rodadas
     * recebem placares determinísticos e propagam o vencedor; as rodadas seguintes
     * ficam agendadas (com os times conhecidos quando já definidos pela rodada anterior).
     */
    private void bracket(Tournament t, List<Team> teamsIn, int finishedRounds, long seed) {
        int rounds = Integer.numberOfTrailingZeros(teamsIn.size()); // log2 (potência de 2)
        List<Team> current = new ArrayList<>(teamsIn);
        for (int r = 1; r <= rounds; r++) {
            int games = current.size() / 2;
            List<Team> next = new ArrayList<>();
            for (int pos = 1; pos <= games; pos++) {
                Team home = current.get((pos - 1) * 2);
                Team away = current.get((pos - 1) * 2 + 1);
                LocalDateTime when = t.getStartDate().plusDays(r * 7L + pos);
                if (r <= finishedRounds && home != null && away != null) {
                    int hs = (int) Math.floorMod(seed * 31 + r * 13L + pos * 7L, 4);
                    int as = (int) Math.floorMod(seed * 17 + r * 5L + pos * 11L, 4);
                    if (hs == as) hs++; // sem empate em mata-mata
                    Team winner = hs > as ? home : away;
                    match(t, r, pos, home, away, hs, as, winner, "finished", when,
                            home.getName() + " " + hs + " x " + as + " " + away.getName());
                    next.add(winner);
                } else {
                    match(t, r, pos, home, away, null, null, null, "scheduled", when,
                            "Partida agendada.");
                    next.add(null);
                }
            }
            current = next;
        }
    }

    private void match(Tournament tournament, int round, int position,
                       Team home, Team away,
                       Integer homeScore, Integer awayScore, Team winner,
                       String status, LocalDateTime scheduledAt, String notes) {
        Match m = Match.builder()
                .tournament(tournament)
                .round(round)
                .position(position)
                .homeTeam(home)
                .awayTeam(away)
                .homeScore(homeScore)
                .awayScore(awayScore)
                .winner(winner)
                .status(status)
                .scheduledAt(scheduledAt)
                .notes(notes)
                .build();
        matchRepository.save(m);
    }
}
