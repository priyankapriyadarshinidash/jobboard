# Job Board & Applicant Tracking System (ATS) — Backend

A robust Java & Spring Boot RESTful API for a Job Board and Applicant Tracking System (ATS). This project demonstrates key backend engineering patterns including **multipart file storage**, **asynchronous email notifications**, **Spring Security role-based authorization**, and **multi-criteria search queries**.

---

## 🎯 Key Backend Features

* **📁 Resume File Handling:** Handles file uploads (`.pdf`, `.docx`) using Spring `MultipartFile`, storing files securely with unique file naming and validation.
* **✉️ Email Notifications (Spring Mail):** Sends automated HTML email notifications to candidates upon job application submission and status updates (e.g., Shortlisted, Rejected).
* **🔐 Role-Based Access Control (RBAC):** Configured with **Spring Security** & **JWT** supporting two primary user roles:
  * `ROLE_CANDIDATE`: Search jobs, apply with uploaded resumes, track application status.
  * `ROLE_RECRUITER`: Post new job openings, view applicants, download resumes, update application stages.
* **🔍 Skill & Location Search Engine:** Optimized JPA database queries (`Specification` / custom queries) allowing candidates to filter jobs dynamically by skills, location, and job type.

---

## 🛠 Tech Stack

* **Language:** Java 17+
* **Framework:** Spring Boot (Spring Web, Spring Data JPA, Spring Security, Spring Mail)
* **Database:** PostgreSQL / MySQL (H2 for local testing)
* **Authentication:** JWT (JSON Web Tokens)
* **Build Tool:** Maven / Gradle
* **File Handling:** Multipart Storage (Local System / Amazon S3 integration ready)

---

## 🚀 Getting Started

### Prerequisites

* **JDK 17** or higher
* **Maven** 3.8+
* **PostgreSQL / MySQL** instance running locally or via Docker
* **SMTP Server details** (e.g., Gmail App Password or Mailtrap for email testing)

---

### Configuration

1. **Clone the Repository**
   ```bash
   git clone [https://github.com/arpitanibedita/jobboard.git](https://github.com/arpitanibedita/jobboard.git)
   cd job-board-ats
   src/main/java/com/jobboard/
├── config/          # Security, Mail, and File Upload configs
├── controller/      # REST API Controllers
├── dto/             # Request & Response Data Transfer Objects
├── model/           # JPA Entities (User, Job, Application, Role)
├── repository/      # Spring Data JPA Repositories
├── service/         # Business Logic (FileStorageService, EmailService, JobService)
└── security/        # JWT Filters, UserDetailsService
