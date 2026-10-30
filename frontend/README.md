# Student Portal Management System

A full-stack Student Portal Management System developed using React.js, Java Spring Boot, Spring Data JPA, Hibernate, and MySQL. The application provides an administrative interface to manage student records efficiently.

## Project Overview

The Student Portal Management System is designed to simplify student record management through a centralized web application. Administrators can log in, access the dashboard, view student information, add new student records, update existing details, and delete student records.

The application follows a full-stack architecture, with React.js handling the frontend, Spring Boot managing backend operations, and MySQL providing database storage.

## Technologies Used

### Frontend
- React.js
- JavaScript
- HTML5
- CSS3
- Bootstrap
- Axios
- React Router

### Backend
- Java 25
- Spring Boot
- Spring Web
- Spring Data JPA
- Hibernate
- Apache Maven

### Database
- MySQL

### Development Tools
- Visual Studio Code
- Eclipse IDE
- Postman
- MySQL Workbench
- Git
- GitHub

## Features

- Admin Login
- Admin Registration
- Dashboard displaying student information
- View all student records
- Add new student records
- Update existing student details
- Delete student records
- Search and manage student information
- REST API integration
- MySQL database connectivity
- Frontend and backend integration

## Project Structure

```text
student-portal-admin/
│
├── frontend/
│   ├── public/
│   │
│   ├── src/
│   │   ├── Components/
│   │   │   ├── CreateOrUpdateStudent.js
│   │   │   ├── Dashboard.js
│   │   │   ├── FooterComponent.js
│   │   │   ├── HeaderComponent.js
│   │   │   ├── ListStudent.js
│   │   │   ├── Login.js
│   │   │   └── ViewStudent.js
│   │   │
│   │   ├── Services/
│   │   │   ├── AuthService.js
│   │   │   └── StudentService.js
│   │   │
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── App.test.js
│   │   ├── index.css
│   │   ├── index.js
│   │   ├── logo.svg
│   │   ├── reportWebVitals.js
│   │   └── setupTests.js
│   │
│   ├── .gitignore
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   └── resources/
│   │   │
│   │   └── test/
│   │
│   ├── .mvn/
│   ├── mvnw
│   ├── mvnw.cmd
│   └── pom.xml
│
└── README.md
```

## Prerequisites

Install the following software before running the application:

- Java Development Kit (JDK 25)
- Node.js and npm
- MySQL Server
- Visual Studio Code or Eclipse IDE
- Git

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/<repository-name>.git
```

Navigate to the project directory:

```bash
cd student-portal-admin
```

### 2. Database Configuration

The application uses MySQL for persistent data storage.

Create a database named `student`:

```sql
CREATE DATABASE student;
```

Open the backend configuration file:

```text
backend/src/main/resources/application.properties
```

Configure the database connection:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/student
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

server.port=8080
```

Update the database connection properties with your MySQL configuration.

### 3. Run the Spring Boot Backend

Open a terminal and navigate to the backend directory:

```bash
cd backend
```

Run the application using the Maven Wrapper.

**Windows:**

```bash
.\mvnw.cmd spring-boot:run
```

**Mac/Linux:**

```bash
./mvnw spring-boot:run
```

The backend server will start at:

```text
http://localhost:8080
```

### 4. Run the React Frontend

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install the project dependencies:

```bash
npm install
```

Start the React application:

```bash
npm start
```

The frontend application will run at:

```text
http://localhost:3000
```

## REST API Endpoints

The backend provides the following REST API endpoints:

| HTTP Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Admin login |
| POST | `/api/auth/register` | Admin registration |
| GET | `/api/students` | Retrieve all students |
| POST | `/api/students` | Add a new student |
| GET | `/api/students/{id}` | Retrieve a student by ID |
| PUT | `/api/students/{id}` | Update student details |
| DELETE | `/api/students/{id}` | Delete a student |

## Student Information

The application manages the following student details:

- First Name
- Last Name
- Email
- Course
- Grade
- Attendance

## Application Workflow

1. The administrator logs into the application.
2. The dashboard displays student information.
3. The administrator can view all student records.
4. New student records can be added through the application.
5. Existing student details can be updated.
6. Student records can be deleted.
7. React communicates with the Spring Boot backend through REST APIs.
8. Spring Data JPA and Hibernate handle database operations in MySQL.

## Build and Testing

### Backend Build

Navigate to the backend directory:

```bash
cd backend
```

Build the Spring Boot Maven project:

```bash
.\mvnw.cmd clean install
```

### Backend Testing

```bash
.\mvnw.cmd test
```

### Frontend Build

Navigate to the frontend directory:

```bash
cd frontend
```

Generate the production build:

```bash
npm run build
```

## Future Enhancements

- AI-powered chatbot for student assistance
- Student login and authentication
- Role-based access control
- Attendance management
- Academic performance reports
- Student profile management

## Author

**Sakhana S S**

- GitHub: [code-bysakhana](https://github.com/code-bysakhana)
