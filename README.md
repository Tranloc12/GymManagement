# 🏋️ Gym Management System  

This project provides a **Gym Management System** with features such as membership management, workout tracking, class scheduling, trainer assignment, and payment management.  
The system is built with **Spring Boot (backend)** and **ReactJS (frontend)**, and supports multiple roles: **Admin, Staff, Trainer, and Member**.  

---

## ✨ Features  
- 🔐 **User Authentication & Role-based Authorization** (Admin, Staff, Trainer, Member)  
- 🧾 **Membership Management** (register, update, cancel membership)  
- 📅 **Class & Schedule Management** (create, update, delete, view classes)  
- 🏋️ **Trainer Management** (assign trainers, track trainer schedules)  
- 📊 **Workout & Progress Tracking**  
- 💳 **Payment Management** (membership fees, class packages, PayPal integration)  
- 🔔 **Notifications** (via Firebase if enabled)  

---

## 🛠️ Technologies Used  

### Frontend  
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)  
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)  
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)  
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)  
![ShadCN UI](https://img.shields.io/badge/ShadCN_UI-black?style=for-the-badge)  

### Backend  
![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)  
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)  
![Spring Security](https://img.shields.io/badge/Spring_Security-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white)  
![REST API](https://img.shields.io/badge/REST_API-02569B?style=for-the-badge)  

### Database  
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)  

### Others  
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)  
![PayPal](https://img.shields.io/badge/PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white)  

---

## ⚙️ Configuration  

### Backend (Spring Boot)  
- **IDE**: NetBeans 15+ (hoặc IntelliJ / Eclipse nếu cần)  
- **Java version**: JDK 17+  
- **Build tool**: Maven  
- **Application server**: Embedded Tomcat  
- **Dependencies**: Spring Boot, Spring Security (JWT), Spring Data JPA, MySQL Connector  
- **Database**: MySQL 8.0+  


# Clone repo
git clone https://github.com/your-username/gym-management-system.git
cd gym-management-system

# Backend
cd backend
mvn spring-boot:run

# Frontend
cd frontend
npm install
npm start

## 📜 License
This project is licensed under the MIT License – see the LICENSE file for details.
