# ─────────────────────────────────────────────────────────────────────────────
# CupHub API — build multi-stage (Java 25 / Spring Boot 4)
# Contexto de build: src/back/api  (Root Directory no Railway)
# ─────────────────────────────────────────────────────────────────────────────

# ---- build ----
FROM eclipse-temurin:25-jdk AS build
WORKDIR /app

COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw
COPY src/ src/
RUN ./mvnw -B -DskipTests clean package

# ---- runtime ----
FROM eclipse-temurin:25-jre-alpine AS runtime
WORKDIR /app

# usuário não-root
RUN addgroup -S app && adduser -S app -G app
COPY --from=build /app/target/*.jar app.jar
USER app

# Railway injeta a porta via $PORT; o app lê server.port=${PORT:8080}
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java ${JAVA_OPTS:-} -jar app.jar"]
