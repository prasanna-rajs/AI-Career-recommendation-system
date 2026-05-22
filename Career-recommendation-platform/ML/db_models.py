"""
SQLAlchemy database models
"""
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey, JSON, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    """User model for authentication and profile"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)

    # Profile information
    age = Column(Integer)
    education_level = Column(String)  # 10th, 12th, Undergraduate, Postgraduate
    stream = Column(String)  # MPC, BiPC, Commerce, etc.
    marks_12th = Column(Float)
    college_name = Column(String)
    cgpa = Column(Float)

    # Additional profile data stored as JSON
    interests = Column(JSON)  # List of interests
    skills = Column(JSON)  # Dict of {skill: proficiency_level}
    domain_preference = Column(String)

    # Professional information
    experience_years = Column(Float, default=0)
    current_ctc = Column(Float)
    expected_ctc = Column(Float)
    location_preference = Column(String)

    # Career guidance data
    career_predictions = Column(JSON)  # Stored career prediction results

    # Account metadata
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    quiz_results = relationship("QuizResult", back_populates="user")
    resumes = relationship("Resume", back_populates="user")


class College(Base):
    """College model for recommendations"""
    __tablename__ = "colleges"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    location = Column(String)
    state = Column(String, index=True)
    city = Column(String, index=True)

    # College details
    college_type = Column(String)  # Government, Private, Deemed
    affiliation = Column(String)  # Autonomous, Affiliated to XYZ University
    nirf_ranking = Column(Integer)

    # Programs and eligibility
    programs_offered = Column(JSON)  # List of programs: ["B.Tech CSE", "B.Tech ECE", etc.]
    entrance_exams = Column(JSON)  # ["JEE Main", "JEE Advanced", "State CET"]
    min_percentile = Column(Float)  # Minimum percentile required

    # Fees and placements
    avg_fees_per_year = Column(Float)
    avg_placement_package = Column(Float)  # in LPA
    highest_placement = Column(Float)  # in LPA
    placement_percentage = Column(Float)

    # Additional information
    facilities = Column(JSON)  # ["Library", "Hostel", "Sports Complex"]
    website = Column(String)
    description = Column(Text)

    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class QuizResult(Base):
    """Quiz results model"""
    __tablename__ = "quiz_results"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Quiz information
    quiz_id = Column(String, index=True)
    domain = Column(String, index=True)
    difficulty = Column(String)  # easy, medium, hard

    # Results
    total_questions = Column(Integer)
    correct_answers = Column(Integer)
    wrong_answers = Column(Integer)
    score_percentage = Column(Float)

    # Detailed data stored as JSON
    questions_data = Column(JSON)  # Full quiz questions
    user_answers = Column(JSON)  # User's responses
    feedback = Column(JSON)  # Per-question feedback

    # Performance analysis
    performance_summary = Column(Text)
    strengths = Column(JSON)
    weaknesses = Column(JSON)

    # Timing
    time_taken_seconds = Column(Integer)
    completed_at = Column(DateTime, default=datetime.utcnow)

    # Relationship
    user = relationship("User", back_populates="quiz_results")


class Resume(Base):
    """Resume storage and analysis"""
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # File information
    filename = Column(String)
    file_path = Column(String)
    file_type = Column(String)  # pdf, docx, doc

    # Extracted content
    raw_text = Column(Text)
    extracted_skills = Column(JSON)

    # Analysis results
    analysis_result = Column(JSON)  # Full Gemini analysis
    strengths = Column(JSON)
    improvements = Column(JSON)

    # Job matching
    target_job_title = Column(String)
    match_score = Column(Float)
    match_analysis = Column(JSON)

    # Metadata
    is_primary = Column(Boolean, default=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    # Relationship
    user = relationship("User", back_populates="resumes")


class LearningRoadmap(Base):
    """Personalized learning roadmaps"""
    __tablename__ = "learning_roadmaps"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Roadmap details
    target_career = Column(String, nullable=False)
    current_skill_level = Column(String)  # Beginner, Intermediate, Advanced
    learning_style = Column(String)  # Self-paced, Structured, Intensive
    time_commitment = Column(String)  # 1-3 months, 3-6 months, 6-12 months

    # Roadmap content (stored as JSON)
    phases = Column(JSON)  # List of learning phases with resources
    milestones = Column(JSON)
    resources = Column(JSON)  # YouTube links, courses, books

    # Progress tracking
    current_phase = Column(Integer, default=0)
    completed_milestones = Column(JSON)
    progress_percentage = Column(Float, default=0.0)

    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
