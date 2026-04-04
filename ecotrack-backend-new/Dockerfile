FROM eclipse-temurin:17-jdk

WORKDIR /app

# Copy only needed files first (better caching)
COPY . .

# Give permission
RUN chmod +x mvnw

# Build the project
RUN ./mvnw clean package -DskipTests

# Expose port
EXPOSE 8080

# Run the app
CMD ["java", "-jar", "target/*.jar"]