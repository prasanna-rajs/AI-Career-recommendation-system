# AI-Powered Career Guidance System

A comprehensive FastAPI-based career guidance system that provides resume analysis, quiz assessments, career predictions, course recommendations, and personalized learning roadmaps powered by Google Gemini AI.

## 🚀 Features

### Core Features
- **Resume Analysis**: Upload and analyze resumes (PDF/DOCX) with AI-powered insights
- **Job Matching**: Match resumes with job descriptions using Doc2Vec + Gemini
- **Skill Gap Analysis**: Identify missing skills and get recommendations
- **Quiz System**: Domain-specific aptitude quizzes with detailed feedback
- **Career Prediction**: AI-powered top 3 career recommendations with confidence scores
- **Course Recommendations**: YouTube course suggestions based on career goals
- **Learning Roadmap**: Structured phase-by-phase learning paths with timeline
- **Career Guidance**: Multi-stage guidance (After 10th, 12th, B.Tech, Abroad Studies)
- **Interview Questions**: AI-generated interview questions based on job descriptions
- **Profile Management**: Complete user profile system

## 📁 Project Structure

```
career-guidance-system/
├── main.py                          # FastAPI application
├── config.py                        # Configuration
├── models.py                        # Pydantic models
├── utils.py                         # Helper functions
├── requirements.txt                 # Dependencies
├── .env                             # Environment variables
│
├── services/
│   ├── __init__.py
│   ├── gemini_service.py           # Gemini AI service
│   ├── youtube_service.py          # YouTube API service
│   ├── quiz_service.py             # Quiz management
│   └── resume_service.py           # Resume processing
│
├── temp_files/                      # Temporary uploads
├── profiles/                        # User profiles
├── quiz_data/                       # Quiz storage
└── cv_job_maching.model            # Doc2Vec model (optional)
```

## 🛠️ Installation

### Prerequisites
- Python 3.8 or higher
- Google Gemini API Key
- YouTube Data API Key (optional, for course recommendations)

### Setup Steps

1. **Clone/Download the project**
```bash
cd career-guidance-system
```

2. **Create virtual environment**
```bash
python -m venv venv

# On Windows
venv\Scripts\activate

# On Mac/Linux
source venv/bin/activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Configure environment variables**

Edit the `.env` file and add your API keys:

```env
GOOGLE_API_KEY=your_gemini_api_key_here
YOUTUBE_API_KEY=your_youtube_api_key_here
```

**Get API Keys:**
- **Gemini API**: https://ai.google.dev/
- **YouTube Data API**: https://console.cloud.google.com/

5. **Download NLTK data (optional, for resume processing)**
```bash
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"
```

6. **Place Doc2Vec model (optional)**

If you have the `cv_job_maching.model` file, place it in the project root directory for better resume-JD matching.

## 🚀 Running the Application

### Start the server
```bash
python main.py
```

Or using uvicorn directly:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at: **http://localhost:8000**

### Access API Documentation
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 📚 API Endpoints

### Resume & Job Matching
```
POST /api/resume/upload              # Upload and analyze resume
POST /api/job/match                  # Match resume with JD
POST /api/skill-gap/analyze          # Analyze skill gaps
POST /api/interview/questions        # Generate interview questions
```

### User Profile
```
POST /api/profile/update             # Update basic profile
POST /api/profile/complete           # Complete full profile
GET  /api/profile/{user_id}          # Get user profile
```

### Quiz System
```
POST /api/quiz/generate              # Generate domain quiz
POST /api/quiz/submit                # Submit quiz answers
```

### Career Prediction & Roadmap
```
POST /api/career/predict             # Get top 3 career predictions
POST /api/courses/recommend          # Get YouTube course recommendations
POST /api/roadmap/generate           # Generate learning roadmap
```

### Career Guidance
```
GET  /career_guidance/stages                 # All guidance stages
GET  /career_guidance/after_10th/streams     # Stream options after 10th
POST /career_guidance/after_10th/            # After 10th guidance
POST /career_guidance/after_12th/            # After 12th guidance
POST /career_guidance/after_btech/           # After B.Tech guidance
POST /career_guidance/abroad_studies/        # Abroad studies guidance
```

### Utilities
```
POST /api/chatbot                    # General career chatbot
POST /api/recommend_skills           # Recommend skills for job
GET  /health                         # Health check
GET  /                               # API info
```

## 📝 Usage Examples

### 1. Upload and Analyze Resume

```python
import requests

