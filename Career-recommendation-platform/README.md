# AI-Powered Career Guidance System

A full-stack web application that provides personalized career guidance using AI, including career predictions, skill assessments, college recommendations, and learning roadmaps.

## 🌟 Features

### Core Features
- **User Authentication**: Secure JWT-based authentication system
- **Career Prediction**: AI-powered career recommendations based on user profile and skills
- **Quiz System**: Domain-specific aptitude tests with detailed feedback
- **Resume Analysis**: Upload and analyze resumes with AI
- **Resume-Job Matching**: Match resumes with job descriptions
- **Skill Gap Analysis**: Identify gaps between current and required skills
- **College Recommendations**: Find colleges based on career goals and eligibility
- **Learning Roadmaps**: Personalized learning paths with resources and timelines
- **Course Recommendations**: YouTube course suggestions based on career choice
- **Interview Questions**: Generate job-specific interview questions

### Technology Stack

#### Backend
- **Framework**: FastAPI (Python)
- **Database**: SQLite with SQLAlchemy ORM
- **AI/ML**: Google Gemini API, Doc2Vec (gensim)
- **Authentication**: JWT tokens with bcrypt password hashing
- **File Processing**: PyPDF2, python-docx

#### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: Context API + localStorage
- **API Client**: Axios
- **Visualizations**: Chart.js, React Chart.js 2

## 📁 Project Structure

```
carrer guidence/
├── ML/                          # Backend (FastAPI)
│   ├── main.py                  # Main application entry point
│   ├── config.py                # Configuration settings
│   ├── database.py              # Database setup
│   ├── db_models.py             # SQLAlchemy models
│   ├── auth.py                  # Authentication utilities
│   ├── auth_routes.py           # Auth API endpoints
│   ├── college_routes.py        # College API endpoints
│   ├── models.py                # Pydantic models
│   ├── utils.py                 # Utility functions
│   ├── init_db.py               # Database initialization script
│   ├── seed_colleges.py         # College database seeding
│   ├── requirements.txt         # Python dependencies
│   └── services/                # Business logic services
│       ├── gemini_service.py    # Google Gemini AI integration
│       ├── youtube_service.py   # YouTube API service
│       ├── quiz_service.py      # Quiz management
│       └── resume_service.py    # Resume processing
│
└── frontend/                    # Frontend (React)
    ├── src/
    │   ├── components/          # Reusable components
    │   │   ├── common/
    │   │   ├── dashboard/
    │   │   ├── quiz/
    │   │   ├── college/
    │   │   └── resume/
    │   ├── pages/               # Page components
    │   │   ├── HomePage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── SignupPage.jsx
    │   │   ├── DashboardPage.jsx
    │   │   └── ProfileCompletePage.jsx
    │   ├── context/             # React Context providers
    │   │   └── AuthContext.jsx
    │   ├── services/            # API integration
    │   │   └── api.js
    │   ├── utils/               # Utility functions
    │   ├── hooks/               # Custom React hooks
    │   ├── App.jsx              # Main App component
    │   └── main.jsx             # Entry point
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn
- Google Gemini API key
- YouTube Data API v3 key (optional)

### Backend Setup

1. **Navigate to ML folder**
   ```bash
   cd ML
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create .env file**
   ```bash
   cp .env.example .env
   ```

   Add your API keys to `.env`:
   ```env
   GOOGLE_API_KEY=your_gemini_api_key_here
   YOUTUBE_API_KEY=your_youtube_api_key_here  # Optional
   SECRET_KEY=your_secret_key_for_jwt
   ```

5. **Initialize database**
   ```bash
   python init_db.py
   ```

6. **Seed college data** (optional)
   ```bash
   python seed_colleges.py
   ```

7. **Run the backend server**
   ```bash
   uvicorn main:app --reload
   ```

   The backend API will be available at `http://localhost:8000`

   - API Documentation: `http://localhost:8000/docs`
   - Alternative docs: `http://localhost:8000/redoc`

### Frontend Setup

1. **Navigate to frontend folder**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   The `.env` file is already configured for local development:
   ```env
   VITE_API_URL=http://localhost:8000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`

## 📝 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/logout` - Logout user

### Career Guidance
- `POST /api/career/predict` - Get career predictions
- `POST /api/courses/recommend` - Get course recommendations
- `POST /api/roadmap/generate` - Generate learning roadmap
- `POST /api/chatbot` - Chat with AI career advisor

### Quiz System
- `POST /api/quiz/generate` - Generate domain-specific quiz
- `POST /api/quiz/submit` - Submit quiz and get results

### Resume & Job Matching
- `POST /api/resume/upload` - Upload and analyze resume
- `POST /api/job/match` - Match resume with job description
- `POST /api/skill-gap/analyze` - Analyze skill gaps
- `POST /api/interview/questions` - Generate interview questions

### College Recommendations
- `GET /api/colleges/` - Get all colleges
- `GET /api/colleges/search` - Search colleges
- `GET /api/colleges/{id}` - Get college by ID
- `POST /api/colleges/filter` - Filter colleges
- `GET /api/colleges/recommend/by-career` - Get colleges by career
- `GET /api/colleges/states` - Get all states
- `GET /api/colleges/types` - Get college types

## 🎯 Usage Workflow

1. **Sign Up**: Create an account with email and password
2. **Complete Profile**: Add educational details and interests
3. **Take Quiz**: Assess your skills in chosen domain
4. **Get Career Predictions**: Receive top 3 career recommendations
5. **Explore Colleges**: Find colleges matching your profile
6. **Upload Resume**: Get detailed analysis and suggestions
7. **Generate Roadmap**: Get personalized learning path
8. **Track Progress**: Monitor your career development journey

## 🔒 Security Features

- JWT-based authentication with HTTP-only bearer tokens
- Password hashing using bcrypt
- CORS enabled for cross-origin requests
- Protected API endpoints with authentication middleware
- Input validation with Pydantic models

## 🧪 Testing

### Backend Tests
```bash
cd ML
pytest tests/
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📦 Building for Production

### Backend
```bash
cd ML
# Set environment variables in production
export ENVIRONMENT=production
export DATABASE_URL=your_production_db_url

# Run with production server
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Frontend
```bash
cd frontend
npm run build

# Preview production build
npm run preview
```

## 🐳 Docker Deployment (Optional)

Create `Dockerfile` in ML folder:
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and run:
```bash
docker build -t career-guidance-api .
docker run -p 8000:8000 career-guidance-api
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is developed as part of Qriocity Ventures.

## 👨‍💻 Developer

**Ayush**
Qriocity Ventures

## 🆘 Troubleshooting

### Common Issues

**Backend server won't start:**
- Ensure virtual environment is activated
- Check if all dependencies are installed: `pip install -r requirements.txt`
- Verify GOOGLE_API_KEY is set in .env file

**Frontend build errors:**
- Delete `node_modules` and `package-lock.json`, then run `npm install` again
- Clear npm cache: `npm cache clean --force`

**Database errors:**
- Run `python init_db.py` to recreate tables
- Check file permissions on the database file

**API connection errors:**
- Ensure backend is running on port 8000
- Check VITE_API_URL in frontend/.env matches backend URL
- Verify CORS settings in backend

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Google Gemini API](https://ai.google.dev/)

## 🎉 Future Enhancements

- [ ] Video resume analysis
- [ ] Audio interview evaluation
- [ ] Real-time chat with AI mentor
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] PostgreSQL/MongoDB integration
- [ ] Docker Compose setup
- [ ] CI/CD pipeline
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Social media authentication (Google, GitHub)

---

