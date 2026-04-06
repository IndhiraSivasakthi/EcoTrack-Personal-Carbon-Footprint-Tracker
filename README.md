# 🌱 EcoTrack – Personal Carbon Footprint Tracker

## 🌐 Live Demo

* 🔗 **Frontend:** https://ecotrack-personal-carbon-footprint-jyha.onrender.com/
* 🔗 **Backend API:** https://ecotrack-personal-carbon-footprint-5nly.onrender.com/

---

## 📌 Overview

EcoTrack is a full-stack web application that helps users monitor and reduce their daily carbon footprint. Users can log activities such as transport, food consumption, and energy usage, and the system calculates CO₂ emissions and displays insights through an interactive dashboard.

---

## 🚀 Features

* 🔐 User Authentication (Login/Register with JWT)
* ➕ Add Activities (Transport, Food, Energy)
* 📊 Dashboard with CO₂ Statistics
* 📈 Charts (Weekly trends & category breakdown)
* 📋 Activity history tracking
* 🎯 Eco score & goal tracking
* 💡 Smart tips for reducing emissions

---

## 🛠️ Tech Stack

### 🔹 Frontend

* React.js
* Bootstrap / Material UI
* Axios
* Recharts / Chart.js

### 🔹 Backend

* Spring Boot (Java)
* REST APIs
* Spring Data JPA
* JWT Authentication

### 🔹 Database

* PostgreSQL (Render Cloud Database)

---

## 💡 Why These Technologies?

### 🔹 Java (Spring Boot)

* Strong backend framework for building scalable REST APIs
* Industry-standard for enterprise applications
* Provides built-in support for security, data handling, and dependency management

### 🔹 React.js

* Fast and dynamic UI development
* Component-based architecture for reusable code
* Efficient rendering using virtual DOM

### 🔹 PostgreSQL

* Reliable and powerful relational database
* Ensures data integrity and supports complex queries
* Suitable for production deployment

---

## 🐳 Docker Implementation

This project uses **Docker** to containerize the backend application.

### 🔹 Why Docker?

* Ensures the app runs consistently across environments
* Eliminates “works on my machine” issues
* Simplifies deployment on platforms like Render

---

### 🔹 Dockerfile Used

```dockerfile
# Step 1: Build JAR
FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Step 2: Run JAR
FROM eclipse-temurin:17-jdk

WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]
```

---

## ⚙️ Project Structure

```
EcoTrack-Personal-Carbon-Footprint-Tracker/
 ├── ecotrack-frontend/
 ├── ecotrack-backend/
```

---

## 🔐 Environment Variables

```
DB_URL=your_database_url
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

---

## 🌐 Deployment

* **Frontend:** Render Static Site
* **Backend:** Render Web Service (Dockerized)
* **Database:** PostgreSQL (Render)

---

## 🔄 Key Workflow

```
User → React Frontend → Spring Boot API → PostgreSQL Database
```

---

## 🎯 Future Enhancements

* Google OAuth Login
* AI-based carbon insights (Gemini API)
* Mobile application
* Notifications & reminders

---

## 👩‍💻 Author

**Indhira Sivasakthi J**

---

## ⭐ Conclusion

This project demonstrates full-stack development skills including frontend design, backend API development, secure authentication, database integration, and containerized deployment using Docker.

---
