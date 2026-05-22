import logging
from utils import process_file, clean_text, calculate_match, extract_json_from_response, extract_text_from_gemini_response

logger = logging.getLogger(__name__)

class ResumeService:
    """Service for resume processing and analysis"""
    
    @staticmethod
    def extract_text_from_file(file_path):
        """Extract text from resume file"""
        return process_file(file_path)
    
    @staticmethod
    def clean_resume_text(text):
        """Clean resume text"""
        return clean_text(text)
    
    @staticmethod
    def calculate_resume_jd_match(resume_summary, job_description):
        """Calculate match percentage between resume and JD"""
        return calculate_match(resume_summary, job_description)