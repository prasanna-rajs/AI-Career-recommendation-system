from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import Optional, List
import os
import uuid
import tempfile
import shutil
import logging
from pathlib import Path
from contextlib import asynccontextmanager

# Import models
from models import (
    # Resume & Interview models
    ResumeAnalysisResponse, JobMatchRequest, JobMatchResponse,
    InterviewQuestionRequest, InterviewQuestionsResponse,
    SkillGapRequest, SkillGapResponse,
    ProfileUpdateRequest, ProfileUpdateResponse,
    
    # Career Guidance models
    ChatRequest, SkillRecommendationRequest, CareerGuidanceRequest,
    AfterTenthRequest, AfterTwelfthRequest, AbroadStudiesRequest,
    
    # NEW models
    QuizGenerateRequest, QuizGenerateResponse, QuizSubmitRequest, QuizSubmitResponse,
    CareerPredictRequest, CareerPredictResponse,
    CourseRecommendRequest, CourseRecommendResponse,
    RoadmapRequest, RoadmapResponse,
    CompleteProfileRequest, CompleteProfileResponse
)

# Import services
from services.gemini_service import GeminiService
from services.youtube_service import YouTubeService
from services.quiz_service import QuizService
from services.resume_service import ResumeService

# Import utilities
from utils import (
    process_file, calculate_match, get_match_recommendation,
    save_profile, get_profile, initialize_directories
)

# Import config
from config import Config

# Import authentication routes
from auth_routes import router as auth_router

# Import college routes
from college_routes import router as college_router

# Import database
from database import Base, engine

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Setup lifespan events
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    # Startup
    logger.info("Starting Career Guidance System API...")

    # Initialize directories
    initialize_directories()

    # Initialize database tables
    logger.info("Initializing database...")
    Base.metadata.create_all(bind=engine)
    logger.info("✅ Database initialized")
    
    # Check API keys
    if not Config.GEMINI_API_KEY:
        logger.warning("⚠️ GEMINI API KEY not configured! Please set GOOGLE_API_KEY in .env file")
    else:
        logger.info("✅ Gemini API key configured")
    
    if not Config.YOUTUBE_API_KEY:
        logger.warning("⚠️ YouTube API KEY not configured (optional)")
    else:
        logger.info("✅ YouTube API key configured")
    
    logger.info("✅ Application startup complete")
    
    yield
    
    # Shutdown
    logger.info("Shutting down Career Guidance System API...")
    
    # Clean temporary files
    temp_dir = Path(Config.TEMP_DIR)
    if temp_dir.exists():
        for temp_file in temp_dir.iterdir():
            try:
                temp_file.unlink()
            except Exception as e:
                logger.error(f"Failed to clean up {temp_file}: {str(e)}")
    
    logger.info("✅ Application shutdown complete")

