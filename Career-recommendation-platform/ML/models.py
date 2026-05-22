from pydantic import BaseModel
from typing import List, Optional, Dict, Any


class ResumeAnalysisResponse(BaseModel):
    summary: dict
    skills: List[str]

class JobMatchRequest(BaseModel):
    resume_summary: str
    job_description: str

class JobMatchResponse(BaseModel):
    match_percentage: float
    recommendation: str

class InterviewQuestionRequest(BaseModel):
    job_description: str
    num_questions: Optional[int] = 10

class InterviewQuestion(BaseModel):
    question: str
    category: str

class InterviewQuestionsResponse(BaseModel):
    questions: List[InterviewQuestion]

class InterviewResponseConfig(BaseModel):
    question: str
    max_duration: int = 60
    sample_rate: int = 44100
    channels: int = 1

class InterviewEvaluationResult(BaseModel):
    question: str
    transcription: str
    evaluation: dict
    relevance_score: float
    clarity_score: float
    confidence_score: float
    overall_score: float

class VideoTimestamp(BaseModel):
    timestamp: str
    text: str
    visuals: str
    emotion: str

class VideoAnalysisResult(BaseModel):
    timestamps: List[VideoTimestamp]
    overall_emotion: str
    transcription: str
    confidence_score: float
    clarity_score: float
    relevance_score: float
    vocal_quality_score: float
    overall_score: float

class SkillGapRequest(BaseModel):
    resume_summary: str
    job_description: str

class SkillGapResponse(BaseModel):
    missing_skills: List[str]
    recommendations: List[str]
    additional_training: List[str]

class ProfileUpdateRequest(BaseModel):
    user_id: str
    age: Optional[int] = None
    years_of_experience: Optional[float] = None
    notice_period_days: Optional[int] = None
    current_ctc: Optional[float] = None
    expected_ctc: Optional[float] = None
    preferred_location: Optional[str] = None
    willing_to_relocate: Optional[bool] = None

class ProfileUpdateResponse(BaseModel):
    user_id: str
    profile: Dict[str, Any]
    message: str

# ==================== FROM CODE 2: CAREER GUIDANCE MODELS ====================

class ChatRequest(BaseModel):
    text: str

class SkillRecommendationRequest(BaseModel):
    job_name: str

class CareerGuidanceRequest(BaseModel):
    skills: list
    interests: list

class AfterTenthRequest(BaseModel):
    selected_stream: str = None
    interests: list = []

class AfterTwelfthRequest(BaseModel):
    stream: str
    interests: list
    preferred_field: str = None

class AbroadStudiesRequest(BaseModel):
    current_education_level: str
    target_country: str = None
    field_of_interest: str
    budget_range: str = None

# ==================== NEW MODELS: QUIZ SYSTEM ====================

class QuizGenerateRequest(BaseModel):
    domain: str
    num_questions: Optional[int] = 10
    difficulty: Optional[str] = "medium"  # easy, medium, hard

class QuizQuestion(BaseModel):
    question_id: int
    question: str
    options: List[str]
    correct_answer: str
    category: str
    difficulty: str

class QuizGenerateResponse(BaseModel):
    quiz_id: str
    domain: str
    questions: List[QuizQuestion]
    total_questions: int

class QuizAnswer(BaseModel):
    question_id: int
    selected_answer: str

class QuizSubmitRequest(BaseModel):
    quiz_id: str
    user_id: str
    answers: List[QuizAnswer]

class QuestionFeedback(BaseModel):
    question_id: int
    question: str
    correct_answer: str
    user_answer: str
    is_correct: bool
    explanation: str

class QuizSubmitResponse(BaseModel):
    quiz_id: str
    user_id: str
    score: float
    total_questions: int
    correct_answers: int
    wrong_answers: int
    performance_percentage: float
    feedback: List[QuestionFeedback]
    overall_feedback: str

# ==================== NEW MODELS: CAREER PREDICTION ====================

class UserProfile(BaseModel):
    user_id: str
    age: int
    education_level: str
    stream: Optional[str] = None
    marks_12th: Optional[float] = None
    college_name: Optional[str] = None
    cgpa: Optional[float] = None
    skills: List[str]
    interests: List[str]
    quiz_score: Optional[float] = None

class CareerOption(BaseModel):
    career_title: str
    confidence: float
    description: str
    required_skills: List[str]
    salary_range: str
    growth_prospects: str
    reasons: List[str]

class CareerPredictRequest(BaseModel):
    user_profile: UserProfile
    top_n: Optional[int] = 3

class CareerPredictResponse(BaseModel):
    user_id: str
    careers: List[CareerOption]
    summary: str

# ==================== NEW MODELS: COURSE RECOMMENDATIONS ====================

class CourseRecommendRequest(BaseModel):
    career_choice: str
    skill_level: Optional[str] = "beginner"  # beginner, intermediate, advanced
    max_results: Optional[int] = 10

class CourseVideo(BaseModel):
    video_id: str
    title: str
    description: str
    thumbnail: str
    channel_name: str
    duration: str
    view_count: str
    url: str

class CourseRecommendResponse(BaseModel):
    career_choice: str
    courses: List[CourseVideo]
    total_results: int

# ==================== NEW MODELS: LEARNING ROADMAP ====================

class RoadmapRequest(BaseModel):
    target_career: str
    current_skills: List[str]
    time_commitment: Optional[str] = "3-6 months"  # 1-3 months, 3-6 months, 6-12 months
    learning_style: Optional[str] = "self-paced"  # self-paced, structured, intensive

class LearningPhase(BaseModel):
    phase_number: int
    phase_name: str
    duration: str
    topics: List[str]
    resources: List[str]
    milestones: List[str]

class RoadmapResponse(BaseModel):
    target_career: str
    total_duration: str
    phases: List[LearningPhase]
    final_outcome: str
    additional_tips: List[str]

# ==================== ENHANCED MODELS: PROFILE WITH CAREER DATA ====================

class CompleteProfileRequest(BaseModel):
    user_id: str
    # Basic Info
    age: int
    education_level: str
    stream: Optional[str] = None
    marks_12th: Optional[float] = None
    college_name: Optional[str] = None
    cgpa: Optional[float] = None
    
    # Skills & Interests
    skills: List[str]
    skill_proficiency: Optional[Dict[str, str]] = None  # {"Python": "intermediate", ...}
    interests: List[str]
    
    # Career Preferences
    preferred_domain: Optional[str] = None
    career_goals: Optional[str] = None
    
    # Professional Info (optional)
    years_of_experience: Optional[float] = None
    current_ctc: Optional[float] = None
    expected_ctc: Optional[float] = None
    preferred_location: Optional[str] = None
    willing_to_relocate: Optional[bool] = None

class CompleteProfileResponse(BaseModel):
    user_id: str
    profile: Dict[str, Any]
    message: str
    next_steps: List[str]