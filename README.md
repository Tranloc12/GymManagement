# Gym Management System  

This project provides a **Gym Management System** with features such as membership management, class booking, trainer assignment, and attendance tracking.  
The system is built with **Spring Boot (backend)** and **ReactJS (frontend)**, and supports multiple roles: **Admin, Staff, Trainer, and Member**.  

---

## ✨ Features  
- **User Authentication & Role-based Authorization** (Admin, Staff, Trainer, Member)  
- **Membership Management** (create, update, renew, delete memberships)  
- **Class Scheduling & Booking** with history tracking  
- **Trainer Management** (assign trainers to classes, manage profiles)  
- **Attendance Tracking** (scan QR code or manual check-in)  
- **Payment Management** (membership fees, class packages – PayPal integration)  
- **Notifications** (via Firebase if enabled)  

---

##  Technologies Used  

### Fronten  
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)  
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)  
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)  
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)  
![ShadCN UI](https://img.shields.io/badge/Shadcn_UI-000000?style=for-the-badge&logo=shadcn&logoColor=white)  

### Backend  
![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)  
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)  
![Spring Security](https://img.shields.io/badge/Spring_Security-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white)  
![REST API](https://img.shields.io/badge/REST-02569B?style=for-the-badge&logo=rest&logoColor=white)  

### Database  
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)  

### Others  
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)  
![PayPal](https://img.shields.io/badge/PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white)  

---

## ⚙️ Configuration  

### **Backend (Spring Boot)**  
- IDE: **NetBeans 15+** (hoặc IntelliJ / Eclipse nếu cần)  
- Java version: **JDK 17+**  
- Build tool: **Maven**  
- Application server: Embedded **Tomcat**  
- Dependencies: Spring Boot, Spring Security (JWT), Spring Data JPA, MySQL Connector  
- Database: **MySQL 8.0+**  
  - Create a database named: `gym_management`  
  - Update your `application.properties` (or `application.yml`):  
    ```properties
    spring.datasource.url=jdbc:mysql://localhost:3306/gym_management?useSSL=false&serverTimezone=UTC
    spring.datasource.username=root
    spring.datasource.password=your_password
    spring.jpa.hibernate.ddl-auto=update
    spring.jpa.show-sql=true
    spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
    jwt.secret=your_jwt_secret
    ```

### **Frontend (ReactJS)**  
- IDE: **Visual Studio Code**  
- Node.js: **v18+**  
- Package manager: **npm** hoặc **yarn**  
- Dependencies: React, React Router, Axios, TailwindCSS, ShadCN UI  
- Run the project:  
  ```bash
  cd frontend
  yarn install
  yarn start

## Installation
- Clone the repository:
  ```bash
  git clone https://github.com/your-username/gym-management-app.git   
  cd gym-management-app

## License
This project is licensed under the MIT License – see the LICENSE
 file for details.
