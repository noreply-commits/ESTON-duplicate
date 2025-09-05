# Eston University Admissions Portal

A comprehensive web portal for managing university admissions and course applications, built with Express.js, PostgreSQL, and React.

## Features

### For Students
- User registration and authentication
- Browse available courses
- Submit admission applications
- Track application status
- Update profile information
- View application history

### For Administrators
- Dashboard with application statistics
- Manage all applications (approve/reject)
- View and manage courses
- User management
- Application filtering and search

## Tech Stack

### Backend
- **Node.js** with **Express.js** framework
- **PostgreSQL** database with **pg** driver
- **JWT** authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation
- **helmet** for security headers
- **cors** for cross-origin requests
- **express-rate-limit** for API rate limiting

### Frontend
- **React 18** with functional components and hooks
- **React Router** for navigation
- **Tailwind CSS** for styling
- **React Hook Form** for form management
- **Axios** for API requests
- **React Hot Toast** for notifications
- **Lucide React** for icons

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **PostgreSQL** (v12 or higher)
- **npm** or **yarn**

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd eston-admissions-portal
```

### 2. Install backend dependencies

```bash
npm install
```

### 3. Install frontend dependencies

```bash
cd client
npm install
cd ..
```

### 4. Environment Configuration

Create a `.env` file in the root directory based on `env.example`:

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=eston_admissions
DB_USER=your_username
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=24h

# Server Configuration
PORT=5000
NODE_ENV=development

# Email Configuration (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Frontend URL
CLIENT_URL=http://localhost:3000
```

### 5. Database Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE eston_admissions;
```

2. The application will automatically create tables and insert sample data on first run.

### 6. Run the Application

#### Development Mode (Both Backend and Frontend)
```bash
npm run dev
```

#### Backend Only
```bash
npm run server
```

#### Frontend Only
```bash
npm run client
```

#### Production Build
```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Courses
- `GET /api/courses` - Get all courses (with search and pagination)
- `GET /api/courses/:id` - Get specific course details
- `GET /api/courses/:id/applications` - Get applications for a course

### Admissions
- `POST /api/admissions/apply` - Submit admission application
- `GET /api/admissions/my-applications` - Get user's applications
- `GET /api/admissions/:id` - Get specific application details
- `PUT /api/admissions/:id/documents` - Update documents status
- `DELETE /api/admissions/:id` - Withdraw application

### Admin (Admin Only)
- `GET /api/admin/dashboard` - Admin dashboard statistics
- `GET /api/admin/applications` - Get all applications with filtering
- `PUT /api/admin/applications/:id/status` - Update application status
- `GET /api/admin/users` - Get all users
- `POST /api/admin/courses` - Create new course
- `PUT /api/admin/courses/:id` - Update course

## Default Admin Account

The system creates a default admin account on first run:
- **Email**: admin@eston.edu.gh
- **Password**: admin123

**Important**: Change this password immediately after first login!

## Database Schema

### Users Table
- id, email, password, first_name, last_name, phone, role, created_at, updated_at

### Courses Table
- id, name, code, description, duration, requirements, fee, is_active, created_at

### Admissions Table
- id, user_id, course_id, status, documents_submitted, application_date, review_date, admin_notes, created_at, updated_at

### Documents Table
- id, admission_id, document_type, file_name, file_path, uploaded_at

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Rate limiting
- Security headers with helmet
- Protected routes for authenticated users
- Role-based access control for admin functions

## File Structure

```
eston-admissions-portal/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   │   └── admin/      # Admin pages
│   │   ├── App.js          # Main app component
│   │   └── index.js        # Entry point
│   ├── package.json
│   └── tailwind.config.js
├── config/                 # Database configuration
├── middleware/             # Express middleware
├── routes/                 # API route handlers
├── server.js               # Express server
├── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
3. Add tests if applicable
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please contact:
- **Email**: info@eston.edu.gh
- **Website**: https://www.eston.edu.gh/

## Deployment

### Heroku
The application is configured for Heroku deployment with the `heroku-postbuild` script.

### Other Platforms
- Ensure PostgreSQL is available
- Set environment variables
- Run `npm run build` for production build
- Serve the `client/build` folder statically

## Future Enhancements

- Email notifications
- File upload for documents
- Payment integration
- Advanced reporting and analytics
- Mobile app
- Multi-language support
- Advanced search and filtering
- Bulk operations for admins
