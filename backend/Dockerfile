# ──────────────────────────────────────────────────────────────────────────────
# Stage 1 – Build the JAR with Maven
# ──────────────────────────────────────────────────────────────────────────────
FROM maven:3.9.6-eclipse-temurin-17 AS builder

WORKDIR /app

# Copy dependency manifests first for layer-cache optimisation
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source and build (skip tests – they require a running MongoDB)
COPY src ./src
RUN mvn clean package -DskipTests -B

# ──────────────────────────────────────────────────────────────────────────────
# Stage 2 – Minimal runtime image
# ──────────────────────────────────────────────────────────────────────────────
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy the fat JAR produced by the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Render injects PORT at runtime; Spring reads it via ${PORT:8082}
EXPOSE 8082

# All secrets (MONGODB_URI, JWT_SECRET, MAIL_*, FRONTEND_URL) are injected
# as environment variables by Render – no .env file is needed in production.
ENTRYPOINT ["java", "-jar", "app.jar"]
