# Dockerfile
# Utilise OpenJDK 17 slim officiel
FROM eclipse-temurin:17-jdk-alpine

# Dossier de travail
WORKDIR /app

# Copier le projet
COPY . .

# Construire le projet (Gradle / Maven)
# Exemple Gradle :
RUN ./gradlew build --no-daemon

# Exposer un port si ton appli a un serveur
EXPOSE 8080

# Commande pour lancer ton application
CMD ["java", "-jar", "build/libs/systeme-reparti-app.jar"]