url = "http://localhost:8000/api/resume/upload"
files = {"file": open("resume.pdf", "rb")}

response = requests.post(url, files=files)
print(response.json())
```

### 2. Generate Quiz

```python
import requests

url = "http://localhost:8000/api/quiz/generate"
data = {
    "domain": "Information Technology",
    "num_questions": 10,
    "difficulty": "medium"
}

response = requests.post(url, json=data)
quiz = response.json()
print(f"Quiz ID: {quiz['quiz_id']}")
```

### 3. Get Career Predictions

```python
import requests

url = "http://localhost:8000/api/career/predict"
data = {
    "user_profile": {
        "user_id": "user123",
        "age": 22,
        "education_level": "B.Tech",
        "stream": "Computer Science",
        "cgpa": 8.5,
        "skills": ["Python", "Machine Learning", "Data Analysis"],
        "interests": ["AI", "Data Science", "Research"],
        "quiz_score": 85.0
    },
    "top_n": 3
}

response = requests.post(url, json=data)
careers = response.json()
for career in careers['top_careers']:
    print(f"{career['career_name']}: {career['confidence_score']}")
```

### 4. Get Course Recommendations

```python
import requests

url = "http://localhost:8000/api/courses/recommend"
data = {
    "career_choice": "Data Scientist",
    "skill_level": "intermediate",
    "max_results": 10
}

response = requests.post(url, json=data)
courses = response.json()
for course in courses['courses']:
    print(f"{course['title']} - {course['url']}")
```

## 🔧 Configuration

### Key Configuration Options in `config.py`:

```python
# Gemini Model
GEMINI_MODEL = "gemini-2.0-flash-exp"

# Available Domains
DOMAINS = [
    "Information Technology",
    "Healthcare & Medicine",
    "Engineering",
    "Business & Management",
    # ... more domains
]

# Streams after 10th
AFTER_10TH_STREAMS = {
    "MPC": {...},
    "BiPC": {...},
    "Commerce": {...},
    # ... more streams
}
```

## 🐛 Troubleshooting

### Issue: "Gemini API key not configured"
**Solution**: Make sure you've added `GOOGLE_API_KEY` in your `.env` file

### Issue: "Doc2Vec model not found"
**Solution**: The system will use fallback keyword matching. For better results, provide the `cv_job_maching.model` file

### Issue: "YouTube API not configured"
**Solution**: Course recommendations require YouTube API key. Add it to `.env` or this feature won't work

### Issue: Module import errors
**Solution**: Make sure all dependencies are installed: `pip install -r requirements.txt`

## 📊 System Requirements

- **RAM**: Minimum 4GB (8GB recommended for Doc2Vec model)
- **Storage**: ~500MB for dependencies
- **Python**: 3.8 or higher
- **Internet**: Required for API calls (Gemini, YouTube)

## 🔒 Security Notes

- Never commit your `.env` file with real API keys
- Use environment variables in production
- Implement rate limiting for production deployment
- Add authentication/authorization as needed

## 📈 Future Enhancements

- [ ] College recommendation system
- [ ] Video resume analysis
- [ ] Audio interview evaluation
- [ ] Real-time chat with AI mentor
- [ ] User dashboard with analytics
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Authentication system (JWT)
- [ ] Deployment guides (Docker, AWS, Heroku)

## 🤝 Contributing

This is a project for Qriocity Ventures. For any issues or improvements, please contact the development team.

## 📄 License

Proprietary - Qriocity Ventures

## 👥 Team

Developed by Ayush for Qriocity Ventures
- Combines features from multiple codebases
- Powered by Google Gemini AI
- YouTube Data API integration

## 📞 Support

For support or queries:
- Email: support@qriocityventures.com
- Documentation: Check `/docs` endpoint for interactive API documentation

---

