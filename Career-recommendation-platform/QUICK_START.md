# Quick Start Guide

Get your AI-Powered Career Guidance System up and running in 5 minutes!

## Step 1: Backend Setup (3 minutes)

```bash
# Navigate to backend folder
cd ML

# Create virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env and add your Google Gemini API key
# GOOGLE_API_KEY=your_api_key_here

# Initialize database
python init_db.py

# (Optional) Seed sample college data
python seed_colleges.py

# Start the backend server
uvicorn main:app --reload
```

Backend will run at: `http://localhost:8000`

API Docs: `http://localhost:8000/docs`

## Step 2: Frontend Setup (2 minutes)

```bash
# Open a new terminal
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run at: `http://localhost:5173`

## Step 3: Test the Application

1. Open browser to `http://localhost:5173`
2. Click "Get Started" or "Sign Up"
3. Create a new account
4. Complete your profile
5. Explore the dashboard features!

## 🔑 Getting API Keys

### Google Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and paste it in `ML/.env`

### YouTube API Key (Optional)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable YouTube Data API v3
4. Create credentials → API Key
5. Copy the key and paste it in `ML/.env`

## 🐛 Troubleshooting

**Port already in use?**
```bash
# Backend (change port)
uvicorn main:app --reload --port 8001

# Frontend (change port in vite.config.js or use)
npm run dev -- --port 3000
```

**Module not found errors?**
```bash
# Backend
pip install -r requirements.txt --upgrade

# Frontend
rm -rf node_modules package-lock.json
npm install
```

**Can't connect to API?**
- Make sure backend is running on port 8000
- Check `frontend/.env` has correct `VITE_API_URL=http://localhost:8000`

## ✅ What's Working

- ✅ User authentication (signup, login, logout)
- ✅ Profile management
- ✅ Career predictions (via existing ML API)
- ✅ Quiz system (via existing ML API)
- ✅ Resume analysis (via existing ML API)
- ✅ College recommendations (new feature with database)
- ✅ Learning roadmaps (via existing ML API)
- ✅ Protected routes and JWT auth

## 🚧 What's Next

To complete the full implementation, you can add:
- Full Quiz UI with timer and progress
- Resume upload component
- College filtering and search UI
- Roadmap visualization with charts
- Profile viewing and editing
- Career prediction results display

## 💡 Tips

- Keep both terminal windows open (backend and frontend)
- Check browser console (F12) for any errors
- Use API docs at `/docs` to test endpoints directly
- Sample users: Check the database after signup

## 📞 Need Help?

- Check the main [README.md](./README.md) for detailed documentation
- Review API endpoints at `http://localhost:8000/docs`
- Ensure all environment variables are set correctly

---


