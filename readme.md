# 📚 BookStack CI

## 🚀 Project Overview

**BookStack CI** is a full-stack monolithic bookstore application built with TypeScript, Node.js, and React. It aims to showcase robust DevOps practices alongside a production-ready architecture, integrating CI/CD pipelines, authentication, and cloud deployment. This app is designed not only as a functional bookstore platform but also as a portfolio project to highlight modern DevOps workflows and microservices concepts.

---

## ✨ Features

### 📚 **Bookstore Features**
- **User Authentication**: Secure registration, login, and password management (forgot/reset password)
- **CRUD Operations for Books**: Add, update, view, and delete books
- **Token-based Authentication**: JWT tokens for secure API access
- **User Notifications**: Email notifications for password resets and system alerts

### 🔐 **DevOps & CI/CD Integration**
- **CI/CD Pipelines**: Automated testing and deployment using GitHub Actions
- **Containerization**: Docker setup for both frontend and backend services
- **Kubernetes Deployment**: Utilizing K8s for orchestrating microservices
- **Monitoring & Autoscaling**: Integrated Prometheus and Grafana for monitoring pods, with Horizontal Pod Autoscaler (HPA) enabled
- **Cloud Deployments**:
  - **Frontend** hosted on **Netlify**
  - **Backend** deployed on **Render** or **Fly.io**
- **Real-time Pod Visualization**: Frontend feature to trigger and visualize pod scaling
- **Load Simulation**: Load generators for testing autoscaling

### 🧪 **Testing**
- **Unit Tests**: Comprehensive tests for auth, book services, and utilities
- **Integration Tests**: Ensuring seamless interaction between services
- **Test Automation**: Trigger tests automatically via CI/CD pipeline
- **Real-time Test Feedback**: Frontend interface shows test results upon deployment

### 📦 **Tech Stack**
- **Frontend**: React + TypeScript
- **Backend**: Node.js + Express + TypeScript
- **Database**: MongoDB
- **Cloud Services**: AWS (S3, EKS), Netlify, Render/Fly.io
- **DevOps Tools**: Docker, Kubernetes, Prometheus, Grafana
- **CI/CD**: GitHub Actions
- **Security**: JWT, Crypto module for password hashing and encryption

---

## 🏗️ Project Structure

```

/src
├── /config           # Database and environment configuration
│   └── db.ts         # MongoDB connection setup
├── /controllers      # Handles business logic for various features
│   ├── auth.controller.ts # Authentication logic (register, login, forgot password)
│   └── index.ts      # Controller exports (optional)
├── /models           # Mongoose schemas and models
│   ├── books.schema.ts # Schema for books collection
│   ├── index.ts      # Centralized model exports
│   └── user.schema.ts # Schema for user collection
├── /routes           # API routes definition
│   └── auth.routes.ts # Authentication-related routes (register, login, forgot password)
├── /service          # Service layer for business logic and database operations
│   ├── mongo.ts      # MongoDBService for reusable CRUD operations
│   └── nodemailer.ts # Email service for sending reset password emails
├── /types            # TypeScript interfaces and types
│   ├── books.ts      # Book-related types
│   ├── index.ts      # Centralized type exports
│   ├── mongo.ts      # Types for MongoDB operations
│   ├── response.ts   # API response status codes and interfaces
│   └── user.ts       # User-related types and interfaces
├── /utils            # Utility functions for common tasks
│   ├── crypto.ts     # Password hashing and encryption utilities
│   ├── reponse.ts    # ResponseUtils for standardized API responses
│   └── tools.ts      # JWT token creation, verification, and encryption helpers
├── /validations      # Request validation logic (using Joi or similar)
│   └── user.ts       # Validation rules for user registration and login
├── app.ts            # Main Express app setup (middleware, route registration)
├── tsconfig.json     # TypeScript configuration file
├── package.json      # Project dependencies and scripts
├── yarn.lock         # Yarn lock file for dependency versions
└── readme.md         # Project documentation

```

---

## 🚢 DevOps Workflow

### 🛠️ **CI/CD Pipeline**
1. **Push to GitHub**: Code is pushed to the `main` or `feature` branch.
2. **GitHub Actions**:
   - Run unit and integration tests
   - Build Docker images
3. **Containerization**: Docker images are tagged and pushed to Docker Hub
4. **Kubernetes Deployment**:
   - Apply K8s manifests (`Deployments`, `Services`, `ConfigMaps`, `HPA`)
5. **Monitoring**:
   - Prometheus scrapes pod metrics
   - Grafana visualizes performance and scaling

### 📡 **Scaling**
- **Horizontal Pod Autoscaler**: Adjusts pods based on CPU/memory usage
- **Manual Scaling**: Users can trigger scaling directly from the frontend

---

## 🏃‍♂️ Running the Project

### **1. Clone the repo**
```bash
git clone https://github.com/yourusername/bookstack-ci.git
cd bookstack-ci
```

### **2. Set up environment variables**
Create a `.env` file in the root directory:

```plaintext
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=something_secret
NODE_ENV=development
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_pass
```

### **3. Install dependencies**
```bash
yarn install
```

### **4. Run the app**
```bash
yarn dev
```

The server should be running at: `http://localhost:4000`

---

## 🔥 API Routes

### **Auth Routes**
- **POST** `/api/auth/register` — Register a new user
- **POST** `/api/auth/login` — Log in with email and password
- **POST** `/api/auth/forgot-password` — Request a password reset
- **POST** `/api/auth/reset-password` — Reset the password with token

### **Book Routes**
- **GET** `/api/books` — Get all books
- **POST** `/api/books` — Add a new book
- **PUT** `/api/books/:id` — Update a book
- **DELETE** `/api/books/:id` — Delete a book

---

## ✅ Testing

Run all tests:
```bash
yarn test
```

Trigger tests manually from the frontend by making a small change (like changing a color) and watching GitHub Actions run.

---

## 🧩 Future Improvements
- Implement advanced RBAC (Role-Based Access Control)
- Add more microservices (like recommendations, reviews)
- Integrate load balancing with Nginx
- Deploy Prometheus and Grafana dashboards for public access

---

## 🛡️ Security Considerations
- Passwords are hashed with Node.js Crypto module
- JWTs are used for secure API access
- Sensitive data is encrypted with AES-256

---

## 👥 Contributors
- **Chizoba Victory** — Frontend + Backend + DevOps + Testing

---

## 📜 License

This project is licensed under the MIT License.

---

