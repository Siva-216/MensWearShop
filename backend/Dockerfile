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

# Render injects PORT dynamically – Spring Boot reads it via ${PORT:8082}
# DO NOT hardcode EXPOSE to 8082 as Render uses a different dynamic port (e.g., 10000)
EXPOSE ${PORT:-8082}

# All secrets (MONGODB_URI, JWT_SECRET, MAIL_*, FRONTEND_URL) must be set
# as Environment Variables in the Render dashboard (not in .env which is gitignored).
ENTRYPOINT ["java", "-jar", "app.jar"]