# Create FastAPI app
app = FastAPI(
    title="AI-Powered Career Guidance System",
    description="Complete career guidance system with resume analysis, quiz assessment, career prediction, and personalized learning roadmaps",
    version="3.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
gemini_service = GeminiService()
youtube_service = YouTubeService()
quiz_service = QuizService()
resume_service = ResumeService()

# Include routers
app.include_router(auth_router)
app.include_router(college_router)

# ==================== ROOT ENDPOINT ====================

@app.get("/")
async def root():
    """Root endpoint - API information"""
    return {
        "message": "AI-Powered Career Guidance System API",
        "version": "3.0.0",
        "status": "running",
        "features": {
            "resume_analysis": "Upload and analyze resumes",
            "job_matching": "Match resumes with job descriptions",
            "skill_gap_analysis": "Identify skill gaps",
            "quiz_system": "Domain-specific aptitude quizzes",
            "career_prediction": "AI-powered career recommendations",
            "course_recommendations": "YouTube course suggestions",
            "learning_roadmap": "Personalized learning paths",
            "career_guidance": "Multi-stage career guidance (10th, 12th, B.Tech, Abroad)"
        },
        "endpoints": {
            "resume": ["/api/resume/upload", "/api/job/match", "/api/skill-gap/analyze"],
            "profile": ["/api/profile/update", "/api/profile/complete", "/api/profile/{user_id}"],
            "quiz": ["/api/quiz/generate", "/api/quiz/submit"],
            "career": ["/api/career/predict"],
            "courses": ["/api/courses/recommend"],
            "roadmap": ["/api/roadmap/generate"],
            "guidance": [
                "/career_guidance/stages",
                "/career_guidance/after_10th/streams",
                "/career_guidance/after_10th/",
                "/career_guidance/after_12th/",
                "/career_guidance/after_btech/",
                "/career_guidance/abroad_studies/"
            ],
            "interview": ["/api/interview/questions"],
            "chatbot": ["/api/chatbot"]
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "gemini_configured": bool(Config.GEMINI_API_KEY),
        "youtube_configured": bool(Config.YOUTUBE_API_KEY)
    }



@app.post("/api/resume/upload", response_model=ResumeAnalysisResponse)
async def upload_resume(file: UploadFile = File(...)):
    """Upload and analyze resume"""
    temp_file_path = os.path.join(Config.TEMP_DIR, f"temp_{uuid.uuid4()}{os.path.splitext(file.filename)[1]}")
    
    try:
        # Save uploaded file
        with open(temp_file_path, "wb") as temp_file:
            shutil.copyfileobj(file.file, temp_file)
        
        # Extract text
        resume_text = process_file(temp_file_path)
        
        # Analyze with Gemini
        analysis_json = gemini_service.analyze_resume(resume_text)

        # Handle case where response might be a list instead of dict
        if isinstance(analysis_json, list):
            # If we got a list, create a proper response structure
            logger.warning(f"Received list instead of dict from resume analysis: {analysis_json}")
            analysis_json = {
                "summary": "Resume analyzed successfully",
                "key_skills": analysis_json if all(isinstance(x, str) for x in analysis_json) else []
            }
        elif not isinstance(analysis_json, dict):
            # If it's neither list nor dict, raise error
            raise ValueError(f"Unexpected response type from Gemini: {type(analysis_json)}")

        return {
            "summary": analysis_json,
            "skills": analysis_json.get("key_skills", [])
        }
    
    except Exception as e:
        logger.error(f"Resume upload error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Resume analysis failed: {str(e)}")
    finally:
        # Clean up temp file
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)

@app.post("/api/job/match", response_model=JobMatchResponse)
async def match_job(request: JobMatchRequest):
    """Match resume summary with job description"""
    try:
        # Calculate match percentage
        match_percentage = calculate_match(request.resume_summary, request.job_description)
        
        return {
            "match_percentage": match_percentage,
            "recommendation": get_match_recommendation(match_percentage)
        }
    
    except Exception as e:
        logger.error(f"Job matching error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Job matching failed: {str(e)}")

@app.post("/api/skill-gap/analyze", response_model=SkillGapResponse)
async def analyze_skill_gaps(request: SkillGapRequest):
    """Analyze skill gaps between resume and job description"""
    try:
        # Get skill gap analysis from Gemini
        analysis = gemini_service.analyze_skill_gap(
            request.resume_summary,
            request.job_description
        )
        
        return SkillGapResponse(
            missing_skills=analysis.get("missing_skills", []),
            recommendations=analysis.get("recommendations", []),
            additional_training=analysis.get("additional_training", [])
        )
    
    except Exception as e:
        logger.error(f"Skill gap analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Skill gap analysis failed: {str(e)}")

@app.post("/api/interview/questions", response_model=InterviewQuestionsResponse)
async def create_interview(request: InterviewQuestionRequest):
    """Generate interview questions based on job description"""
    try:
        questions = gemini_service.generate_interview_questions(
            request.job_description,
            request.num_questions
        )
        return {"questions": questions}
    
    except Exception as e:
        logger.error(f"Generate interview questions error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Question generation failed: {str(e)}")

# ==================== PROFILE MANAGEMENT ====================

@app.post("/api/profile/update", response_model=ProfileUpdateResponse)
async def update_profile(request: ProfileUpdateRequest):
    """Update user profile with basic information"""
    try:
        updated_profile = save_profile(request)
        
        return ProfileUpdateResponse(
            user_id=request.user_id,
            profile=updated_profile,
            message="Profile updated successfully"
        )
    
    except Exception as e:
        logger.error(f"Profile update error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Profile update failed: {str(e)}")

@app.post("/api/profile/complete", response_model=CompleteProfileResponse)
async def complete_profile(request: CompleteProfileRequest):
    """Complete user profile with all details"""
    try:
        updated_profile = save_profile(request)
        
        next_steps = [
            "Take a domain-specific quiz to assess your aptitude",
            "Get personalized career predictions",
            "Explore course recommendations",
            "Generate your learning roadmap"
        ]
        
        return CompleteProfileResponse(
            user_id=request.user_id,
            profile=updated_profile,
            message="Profile completed successfully",
            next_steps=next_steps
        )
    
    except Exception as e:
        logger.error(f"Profile completion error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Profile completion failed: {str(e)}")

@app.get("/api/profile/{user_id}")
async def get_user_profile(user_id: str):
    """Get user profile data"""
    try:
        profile = get_profile(user_id)
        
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        return {
            "user_id": user_id,
            "profile": profile
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get profile error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get profile: {str(e)}")



@app.post("/api/chatbot")
async def chatbot(request: ChatRequest):
    """General chatbot for career guidance queries"""
    try:
        response_text = gemini_service.generate_response(request.text)
        return {"response": response_text}
    
    except Exception as e:
        logger.error(f"Chatbot error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Chatbot failed: {str(e)}")

@app.post("/api/recommend_skills")
async def recommend_skills(request: SkillRecommendationRequest):
    """Recommend skills for a specific job"""
    try:
        skills = gemini_service.recommend_skills(request.job_name)
        return {"skills": skills}
    
    except Exception as e:
        logger.error(f"Skill recommendation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Skill recommendation failed: {str(e)}")



@app.get("/career_guidance/stages")
async def get_career_guidance_stages():
    """Get all available career guidance stages"""
    return {
        "stages": {
            "after_10th": {
                "title": "After 10th Grade",
                "description": "Choose your stream and plan your 11th-12th path",
                "endpoint": "/career_guidance/after_10th/"
            },
            "after_12th": {
                "title": "After 12th Grade",
                "description": "Explore college and career options",
                "endpoint": "/career_guidance/after_12th/"
            },
            "after_btech": {
                "title": "After B.Tech",
                "description": "Industry vs higher studies guidance",
                "endpoint": "/career_guidance/after_btech/"
            },
            "abroad_studies": {
                "title": "Study Abroad",
                "description": "International education planning",
                "endpoint": "/career_guidance/abroad_studies/"
            }
        },
        "message": "Select your education stage for personalized career guidance"
    }

@app.get("/career_guidance/after_10th/streams")
async def get_after_10th_streams():
    """Get all available streams after 10th grade"""
    return {
        "streams": Config.AFTER_10TH_STREAMS,
        "message": "Available streams after 10th grade"
    }

@app.post("/career_guidance/after_10th/")
async def career_guidance_after_10th(request: AfterTenthRequest):
    """Provide detailed career guidance for selected stream after 10th"""
    try:
        if not request.selected_stream or request.selected_stream not in Config.AFTER_10TH_STREAMS:
            raise HTTPException(status_code=400, detail="Please select a valid stream")
        
        stream_data = Config.AFTER_10TH_STREAMS[request.selected_stream]
        
        # Get personalized roadmap from Gemini
        roadmap = gemini_service.career_guidance_after_10th(
            request.selected_stream,
            request.interests,
            stream_data
        )
        
        return {
            "stream_info": stream_data,
            "personalized_roadmap": roadmap,
            "selected_stream": request.selected_stream
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"After 10th guidance error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Career guidance failed: {str(e)}")

@app.post("/career_guidance/after_12th/")
async def career_guidance_after_12th(request: AfterTwelfthRequest):
    """Provide career guidance for 12th grade students"""
    try:
        roadmap = gemini_service.career_guidance_after_12th(
            request.stream,
            request.interests,
            request.preferred_field
        )
        
        return {
            "roadmap": roadmap,
            "stream": request.stream,
            "interests": ", ".join(request.interests)
        }
    
    except Exception as e:
        logger.error(f"After 12th guidance error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Career guidance failed: {str(e)}")

@app.post("/career_guidance/after_btech/")
async def career_guidance_after_btech(request: CareerGuidanceRequest):
    """Provide career guidance for B.Tech graduates"""
    try:
        roadmap = gemini_service.career_guidance_after_btech(
            request.skills,
            request.interests
        )
        
        return {
            "roadmap": roadmap,
            "skills": ", ".join(request.skills),
            "interests": ", ".join(request.interests),
            "level": "B.Tech Graduate"
        }
    
    except Exception as e:
        logger.error(f"After B.Tech guidance error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Career guidance failed: {str(e)}")

@app.post("/career_guidance/abroad_studies/")
async def career_guidance_abroad_studies(request: AbroadStudiesRequest):
    """Provide guidance for studying abroad"""
    try:
        roadmap = gemini_service.career_guidance_abroad_studies(
            request.current_education_level,
            request.target_country,
            request.field_of_interest,
            request.budget_range
        )
        
        return {
            "roadmap": roadmap,
            "current_level": request.current_education_level,
            "target_country": request.target_country,
            "field": request.field_of_interest,
            "budget": request.budget_range
        }
    
    except Exception as e:
        logger.error(f"Abroad studies guidance error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Career guidance failed: {str(e)}")

# Legacy endpoint for backward compatibility
@app.post("/career_guidance/")
async def career_guidance(request: CareerGuidanceRequest):
    """Legacy career guidance endpoint - redirects to after_btech"""
    return await career_guidance_after_btech(request)

# ==================== NEW: QUIZ SYSTEM ====================

@app.post("/api/quiz/generate", response_model=QuizGenerateResponse)
async def generate_quiz(request: QuizGenerateRequest):
    """Generate a domain-specific quiz"""
    try:
        # Generate quiz ID
        quiz_id = quiz_service.generate_quiz_id()
        
        # Generate questions using Gemini
        questions = gemini_service.generate_quiz(
            domain=request.domain,
            num_questions=request.num_questions,
            difficulty=request.difficulty
        )
        
        # Save quiz
        quiz_service.save_quiz(quiz_id, request.domain, questions)
        
        return QuizGenerateResponse(
            quiz_id=quiz_id,
            domain=request.domain,
            questions=questions,
            total_questions=len(questions)
        )
    
    except Exception as e:
        logger.error(f"Quiz generation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Quiz generation failed: {str(e)}")

@app.post("/api/quiz/submit", response_model=QuizSubmitResponse)
async def submit_quiz(request: QuizSubmitRequest):
    """Submit quiz answers and get detailed feedback"""
    try:
        # Get the quiz
        quiz_data = quiz_service.get_quiz(request.quiz_id)

        if not quiz_data:
            raise HTTPException(status_code=404, detail="Quiz not found")

        questions = quiz_data['questions']

        # Convert Pydantic models to dictionaries
        answers_dict = [answer.dict() for answer in request.answers]

        # Evaluate quiz
        evaluation_result = quiz_service.evaluate_quiz(request.quiz_id, answers_dict)

        # Get detailed feedback from Gemini
        gemini_analysis = gemini_service.analyze_quiz_responses(questions, answers_dict)
        
        # Prepare detailed feedback
        detailed_feedback = []
        for q_feedback in evaluation_result['question_feedback']:
            # Find corresponding Gemini feedback
            gemini_q_feedback = next(
                (gf for gf in gemini_analysis.get('question_feedback', []) 
                 if gf['question_id'] == q_feedback['question_id']),
                {}
            )
            
            detailed_feedback.append({
                'question_id': q_feedback['question_id'],
                'question': q_feedback['question'],
                'correct_answer': q_feedback['correct_answer'],
                'user_answer': q_feedback['user_answer'],
                'is_correct': q_feedback['is_correct'],
                'explanation': gemini_q_feedback.get('explanation', 'No explanation available'),
            })
        
        # Save quiz result
        quiz_service.save_quiz_result(request.user_id, request.quiz_id, evaluation_result)
        
        return QuizSubmitResponse(
            quiz_id=request.quiz_id,
            user_id=request.user_id,
            score=evaluation_result['score'],
            total_questions=evaluation_result['total_questions'],
            correct_answers=evaluation_result['correct_answers'],
            wrong_answers=evaluation_result['wrong_answers'],
            performance_percentage=evaluation_result['performance_percentage'],
            feedback=detailed_feedback,
            overall_feedback=gemini_analysis.get('overall_feedback', 'Good effort!')
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Quiz submission error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Quiz submission failed: {str(e)}")



@app.post("/api/career/predict", response_model=CareerPredictResponse)
async def predict_careers(request: CareerPredictRequest):
    """Predict top careers with confidence scores based on user profile"""
    try:
        # Convert user profile to dict
        profile_dict = request.user_profile.dict()
        
        # Get career predictions from Gemini
        prediction = gemini_service.predict_careers_with_confidence(
            profile_dict,
            request.top_n
        )
        
        return CareerPredictResponse(
            user_id=request.user_profile.user_id,
            careers=prediction.get('top_careers', []),
            summary=prediction.get('recommendations', '')
        )
    
    except Exception as e:
        logger.error(f"Career prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Career prediction failed: {str(e)}")

# ==================== NEW: COURSE RECOMMENDATIONS ====================

@app.post("/api/courses/recommend", response_model=CourseRecommendResponse)
async def recommend_courses(request: CourseRecommendRequest):
    """Get YouTube course recommendations for a career"""
    try:
        # Search for courses on YouTube
        search_query = f"{request.career_choice} {request.skill_level} tutorial course"
        result = youtube_service.search_courses(search_query, request.max_results)
        
        if not result['success']:
            raise HTTPException(status_code=500, detail=result.get('message', 'Course search failed'))
        
        # Format courses
        courses = []
        for course in result['courses']:
            courses.append({
                'video_id': course['video_id'],
                'title': course['title'],
                'description': course['description'],
                'thumbnail': course['thumbnail'],
                'channel_name': course['channel_name'],
                'duration': course['duration'],
                'view_count': course['view_count'],
                'url': course['url']
            })
        
        return CourseRecommendResponse(
            career_choice=request.career_choice,
            courses=courses,
            total_results=len(courses)
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Course recommendation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Course recommendation failed: {str(e)}")

# ==================== NEW: LEARNING ROADMAP ====================

@app.post("/api/roadmap/generate", response_model=RoadmapResponse)
async def generate_roadmap(request: RoadmapRequest):
    """Generate a structured learning roadmap"""
    try:
        # Generate roadmap using Gemini
        roadmap = gemini_service.generate_structured_roadmap(
            request.target_career,
            request.current_skills,
            request.time_commitment,
            request.learning_style
        )
        
        return RoadmapResponse(
            target_career=request.target_career,
            total_duration=roadmap.get('total_duration', request.time_commitment),
            phases=roadmap.get('phases', []),
            final_outcome=roadmap.get('final_outcome', ''),
            additional_tips=roadmap.get('additional_tips', [])
        )
    
    except Exception as e:
        logger.error(f"Roadmap generation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Roadmap generation failed: {str(e)}")

# ==================== RUN APPLICATION ====================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)