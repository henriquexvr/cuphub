package com.cuphub.api.service;

import com.resend.Resend;
import com.resend.services.emails.model.CreateEmailOptions;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {

    private final Resend resend;
    private final String fromEmail;
    private final String frontendUrl;

    public EmailService(
            @Value("${resend.api-key:}") String apiKey,
            @Value("${resend.from-email:onboarding@resend.dev}") String fromEmail,
            @Value("${app.frontend-url:http://localhost:5173}") String frontendUrl) {
        this.resend = apiKey.isBlank() ? null : new Resend(apiKey);
        this.fromEmail = fromEmail;
        this.frontendUrl = frontendUrl;
    }

    private void send(String to, String subject, String html) {
        if (resend == null) {
            log.warn("Resend não configurado — email para {} ignorado.", to);
            return;
        }
        try {
            CreateEmailOptions request = CreateEmailOptions.builder()
                .from("CupHub <" + fromEmail + ">")
                .to(to)
                .subject(subject)
                .html(html)
                .build();
            resend.emails().send(request);
            log.info("Email enviado para {}", to);
        } catch (Exception e) {
            log.error("Erro ao enviar email para {}: {}", to, e.getMessage());
        }
    }

    public void sendTeamInvite(String toEmail, String teamName, String captainName, String token) {
        String acceptUrl = frontendUrl + "/convite?token=" + token;
        String html = """
            <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
              <h2>Você foi convidado para um time!</h2>
              <p><strong>%s</strong> convidou você para o time <strong>%s</strong> no CupHub.</p>
              <a href="%s" style="display:inline-block;background:#000;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">Ver convite</a>
              <p style="color:#888;font-size:12px;margin-top:24px">Expira em 7 dias.</p>
            </div>""".formatted(captainName, teamName, acceptUrl);
        send(toEmail, "Convite para o time " + teamName + " no CupHub", html);
    }

    public void sendTournamentApproved(String toEmail, String organizerName, String tournamentName) {
        String url = frontendUrl + "/torneios";
        String html = """
            <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
              <h2>Torneio aprovado!</h2>
              <p>Olá <strong>%s</strong>, seu torneio <strong>%s</strong> foi aprovado.</p>
              <a href="%s" style="display:inline-block;background:#000;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">Ver torneios</a>
            </div>""".formatted(organizerName, tournamentName, url);
        send(toEmail, "Torneio \"" + tournamentName + "\" aprovado!", html);
    }

    public void sendTournamentRejected(String toEmail, String organizerName, String tournamentName, String reason) {
        String html = """
            <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
              <h2>Torneio reprovado</h2>
              <p>Olá <strong>%s</strong>, seu torneio <strong>%s</strong> não foi aprovado.</p>
              %s
            </div>""".formatted(organizerName, tournamentName,
                reason != null && !reason.isBlank() ? "<p><strong>Motivo:</strong> " + reason + "</p>" : "");
        send(toEmail, "Torneio \"" + tournamentName + "\" reprovado", html);
    }

    public void sendRegistrationApproved(String toEmail, String captainName, String teamName, String tournamentName) {
        String html = """
            <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
              <h2>Inscrição aprovada!</h2>
              <p>Olá <strong>%s</strong>, o time <strong>%s</strong> foi aprovado em <strong>%s</strong>!</p>
            </div>""".formatted(captainName, teamName, tournamentName);
        send(toEmail, "Inscrição de " + teamName + " aprovada em " + tournamentName, html);
    }

    public void sendRegistrationRejected(String toEmail, String captainName, String teamName, String tournamentName, String reason) {
        String html = """
            <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
              <h2>Inscrição reprovada</h2>
              <p>Olá <strong>%s</strong>, a inscrição do time <strong>%s</strong> em <strong>%s</strong> não foi aprovada.</p>
              %s
            </div>""".formatted(captainName, teamName, tournamentName,
                reason != null && !reason.isBlank() ? "<p><strong>Motivo:</strong> " + reason + "</p>" : "");
        send(toEmail, "Inscrição de " + teamName + " em " + tournamentName + " reprovada", html);
    }

    public void sendNewRegistration(String toEmail, String organizerName, String teamName, String tournamentName) {
        String html = """
            <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
              <h2>Nova inscrição recebida</h2>
              <p>Olá <strong>%s</strong>, o time <strong>%s</strong> solicitou inscrição em <strong>%s</strong>.</p>
            </div>""".formatted(organizerName, teamName, tournamentName);
        send(toEmail, "Nova inscrição em " + tournamentName, html);
    }
}
