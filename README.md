# Blog Platform with Comments — Full-Stack Web Application

A full-stack, production-grade **Blog Platform with Comments** crafted using **React.js, Vite, Tailwind CSS, Node.js, Express.js, JWT Authentication, and MongoDB**. 

This application provides secure user authentication, complete blog post CRUD management, real-time comment interactions, live search & category filtering, a user dashboard, and resource ownership authorization.

---

## 🌟 Features

### 🔐 User Authentication
- **Secure Registration & Login**: User registration with input validation (name, email, password strength, password confirmation) and hashed password storage via `bcryptjs`.
- **JWT Authorization**: Token-based authentication with state persistence via React Context API and `localStorage`.
- **Route & Action Protection**: Private operations (creating/editing/deleting posts, adding/deleting comments) require authentication and ownership verification.

### 📝 Blog Post Management (CRUD)
- **Create Post**: Rich post creation form with Title, Category, Cover Image URL, and Content.
- **Edit Post**: Pre-filled update interface restricted exclusively to the post author.
- **Delete Post**: Confirmation modal dialog protecting against accidental deletion. Automatically cleans up associated post comments.
- **Home Feed**: Displays published posts in a responsive grid, showcasing cover images, categories, author badges, publication dates, and dynamic comment counts.

### 🔍 Search & Filtering
- **Live Search**: Instant real-time search across post titles, content, and categories.
- **Category Filter Pills**: Filter articles by `All`, `Technology`, `Programming`, `AI`, `Web Development`, `Lifestyle`, or `Other`.

### 💬 Comment System
- **Real-Time Commenting**: Authenticated users can leave comments on any blog post.
- **Comment Ownership**: Users can delete their own comments directly from the post details page.
- **Dynamic Counters**: Comment counts update automatically across the home page feed, article view, and creator dashboard.

### 📊 Creator Dashboard
- **User Statistics**: Displays metrics for Total Posts Created and Total Comments Received across articles.
- **My Articles Table**: Provides quick viewing, editing, and deletion controls for all articles authored by the logged-in user.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js (v18) + Vite
- **Styling**: Tailwind CSS (v4) with custom glassmorphism design system
- **Routing**: React Router DOM (v6)
- **HTTP Client**: Axios with request & response interceptors
- **State Management**: React Context API (`AuthContext`)
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js (REST API architecture)
- **Database**: MongoDB & Mongoose ORM (with in-memory fallback option)
- **Authentication**: JSON Web Tokens (`jsonwebtoken`) & `bcryptjs`
- **Security & Config**: CORS & `dotenv`

---

## 📂 Project Structure

```
blog/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection logic
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, profile handlers
│   │   ├── postController.js     # Blog CRUD, search, filter, and user posts
│   │   └── commentController.js  # Add, fetch, and delete comment handlers
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT Bearer token protection middleware
│   │   └── errorMiddleware.js    # Unified centralized error handling
│   ├── models/
│   │   ├── User.js               # Mongoose schema for User
│   │   ├── Post.js               # Mongoose schema for Post
│   │   └── Comment.js            # Mongoose schema for Comment
│   ├── routes/
│   │   ├── authRoutes.js         # Auth endpoint routes
│   │   ├── postRoutes.js         # Post & nested comment routes
│   │   └── commentRoutes.js      # Comment deletion routes
│   ├── .env                      # Backend environment variables
│   ├── seed.js                   # Database seeder script
│   ├── server.js                 # Express app initialization
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Responsive navigation bar & drawer
│   │   │   ├── Footer.jsx        # Application footer
│   │   │   ├── BlogCard.jsx      # Article preview card
│   │   │   ├── Comment.jsx       # Single comment item with delete action
│   │   │   └── ProtectedRoute.jsx# Auth route wrapper
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Global authentication state
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Hero section, search, filter & post grid
│   │   │   ├── Login.jsx         # User login page
│   │   │   ├── Register.jsx      # User registration page
│   │   │   ├── BlogDetails.jsx   # Full article view & comment system
│   │   │   ├── CreatePost.jsx    # Article authoring form
│   │   │   ├── EditPost.jsx      # Article editor form
│   │   │   └── Dashboard.jsx     # Creator stats & post management
│   │   ├── services/
│   │   │   └── api.js            # Axios configuration & API requests
│   │   ├── App.jsx               # Application routes setup
│   │   ├── main.jsx              # React entry point
│   │   └── index.css             # Design tokens & glassmorphism utilities
│   ├── .env                      # Frontend environment variables
│   ├── vite.config.js            # Vite build configuration
│   └── package.json
└── README.md
```

