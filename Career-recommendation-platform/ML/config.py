import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    """Configuration class for the application"""
    
    # API Keys
    GEMINI_API_KEY = os.getenv("GOOGLE_API_KEY")
    YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
    
    # Gemini Model Configuration
    GEMINI_MODEL = "gemini-2.5-flash-lite"
    
    # Database
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./career_guidance.db")
    
    # Secret Key
    SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-this-in-production")
    
    # Environment
    ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
    
    # Domains for Career Guidance (from Code 2)
    DOMAINS = [
        "Information Technology",
        "Healthcare & Medicine",
        "Design & Creative Arts",
        "Engineering",
        "Business & Management",
        "Finance & Accounting",
        "Marketing & Sales",
        "Education & Teaching",
        "Law & Legal Services",
        "Science & Research",
        "Agriculture",
        "Hospitality & Tourism"
    ]
    
    # Subtitle Languages (from Code 1 - if needed)
    SUBTITLE_LANGUAGES = {
        'en': 'English',
        'hi': 'Hindi',
        'ta': 'Tamil',
        'te': 'Telugu'
    }
    
    # Career Streams after 10th (from Code 2)
    AFTER_10TH_STREAMS = {
        "MPC": {
            "full_name": "Mathematics, Physics, Chemistry",
            "description": "Science stream focusing on engineering and technical fields",
            "career_paths": [
                "Engineering (B.Tech/B.E) in various specializations",
                "Architecture (B.Arch)",
                "Pure Sciences (B.Sc Physics, Chemistry, Mathematics)",
                "Pharmacy (B.Pharma)",
                "Computer Applications (BCA)",
                "Aviation (Pilot training, Aircraft Engineering)"
            ],
            "top_colleges": ["IITs", "NITs", "BITS Pilani", "VIT", "SRM"],
            "entrance_exams": ["JEE Main", "JEE Advanced", "BITSAT", "VITEEE"],
            "skills_required": ["Analytical thinking", "Problem-solving", "Mathematics proficiency", "Logical reasoning"]
        },
        "BiPC": {
            "full_name": "Biology, Physics, Chemistry",
            "description": "Science stream focusing on medical and life sciences",
            "career_paths": [
                "Medicine (MBBS)",
                "Dental (BDS)",
                "Pharmacy (B.Pharma, D.Pharma)",
                "Nursing (B.Sc Nursing)",
                "Physiotherapy (BPT)",
                "Biotechnology (B.Tech Biotech)",
                "Life Sciences (B.Sc Botany, Zoology, Microbiology)"
            ],
            "top_colleges": ["AIIMS", "JIPMER", "CMC Vellore", "MAMC", "Grant Medical College"],
            "entrance_exams": ["NEET", "AIIMS MBBS", "JIPMER", "State Medical Entrance Exams"],
            "skills_required": ["Memory retention", "Attention to detail", "Empathy", "Scientific temperament"]
        },
        "Commerce": {
            "full_name": "Commerce Stream",
            "description": "Business and finance oriented stream",
            "career_paths": [
                "Chartered Accountancy (CA)",
                "Company Secretary (CS)", 
                "Cost and Management Accountancy (CMA)",
                "Bachelor of Commerce (B.Com)",
                "Business Administration (BBA)",
                "Economics (B.A Economics)",
                "Law (B.A LLB, BBA LLB)"
            ],
            "top_colleges": ["SRCC", "LSR", "Hindu College", "Christ University", "Symbiosis"],
            "entrance_exams": ["CLAT", "DU JAT", "IPU CET", "SET", "NPAT"],
            "skills_required": ["Numerical ability", "Communication", "Analytical skills", "Business acumen"]
        },
        "Diploma": {
            "full_name": "Diploma Courses",
            "description": "Technical and vocational training programs",
            "career_paths": [
                "Mechanical Engineering Diploma",
                "Civil Engineering Diploma", 
                "Electrical Engineering Diploma",
                "Computer Engineering Diploma",
                "Hotel Management Diploma",
                "Fashion Designing Diploma",
                "Automobile Engineering Diploma"
            ],
            "top_colleges": ["Government Polytechnics", "NITTTR", "Private Polytechnics"],
            "entrance_exams": ["State Polytechnic Entrance Tests", "JEECUP"],
            "skills_required": ["Practical skills", "Technical aptitude", "Hands-on learning", "Problem-solving"]
        },
        "Arts": {
            "full_name": "Arts/Humanities Stream", 
            "description": "Liberal arts focusing on languages, social sciences, and creative fields",
            "career_paths": [
                "Psychology (B.A Psychology)",
                "Journalism and Mass Communication",
                "History, Political Science, Sociology",
                "Literature and Languages",
                "Fine Arts (B.F.A)",
                "Law (B.A LLB)",
                "Social Work (BSW)"
            ],
            "top_colleges": ["JNU", "DU", "BHU", "Jamia Millia", "Presidency College"],
            "entrance_exams": ["DUET", "JNU Entrance", "BHU UET", "CLAT"],
            "skills_required": ["Critical thinking", "Communication", "Creativity", "Research skills"]
        },
        "Agriculture": {
            "full_name": "Agriculture Stream",
            "description": "Focus on agricultural sciences and farming technologies",
            "career_paths": [
                "Agriculture Engineering (B.Tech Ag)",
                "Agriculture Sciences (B.Sc Agriculture)",
                "Horticulture (B.Sc Horticulture)",
                "Forestry (B.Sc Forestry)",
                "Food Technology (B.Tech Food Tech)",
                "Veterinary Science (B.V.Sc)"
            ],
            "top_colleges": ["Indian Agricultural Research Institute", "Tamil Nadu Agricultural University", "Punjab Agricultural University"],
            "entrance_exams": ["ICAR AIEEA", "State Agriculture Entrance Exams"],
            "skills_required": ["Environmental awareness", "Scientific approach", "Practical knowledge", "Innovation"]
        }
    }
    
    # File Upload Settings
    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
    ALLOWED_EXTENSIONS = {'.pdf', '.docx', '.doc', '.txt'}
    TEMP_DIR = "temp_files"
    PROFILES_DIR = "profiles"
    RECORDINGS_DIR = "recordings"
    VIDEOS_DIR = "videos"