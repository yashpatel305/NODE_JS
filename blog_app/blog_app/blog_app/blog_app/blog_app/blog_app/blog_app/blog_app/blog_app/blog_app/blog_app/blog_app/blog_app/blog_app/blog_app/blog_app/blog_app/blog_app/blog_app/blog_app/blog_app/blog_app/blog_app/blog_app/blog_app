# 📝 MERN Blog Application

A full-stack blog application built with MongoDB, Express, React, and Node.js featuring secure cookie-based JWT authentication, role-based access control, and modern UI.

---

## 🎯 Features

### 🔐 Authentication & Security
- **HTTP-only Cookies**: JWT tokens stored in secure, HTTP-only cookies
- **Access & Refresh Tokens**: 15-minute access tokens with 7-day refresh tokens
- **Auto Token Refresh**: Automatic token refresh on expired access tokens
- **CORS with Credentials**: Secure cross-origin requests with credential support
- **Password Hashing**: bcryptjs with salt rounds for secure password storage
- **Role-Based Access**: Admin and User roles with protected routes

### 📚 Blog Features
- Create, read, update, delete blog posts
- URL-friendly slugs for posts
- Cover images support
- Tag system for categorization
- Comments on posts
- Search-friendly content indexing

### 🎨 Frontend Features
- Modern React with Vite
- Tailwind CSS for styling
- React Router for navigation
- Axios with automatic token refresh
- Protected admin routes
- Responsive design
- Clean, intuitive UI

---

## 📁 Project Structure

```
blog-app/
├── server/
│   ├── models/
│   │   ├── User.js
│   │   ├── Post.js
│   │   └── Comment.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── postController.js
│   │   └── commentController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── postRoutes.js
│   │   └── commentRoutes.js
│   ├── middlewares/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── config/
│   │   ├── db.js
│   │   └── jwt.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── PostDetailPage.jsx
    │   │   └── CreatePostPage.jsx
    │   ├── services/
    │   │   ├── api.js
    │   │   └── index.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   ├── index.css
    │   └── tsconfig.json
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html
    └── .env (create from .env.example)
```

---

## 🔐 Authentication Flow

### Cookie-Based JWT Authentication

1. **Registration/Login**
   - User submits credentials
   - Server validates and hashes password
   - Server generates access token (15 min) and refresh token (7 days)
   - Both tokens sent as HTTP-only cookies
   - Client stores credentials in memory, not localStorage

2. **Protected Requests**
   - Client sends request with access token in cookies
   - Server validates access token
   - If valid, grants access
   - If expired, axios interceptor triggers refresh

3. **Token Refresh**
   - When access token expires, axios interceptor catches 401
   - Client sends refresh token to `/api/auth/refresh`
   - Server validates refresh token against database
   - New access token issued and sent as cookie
   - Original request retried with new token

4. **Logout**
   - Server clears refresh token from database
   - Client clears both cookies
   - User redirected to login

### Why HTTP-Only Cookies?
- **XSS Protection**: Cannot be accessed via JavaScript
- **CSRF Protection**: Automatically sent with requests, validated via SameSite flag
- **Automatic Management**: Browser handles cookie sending/removal

---

## 📊 Database Models

### User
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (hashed, required),
  avatar: String (optional),
  role: String (enum: ['user', 'admin'], default: 'user'),
  refreshToken: String (stored in DB for validation),
  createdAt: Date,
  updatedAt: Date
}
```

### Post
```javascript
{
  _id: ObjectId,
  title: String (required),
  slug: String (unique, indexed),
  content: String (required),
  coverImage: String (optional),
  author: ObjectId (ref: User),
  tags: [String],
  published: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Comment
```javascript
{
  _id: ObjectId,
  post: ObjectId (ref: Post, required),
  user: ObjectId (ref: User, required),
  text: String (required, max 500 chars),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔗 API Endpoints

### Authentication Routes

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response: 201
{
  "message": "User registered successfully",
  "user": { id, name, email, role }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response: 200
{
  "message": "Login successful",
  "user": { id, name, email, role }
}
Cookies: accessToken (15m), refreshToken (7d)
```

#### Logout (Protected)
```http
POST /api/auth/logout
Authorization: Bearer <accessToken>

Response: 200
{
  "message": "Logout successful"
}
```

#### Refresh Token
```http
POST /api/auth/refresh
Cookie: refreshToken=<token>

Response: 200
{
  "message": "Token refreshed"
}
Cookie: accessToken=<newToken>
```

#### Get Current User (Protected)
```http
GET /api/auth/me
Authorization: Bearer <accessToken>

Response: 200
{
  "user": { id, name, email, role, avatar }
}
```

### Post Routes

#### Get All Posts
```http
GET /api/posts?published=true

Response: 200
{
  "count": 5,
  "posts": [
    {
      "_id": "...",
      "title": "...",
      "slug": "...",
      "content": "...",
      "coverImage": "...",
      "author": { name, email, avatar },
      "tags": ["react", "javascript"],
      "published": true,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

#### Get Post by Slug
```http
GET /api/posts/my-blog-post-slug

Response: 200
{
  "post": { /* post object */ }
}
```

#### Create Post (Admin Only)
```http
POST /api/posts
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "title": "My First Blog Post",
  "content": "Detailed content here...",
  "coverImage": "https://...",
  "tags": ["react", "javascript"],
  "published": true
}