---

## ⚡ Quick Start & Installation

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### 1. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/blog_platform
JWT_SECRET=super_secret_jwt_key_blog_platform_2026_safe
```

#### Seed Database (Optional but Recommended)
Populate test accounts, sample blog posts, and comments:
```bash
npm run seed
```

#### Start Backend Server
```bash
npm start
```
The backend API will run at `http://localhost:5000`.

---

### 2. Frontend Setup
In a new terminal window:
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

#### Start Frontend Development Server
```bash
npm run dev
```
The React application will launch at `http://localhost:3000`.

---

## 📡 REST API Documentation

### 🔑 Authentication APIs
| Method | Endpoint | Description | Protected | Headers | Body / Query |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user | ❌ | `Content-Type: application/json` | `{ name, email, password, confirmPassword }` |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT token | ❌ | `Content-Type: application/json` | `{ email, password }` |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | ✅ | `Authorization: Bearer <token>` | None |

### 📰 Blog Post APIs
| Method | Endpoint | Description | Protected | Headers | Body / Query |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `GET` | `/api/posts` | Fetch all posts (with search & category filters) | ❌ | None | Query: `?search=react&category=Technology` |
| `GET` | `/api/posts/:id` | Fetch single post by ID | ❌ | None | None |
| `GET` | `/api/posts/user/my-posts` | Fetch posts authored by current user | ✅ | `Authorization: Bearer <token>` | None |
| `POST` | `/api/posts` | Create new post | ✅ | `Authorization: Bearer <token>` | `{ title, content, category, image }` |
| `PUT` | `/api/posts/:id` | Update post (Author owner only) | ✅ | `Authorization: Bearer <token>` | `{ title, content, category, image }` |
| `DELETE` | `/api/posts/:id` | Delete post & associated comments | ✅ | `Authorization: Bearer <token>` | None |

### 💬 Comment APIs
| Method | Endpoint | Description | Protected | Headers | Body / Query |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `GET` | `/api/posts/:postId/comments` | Fetch comments for a post | ❌ | None | None |
| `POST` | `/api/posts/:postId/comments` | Add comment to a post | ✅ | `Authorization: Bearer <token>` | `{ content }` |
| `DELETE` | `/api/comments/:commentId` | Delete a comment (Owner only) | ✅ | `Authorization: Bearer <token>` | None |

---

## 🗄️ Database Schemas

### User Schema
- `name`: String (Required, trimmed)
- `email`: String (Required, unique, lowercase, regex validated)
- `password`: String (Required, min length 6, hashed with bcrypt)
- `timestamps`: `createdAt`, `updatedAt`

### Post Schema
- `title`: String (Required, trimmed)
- `content`: String (Required)
- `category`: String (Required, enum: `['Technology', 'Programming', 'AI', 'Web Development', 'Lifestyle', 'Other']`)
- `image`: String (Featured image URL)
- `author`: ObjectId (Reference to `User` model)
- `timestamps`: `createdAt`, `updatedAt`

### Comment Schema
- `content`: String (Required, trimmed)
- `author`: ObjectId (Reference to `User` model)
- `post`: ObjectId (Reference to `Post` model)
- `timestamps`: `createdAt`, `updatedAt`

---

## 🚀 Future Improvements

- **Rich Text Editor**: Integration of Quill / Tiptap for formatted post content.
- **Direct Image Uploads**: Cloudinary or AWS S3 integration for direct image file uploads.
- **Bookmarks & Likes**: Ability to bookmark articles and like posts/comments.
- **Nested Comments & Replies**: Threaded conversation hierarchy for comments.
- **User Profiles**: Public author profile pages showcasing bios and written articles.
- **Dark / Light Theme Toggle**: Seamless theme switching.

---

## 👤 Author

Developed as a full-stack web application showcasing clean REST API design, robust authentication, database relationships, and modern React user experience.
#   b l o g  
 