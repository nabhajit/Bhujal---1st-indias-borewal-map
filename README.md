# BHUJAL - MERN Stack Application

This is the MERN stack version of the BHUJAL Borewell Management System, converted from Django.

## Tech Stack

- **Frontend**: React.js with Tailwind CSS
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)

## Project Structure

```
Bhujal-SFT/
├── backend/                 # Node.js/Express backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── server.js           # Main server file
│   └── package.json        # Backend dependencies
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context (state management)
│   │   └── services/       # API services
│   └── package.json        # Frontend dependencies
└── README.md
```

## Features

- User registration and authentication
- Borewell registration and management
- Location tracking with GPS coordinates
- Dashboard with personal and community borewell data
- Responsive design with Tailwind CSS

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Git

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
copy .env.example .env
```

4. Update the `.env` file with your settings:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bhujal
JWT_SECRET=your_very_secure_jwt_secret_key
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:3000
```

5. Start the backend server:
```bash
npm run dev
```

The backend will run on http://localhost:5000

### Frontend Setup

1. Open a new terminal and navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on http://localhost:3000

### Database Setup

1. Make sure MongoDB is running on your system
2. The application will automatically create the database and collections when you first run it

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Borewell Management
- `POST /api/borewell/register` - Register new borewell
- `GET /api/borewell/my-borewells` - Get user's borewells
- `GET /api/borewell/all` - Get all borewells
- `GET /api/borewell/owners` - Get borewell owners
- `GET /api/borewell/:id` - Get single borewell
- `PUT /api/borewell/:id` - Update borewell
- `DELETE /api/borewell/:id` - Delete borewell

## Migration from Django

This application has been converted from Django to MERN stack with the following mappings:

### Models
- Django `Customer` model → MongoDB `Customer` schema
- Django `Borewell` model → MongoDB `Borewell` schema

### Views → API Routes
- Django views → Express.js route handlers
- Form handling → JSON API endpoints
- Template rendering → React components

### Authentication
- Django sessions → JWT tokens
- Django password hashing → bcryptjs

### Frontend
- Django templates → React components
- Static files → React build process
- Tailwind CSS (maintained)

## Development

### Backend Development
```bash
cd backend
npm run dev  # Runs with nodemon for auto-restart
```

### Frontend Development
```bash
cd frontend
npm start    # Runs with hot reload
```

## Production Deployment

### Backend
```bash
cd backend
npm install --production
npm start
```

### Frontend
```bash
cd frontend
npm run build
# Serve the build folder with a static file server
```

## Environment Variables

### Backend (.env)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_very_secure_jwt_secret_key
JWT_EXPIRE=30d
FRONTEND_URL=your_frontend_url
```

### Frontend (.env)
```env
REACT_APP_API_URL=your_backend_api_url
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