Response: 201
{
  "message": "Post created successfully",
  "post": { /* created post */ }
}
```

#### Update Post (Admin Only)
```http
PUT /api/posts/:postId
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content...",
  "tags": ["react", "nodejs"],
  "published": true
}

Response: 200
{
  "message": "Post updated successfully",
  "post": { /* updated post */ }
}
```

#### Delete Post (Admin Only)
```http
DELETE /api/posts/:postId
Authorization: Bearer <accessToken>

Response: 200
{
  "message": "Post deleted successfully"
}
```

### Comment Routes

#### Get Comments for Post
```http
GET /api/comments/:postId

Response: 200
{
  "count": 3,
  "comments": [
    {
      "_id": "...",
      "text": "Great post!",
      "user": { name, avatar },
      "createdAt": "..."
    }
  ]
}
```

#### Create Comment (Protected)
```http
POST /api/comments/:postId
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "text": "This is a great post!"
}

Response: 201
{
  "message": "Comment created successfully",
  "comment": { /* comment object */ }
}
```

#### Delete Comment (Own or Admin)
```http
DELETE /api/comments/:commentId
Authorization: Bearer <accessToken>

Response: 200
{
  "message": "Comment deleted successfully"
}
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v16 or higher
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to server directory**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure .env**
   ```
   MONGODB_URI=mongodb://localhost:27017/blog-app
   PORT=5000
   JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
   JWT_REFRESH_SECRET=your_super_secret_refresh_key_here_change_in_production
   ADMIN_EMAIL=admin@blog.com
   ADMIN_PASSWORD=Admin@123
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   ```

5. **Start MongoDB**
   ```bash
   # Local MongoDB
   mongod
   
   # Or use MongoDB Atlas connection string in MONGODB_URI
   ```

6. **Run development server**
   ```bash
   npm run dev
   ```
   Server runs on http://localhost:5000

### Frontend Setup

1. **Navigate to client directory** (from project root)
   ```bash
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   Frontend runs on http://localhost:5173

---

## 🔑 Admin Credentials

Default admin account created on first server start:

```
Email: admin@blog.com
Password: Admin@123
```

⚠️ **Change these immediately in production!**

---

## 🛠 Environment Variables

### Server (.env)
```
MONGODB_URI          # MongoDB connection string
PORT                 # Server port (default: 5000)
JWT_SECRET           # Secret for access tokens
JWT_REFRESH_SECRET   # Secret for refresh tokens
ADMIN_EMAIL          # Default admin email
ADMIN_PASSWORD       # Default admin password
NODE_ENV             # development | production
CLIENT_URL           # Frontend URL for CORS
```

### Client
No .env needed. Server URL configured in `src/services/api.js`

---

## 📖 How to Use

### As a Regular User

1. **Register** - Create account at `/register`
2. **Login** - Sign in at `/login`
3. **View Posts** - Browse published posts on homepage
4. **Read Post** - Click "Read More" to view full post and comments
5. **Comment** - Add comments to posts (requires login)
6. **Logout** - Click logout button in navbar

### As an Admin

1. **Login** with admin credentials
2. **Create Post** - Click "Create Post" in navbar
3. **Edit Post** - Update existing posts
4. **Delete Post** - Remove posts
5. **Manage Comments** - Delete any comments

---

## 🔄 Running Both Servers

### Terminal 1 (Backend)
```bash
cd server
npm run dev
```

### Terminal 2 (Frontend)
```bash
cd client
npm run dev
```

Visit http://localhost:5173 in browser

---

## 🧪 Testing API Endpoints

### Using cURL

**Register**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"Pass123"}'
```

**Login**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"admin@blog.com","password":"Admin@123"}'
```

**Get Posts**
```bash
curl http://localhost:5000/api/posts
```

**Get Current User (with auth)**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -b cookies.txt
```

