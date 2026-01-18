# News Portal Application

A modern **News Portal** web application built with **NestJS** for the backend and **MongoDB** as the database.  
The app supports user authentication, role-based access, and fully integrated **Cloudinary image uploads** for news articles.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
---

## Features

- **User Authentication & Authorization**
  - JWT-based login
  - Protected routes for admin actions
- **News Management**
  - Create, Read, Update, Delete (CRUD) operations
  - Public routes to view published news
  - Admin routes to create/update news
- **Image Upload**
  - Automatic Cloudinary image upload on create/update
  - Old images automatically removed on update
  - Image URL stored in MongoDB
- **Slug-based News URLs**
  - Clean URLs based on news title
- **Validation**
  - Request body validation using `class-validator`
- **Modular, Clean Code**
  - Service handles DB logic
  - Controller handles request & image processing
  - Config management via `.env` and `@nestjs/config`

---

## Tech Stack

- **Backend:** NestJS (Node.js)
- **Database:** MongoDB
- **Authentication:** JWT
- **File Storage:** Cloudinary
- **Validation:** class-validator
- **Deployment Ready:** Environment configuration, modular structure

---

## Setup & Installation

### 1️⃣ Clone Repository

```bash
git clone <repository-url>
cd news_portal_server
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Environment Variables

```bash
PORT=5000
MONGODB_URL=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4️⃣ Run the Application (Development Mode)

```bash
npm run start:dev
```

Server runs on http://localhost:5000
API ready for testing with Postman or frontend
