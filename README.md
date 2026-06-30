# 💬 Convo-x - Real-Time Chat Application

> **A Modern Full Stack Real-Time Chat Application built using the MERN
> Stack & Socket.IO**

------------------------------------------------------------------------

# 📑 Table of Contents

-   Overview
-   Features
-   Tech Stack
-   Highlights
-   System Architecture
-   Project Workflow
-   Folder Structure
-   Database Schema
-   REST API
-   Demo
-   Installation
-   Environment Variables
-   Deployment
-   Future Improvements
-   Roadmap
-   License
-   Acknowledgements
-   Author

------------------------------------------------------------------------

# 📖 Overview

Chatly is a Full Stack Real-Time Chat Application developed using the
MERN Stack with Socket.IO. It provides secure JWT authentication,
real-time messaging, MongoDB persistence, Cloudinary image uploads, and
a responsive React frontend.
totally different for desktop and mobile users

## 🎯 Project Goals

-   Learn Full Stack Development
-   Implement JWT Authentication
-   Build Real-Time Communication
-   Integrate Cloudinary
-   Practice REST APIs
-   Manage Global State with Redux Toolkit

-----------------------------------------------------------------------------------------------------------------------

# ✨ Features

## 🔐 Authentication

-   User Registration
-   Secure Login & Logout
-   JWT Authentication
-   Password Hashing using bcrypt
-   Protected Routes
-   Cookie-Based Authentication

## 💬 Messaging

-   One-to-One Real-Time Chat
-   Instant Message Delivery
-   Conversation History
-   Online User Detection
-   Live Socket Connection

## 👤 User Profile

-   Update Profile Picture
-   Cloudinary Image Upload
-   View Registered Users

## 📱 Responsive UI

-   Modern Chat Interface
-   Mobile Friendly
-   Desktop Optimized

------------------------------------------------------------------------

# 🛠 Tech Stack

## Frontend

-   React
-   Vite
-   Redux Toolkit
-   React Router
-   Axios
-   Socket.IO Client
-   Tailwind CSS
-   React Icons
-   React Hot Toast
-   Emoji Picker

## Backend

-   Node.js
-   Express.js
-   Socket.IO
-   JWT
-   bcrypt
-   Cookie Parser
-   Multer
    

## Database

-   MongoDB Atlas
-   Mongoose

## Cloud

-   Cloudinary

------------------------------------------------------------------------

# ⭐ Highlights

-   ⚡ Real-Time Communication
-   🔒 JWT Authentication
-   ☁ Cloudinary Integration
-   📦 REST API
-   ⚛ Component-Based Architecture
-   📱 Responsive Design

------------------------------------------------------------------------

# 🏗️ System Architecture

``` mermaid
flowchart LR
A[User] --> B[React Frontend]
B -->|REST API| C[Express Backend]
B -->|Socket.IO| D[Socket Server]
C --> E[(MongoDB)]
C --> F[(Cloudinary)]
D --> E
```

# 🔄 Authentication Flow

``` mermaid
sequenceDiagram
User->>Frontend: Login
Frontend->>Backend: POST /login
Backend->>MongoDB: Verify User
MongoDB-->>Backend: User
Backend-->>Frontend: JWT Cookie
Frontend-->>User: Dashboard
```

# 💬 Messaging Flow

``` mermaid
sequenceDiagram
Sender->>Socket Server: Send Message
Socket Server->>MongoDB: Save Message
Socket Server->>Receiver: Deliver Message
```

------------------------------------------------------------------------

# 📁 Project Structure

``` text
Chat_app/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── socket/
│   └── server.js
├── frontend/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── redux/
│   ├── App.jsx
│   └── main.jsx
└── README.md
```

------------------------------------------------------------------------

# 🗄 Database Schema

``` mermaid
erDiagram
USER ||--o{ CONVERSATION : participates
CONVERSATION ||--o{ MESSAGE : contains

USER {
 string username
 string email
 string password
}

CONVERSATION {
 ObjectId[] participants
 ObjectId[] messages
}

MESSAGE {
 ObjectId senderId
 ObjectId receiverId
 string text
 string image
}
```

------------------------------------------------------------------------

# 🌐 REST API

## Authentication

  Method   Endpoint
  -------- ------------------
  POST     /api/auth/signup
  POST     /api/auth/login
  GET      /api/auth/logout

## Users

  Method   Endpoint
  -------- -------------------
  GET      /api/user/profile
  GET      /api/user/all
  PUT      /api/user/update

## Messages

  Method   Endpoint
  -------- -------------------------------
  POST     /api/message/send/:receiverId
  GET      /api/message/:receiverId

------------------------------------------------------------------------
# 🎥 Demo

 view in chat_app directory or
 [▶️ Watch the Chat App demonstration](convo-x_demo.mp4)

------------------------------------------------------------------------

# ⚙ Installation

## Clone

``` bash
git clone https://github.com/yourusername/convo-x.git
cd convo-x
```

## Backend

``` bash
cd backend
npm install
npm run dev
```

## Frontend

``` bash
cd frontend
npm install
npm run dev
```

------------------------------------------------------------------------

# 🔑 Environment Variables

``` env
PORT=8000
MONGODB_URL=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
VITE_SERVER_URL=http://localhost:8000
```

------------------------------------------------------------------------

# 🚀 Deployment

-   Frontend: Render link : https://frontend-chat-app-0nvc.onrender.com
-   Backend: Render
-   Database: MongoDB Atlas
-   Media: Cloudinary

---------------------------------------------------------------------- 

# 🔮 Future Improvements

-   Group Chats
-   Voice Calling
-   Video Calling
-   Typing Indicator
-   Read Receipts
-   File Sharing
-   Push Notifications
-   End-to-End Encryption
-   Dark Mode

------------------------------------------------------------------------
 
# 📄 License

MIT License

------------------------------------------------------------------------

# 🙏 Acknowledgements

-   React
-   Node.js
-   Express.js
-   MongoDB
-   Socket.IO
-   Cloudinary
-   Redux Toolkit
-   Tailwind CSS

------------------------------------------------------------------------

# 👨‍💻 Author

**Ravi Kumar Sharma**

-   Full Stack MERN Developer
-   B.Tech CSE Student
-   NIT Sikkim

 