### Using Postman

1. Create new request
2. Set method to POST/GET/PUT/DELETE
3. Enter URL (e.g., http://localhost:5000/api/posts)
4. For authenticated requests:
   - Go to "Cookies" tab
   - Make login request first
   - Postman auto-stores cookies
   - Use them in subsequent requests

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: 
- Start MongoDB service: `mongod`
- Or update `MONGODB_URI` to use MongoDB Atlas

### CORS Error
```
Access to XMLHttpRequest blocked by CORS
```
**Solution**:
- Ensure `CLIENT_URL=http://localhost:5173` in server `.env`
- Check that `withCredentials: true` in axios client

### Token Refresh Loop
```
Infinite 401 errors
```
**Solution**:
- Clear browser cookies
- Restart both servers
- Check JWT_SECRET and JWT_REFRESH_SECRET in .env

### Admin Account Not Created
**Solution**:
- Check `ADMIN_EMAIL` and `ADMIN_PASSWORD` in .env
- Ensure MongoDB is running
- Check server logs for errors

---

## 📦 Dependencies

### Server
- **express**: Web framework
- **mongoose**: MongoDB ODM
- **jsonwebtoken**: JWT token generation
- **bcryptjs**: Password hashing
- **cookie-parser**: Cookie parsing
- **cors**: Cross-origin support
- **slugify**: URL-friendly slugs
- **dotenv**: Environment variables

### Client
- **react**: UI library
- **react-dom**: React DOM rendering
- **react-router-dom**: Client routing
- **axios**: HTTP client
- **tailwindcss**: CSS framework
- **vite**: Build tool

---

## 🚢 Deployment

### Deploy Server (Heroku Example)

1. **Set up Heroku**
   ```bash
   heroku login
   heroku create your-blog-api
   ```

2. **Set environment variables**
   ```bash
   heroku config:set MONGODB_URI=your_atlas_uri
   heroku config:set JWT_SECRET=your_secret_key
   heroku config:set CLIENT_URL=https://your-frontend.com
   ```

3. **Deploy**
   ```bash
   git push heroku main
   ```

### Deploy Frontend (Vercel Example)

1. **Build the app**
   ```bash
   cd client
   npm run build
   ```

2. **Deploy with Vercel**
   ```bash
   npm i -g vercel
   vercel
   ```

3. **Update API URL** if needed in `src/services/api.js`

### Deploy with Docker

**Server Dockerfile**
```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

**Build and run**
```bash
docker build -t blog-api .
docker run -p 5000:5000 --env-file .env blog-api
```

---

## 📸 Screenshots Section

### Planned UI Components

1. **Homepage** - Grid of published blog posts with cover images
2. **Login Page** - Clean login form with demo credentials shown
3. **Register Page** - Registration form for new users
4. **Post Detail** - Full post with comments section
5. **Admin Panel** - Create/edit post form with rich editor
6. **Navbar** - Navigation with user profile and logout

*Screenshots can be added after deployment*

---

## 🤝 Contributing

Contributions welcome! Please follow these steps:

1. Create feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open Pull Request

---

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details

---

## ✨ Features Roadmap

- [ ] User profiles and avatars
- [ ] Post categories
- [ ] Search functionality
- [ ] Dark mode toggle
- [ ] Email notifications
- [ ] Social media sharing
- [ ] Rich text editor (Quill/Draft.js)
- [ ] Post analytics
- [ ] Follow users
- [ ] Like/reaction system
- [ ] User dashboard

---

## 📞 Support

For issues, questions, or suggestions:
1. Check troubleshooting section
2. Review API documentation
3. Check console logs for errors
4. Open an issue in the repository

---

## 🔒 Security Notes

### Production Checklist
- [ ] Change default admin credentials
- [ ] Update JWT_SECRET and JWT_REFRESH_SECRET with strong random keys
- [ ] Set NODE_ENV=production
- [ ] Use HTTPS only (not HTTP)
- [ ] Set secure CORS origins
- [ ] Use MongoDB Atlas with authentication
- [ ] Enable database backups
- [ ] Set up rate limiting
- [ ] Add input validation
- [ ] Use helmet.js for headers
- [ ] Enable HTTPS and SSL/TLS
- [ ] Set up logging and monitoring
- [ ] Regular security audits

### Cookie Security
- All JWT tokens stored in HTTP-only cookies
- SameSite=strict for CSRF protection
- Secure flag set in production (HTTPS only)
- Tokens automatically cleared on logout

---

Made with ❤️ for secure, cookie-based authentication in MERN applications.
