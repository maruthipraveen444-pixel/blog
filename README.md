# 📝 Blog Platform with Comments

A full-stack blogging platform where users can register, securely log in, create and manage blog posts, and interact with other users through comments.

The project demonstrates full-stack development using the **MERN stack**, RESTful APIs, JWT authentication, MongoDB database integration, and role-based resource authorization.

---

## 🚀 Features

### 👤 User Authentication

* User registration and login
* JWT-based authentication
* Secure password hashing using bcrypt
* Persistent authentication
* Protected routes
* Logout functionality

### 📝 Blog Management

* Create blog posts
* View all blog posts
* View individual blog posts
* Edit own blog posts
* Delete own blog posts
* Category-based organization
* Search blog posts
* Display author and publication date

### 💬 Comments

* Add comments to blog posts
* View comments
* Delete own comments
* Comment count for each post
* User and post association

### 📊 User Dashboard

* View personal blog posts
* View total posts
* Manage created posts
* Edit and delete posts
* Quick access to create a new post

### 🎨 User Interface

* Modern and clean design
* Responsive layout
* Mobile-friendly interface
* Loading states
* Error handling
* Form validation
* Empty states
* Responsive navigation

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* React Router DOM
* Axios
* Context API

### Backend

* Node.js
* Express.js
* RESTful APIs
* JWT
* bcrypt

### Database

* MongoDB
* Mongoose

### Tools

* Git
* GitHub
* VS Code
* Postman

---

## 📂 Project Structure

```text
Blog-Platform/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── BlogCard.jsx
│   │   │   ├── Comment.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── BlogDetails.jsx
│   │   │   ├── CreatePost.jsx
│   │   │   ├── EditPost.jsx
│   │   │   └── Dashboard.jsx
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── .env
│   └── package.json
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── postController.js
│   │   └── commentController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Post.js
│   │   └── Comment.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── postRoutes.js
│   │   └── commentRoutes.js
│   │
│   ├── .env
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone <your-github-repository-url>

cd Blog-Platform
```

---

## 🔧 Backend Setup

Navigate to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the backend server:

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

---

## 💻 Frontend Setup

Open a new terminal and navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

The frontend will normally run on:

```text
http://localhost:5173
```

---

## 🗄️ Database

This project uses **MongoDB** as the database.

The application contains three main collections:

### User

```text
User
├── name
├── email
├── password
└── createdAt
```

### Post

```text
Post
├── title
├── content
├── category
├── image
├── author
├── createdAt
└── updatedAt
```

### Comment

```text
Comment
├── content
├── author
├── post
└── createdAt
```

The `author` field in posts and comments references the User collection.

---

## 🔐 Authentication

Authentication is implemented using **JSON Web Tokens (JWT)**.

### Authentication Flow

```text
User Registration
       ↓
Password Hashing
       ↓
MongoDB
       ↓
User Login
       ↓
JWT Token Generated
       ↓
Authenticated Requests
       ↓
Protected API Routes
```

Passwords are never stored as plain text.

---

## 🌐 REST API Endpoints

### Authentication

| Method | Endpoint             | Description         |
| ------ | -------------------- | ------------------- |
| POST   | `/api/auth/register` | Register a new user |
| POST   | `/api/auth/login`    | Login user          |
| GET    | `/api/auth/me`       | Get current user    |

### Blog Posts

| Method | Endpoint                   | Description                |
| ------ | -------------------------- | -------------------------- |
| GET    | `/api/posts`               | Get all posts              |
| GET    | `/api/posts/:id`           | Get a single post          |
| POST   | `/api/posts`               | Create a post              |
| PUT    | `/api/posts/:id`           | Update own post            |
| DELETE | `/api/posts/:id`           | Delete own post            |
| GET    | `/api/posts/user/my-posts` | Get logged-in user's posts |

### Comments

| Method | Endpoint                      | Description        |
| ------ | ----------------------------- | ------------------ |
| GET    | `/api/posts/:postId/comments` | Get post comments  |
| POST   | `/api/posts/:postId/comments` | Add a comment      |
| DELETE | `/api/comments/:commentId`    | Delete own comment |

---

## 🔒 Authorization

The application verifies ownership before allowing users to modify content.

For example:

```text
User A
   ↓
Creates Post A

User B
   ↓
Can View Post A
   ↓
Cannot Edit Post A
   ↓
Cannot Delete Post A
```

This prevents unauthorized modification of other users' content.

---

## 🧪 API Testing

The REST APIs can be tested using **Postman**.

Important APIs to test:

* User Registration
* User Login
* Get Current User
* Create Post
* Get Posts
* Get Single Post
* Update Post
* Delete Post
* Add Comment
* Get Comments
* Delete Comment

---

## 📱 Application Pages

### Home Page

Displays the latest blog posts with search and category filtering.

### Register Page

Allows new users to create an account.

### Login Page

Allows registered users to authenticate.

### Blog Details Page

Displays the complete blog post and its comments.

### Create Post Page

Allows authenticated users to publish new posts.

### Edit Post Page

Allows users to update their own posts.

### Dashboard

Allows users to manage their posts and view basic statistics.

---

## 🔍 Search and Filtering

Users can search blog posts based on:

* Title
* Content
* Category

Posts can also be filtered by categories such as:

* Technology
* Programming
* Artificial Intelligence
* Web Development
* Lifestyle
* Other

---

## 🛡️ Security Features

* Password hashing with bcrypt
* JWT authentication
* Protected API routes
* Ownership validation
* Environment variables for sensitive information
* Request validation
* Proper HTTP status codes
* CORS configuration
* Passwords excluded from API responses

---

## 🔮 Future Improvements

The following features can be added in future versions:

* Rich text editor
* Image upload
* Likes and bookmarks
* Nested comments and replies
* User profile pages
* Admin dashboard
* Post tags
* Pagination
* Email verification
* Password reset
* Social login
* Dark/light mode
* Post sharing
* Notifications

---

## 🎯 Learning Outcomes

This project helped demonstrate practical knowledge of:

* Full-stack web development
* React component development
* RESTful API development
* CRUD operations
* MongoDB database integration
* Mongoose relationships
* JWT authentication
* Password hashing
* Protected routes
* Authorization and ownership
* API integration using Axios
* State management with Context API
* Responsive UI development
* API testing using Postman

---

## 📌 Project Status

**Status:** Completed ✅

The project implements the core requirements of a full-stack blogging platform with authentication, blog management, and user comments.

---

## 👨‍💻 Author

**Praveen**

B.Tech Information Technology
Jeppiaar Engineering College

---

## 📄 License

This project is created for educational and internship purposes.
