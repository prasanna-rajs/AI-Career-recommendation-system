import os
import re
import json
import logging
import time
from pathlib import Path
from PyPDF2 import PdfReader
import docx
import numpy as np
from numpy.linalg import norm
from config import Config

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Cache the Doc2Vec model
# DOC2VEC_MODEL = None

# ==================== FILE PROCESSING ====================

def process_file(file_path):
    """Extract text from uploaded files (PDF, DOCX, TXT)"""
    file_extension = os.path.splitext(file_path)[1].lower()
    
    try:
        if file_extension == ".txt":
            with open(file_path, 'r', encoding='utf-8') as f:
                return f.read()
                
        elif file_extension == ".pdf":
            pdf = PdfReader(file_path)
            text = ""
            for page in pdf.pages:
                text += page.extract_text()
            return text
            
        elif file_extension in [".docx", ".doc"]:
            doc = docx.Document(file_path)
            text = ""
            for para in doc.paragraphs:
                text += para.text + "\n"
            return text
            
        else:
            raise ValueError(f"Unsupported file type: {file_extension}")
            
    except Exception as e:
        logger.error(f"Error processing file {file_path}: {str(e)}")
        raise ValueError(f"Failed to process file: {str(e)}")

# ==================== TEXT PROCESSING ====================

def clean_text(text):
    """Optimized text cleaning function"""
    if not text:
        return ""
    
    text = text.lower()
    text = re.sub(r'[^a-z\s]', '', text)
    return ' '.join(text.split())

# ==================== DOC2VEC MODEL ====================

def load_doc2vec_model():
    """Load and cache the Doc2Vec model"""
    return None

def calculate_match(resume_summary, job_description):
    """Calculate match percentage using Doc2Vec model"""
    start_time = time.time()
    
    try:
        model = load_doc2vec_model()
        
        if model is None:
            logger.warning("Doc2Vec model not available, using fallback matching")
            return calculate_simple_match(resume_summary, job_description)
        
        # Clean texts
        resume_processed = clean_text(resume_summary)
        jd_processed = clean_text(job_description)
        
        # Vectorize
        v1 = model.infer_vector(resume_processed.split())
        v2 = model.infer_vector(jd_processed.split())
        
        # Calculate cosine similarity
        dot_product = np.dot(v1, v2)
        norm_product = norm(v1) * norm(v2)
        
        if norm_product == 0:
            return 0.0
        
        similarity = 100 * (dot_product / norm_product)
        
        logger.info(f"Matching completed in {time.time() - start_time:.2f} seconds")
        return round(float(similarity), 2)
        
    except Exception as e:
        logger.error(f"Match calculation error: {str(e)}")
        return calculate_simple_match(resume_summary, job_description)

def calculate_simple_match(resume_summary, job_description):
    """Fallback simple keyword matching if Doc2Vec fails"""
    try:
        resume_words = set(clean_text(resume_summary).split())
        jd_words = set(clean_text(job_description).split())
        
        if not jd_words:
            return 0.0
        
        common_words = resume_words.intersection(jd_words)
        match_percentage = (len(common_words) / len(jd_words)) * 100
        
        return round(float(match_percentage), 2)
    except Exception as e:
        logger.error(f"Simple match calculation error: {str(e)}")
        return 0.0

def get_match_recommendation(match_percentage):
    """Get recommendation based on match percentage"""
    if match_percentage < 50:
        return "Low match. Consider updating your resume to better align with the job requirements."
    elif 50 <= match_percentage < 70:
        return "Good match! You have a decent chance. Consider highlighting relevant skills more prominently."
    else:
        return "Excellent match! Your profile aligns well with the job requirements. You should definitely apply."

# ==================== PROFILE MANAGEMENT ====================

def save_profile(profile_data):
    """Save profile data to a JSON file"""
    try:
        # Ensure profiles directory exists
        profiles_dir = Path(Config.PROFILES_DIR)
        profiles_dir.mkdir(exist_ok=True)
        
        user_id = profile_data.user_id
        profile_path = profiles_dir / f"{user_id}.json"
        
        # Create or update profile
        if profile_path.exists():
            with open(profile_path, 'r') as f:
                existing_profile = json.load(f)
            
            # Update existing profile with new data
            for key, value in profile_data.dict().items():
                if value is not None and key != "user_id":
                    existing_profile[key] = value
            
            updated_profile = existing_profile
        else:
            # Create new profile
            updated_profile = {k: v for k, v in profile_data.dict().items() if v is not None}
        
        # Add timestamp
        updated_profile['last_updated'] = time.strftime("%Y-%m-%d %H:%M:%S")
        
        # Save profile
        with open(profile_path, 'w') as f:
            json.dump(updated_profile, f, indent=2)
        
        logger.info(f"Profile saved for user: {user_id}")
        return updated_profile
        
    except Exception as e:
        logger.error(f"Error saving profile: {str(e)}")
        raise ValueError(f"Failed to save profile: {str(e)}")

def get_profile(user_id):
    """Get profile data from JSON file"""
    try:
        profiles_dir = Path(Config.PROFILES_DIR)
        profile_path = profiles_dir / f"{user_id}.json"
        
        if not profile_path.exists():
            return {}
        
        with open(profile_path, 'r') as f:
            return json.load(f)
            
    except Exception as e:
        logger.error(f"Error getting profile: {str(e)}")
        return {}

# ==================== DIRECTORY INITIALIZATION ====================

def initialize_directories():
    """Create necessary directories if they don't exist"""
    directories = [
        Config.TEMP_DIR,
        Config.PROFILES_DIR,
        Config.RECORDINGS_DIR,
        Config.VIDEOS_DIR
    ]
    
    for directory in directories:
        Path(directory).mkdir(exist_ok=True)
        logger.info(f"Directory ensured: {directory}")

# ==================== JSON PARSING ====================

def extract_json_from_response(response_text):
    """Extract JSON from Gemini response that might have markdown or extra text"""
    try:
        # Try direct JSON parsing first
        return json.loads(response_text)
    except json.JSONDecodeError:
        pass

    # Try to find JSON within the text
    try:
        # Remove markdown code blocks
        response_text = re.sub(r'```json|```', '', response_text).strip()

        # Use JSONDecoder to parse JSON and ignore trailing content
        decoder = json.JSONDecoder()

        # Find which comes first: array or object
        array_start = response_text.find('[')
        obj_start = response_text.find('{')

        # Try the one that appears first in the response
        if array_start != -1 and (obj_start == -1 or array_start < obj_start):
            # Array comes first
            try:
                obj, idx = decoder.raw_decode(response_text, array_start)
                return obj
            except json.JSONDecodeError:
                pass
            # If array fails, try object
            if obj_start != -1:
                try:
                    obj, idx = decoder.raw_decode(response_text, obj_start)
                    return obj
                except json.JSONDecodeError:
                    pass
        elif obj_start != -1:
            # Object comes first (or only object exists)
            try:
                obj, idx = decoder.raw_decode(response_text, obj_start)
                return obj
            except json.JSONDecodeError:
                pass
            # If object fails, try array
            if array_start != -1:
                try:
                    obj, idx = decoder.raw_decode(response_text, array_start)
                    return obj
                except json.JSONDecodeError:
                    pass

        # Fallback: Try regex with non-greedy matching for arrays
        json_match = re.search(r'(\[[\s\S]*?\])', response_text)
        if json_match:
            try:
                return json.loads(json_match.group(1))
            except json.JSONDecodeError:
                # Try greedy match as last resort
                json_match = re.search(r'(\[[\s\S]*\])', response_text)
                if json_match:
                    return json.loads(json_match.group(1))

        # Fallback: Try regex for objects
        json_match = re.search(r'({[\s\S]*?})', response_text)
        if json_match:
            try:
                return json.loads(json_match.group(1))
            except json.JSONDecodeError:
                pass

    except Exception as e:
        logger.error(f"Failed to extract JSON: {str(e)}")
        logger.error(f"Response text: {response_text[:500]}...")

    raise ValueError("Could not extract valid JSON from response")

# ==================== GEMINI RESPONSE EXTRACTION ====================

def extract_text_from_gemini_response(response):
    """Extract text from various Gemini response formats"""
    try:
        if hasattr(response, 'parts') and response.parts:
            return response.parts[0].text
        elif hasattr(response, 'text'):
            return response.text
        elif hasattr(response, 'candidates') and response.candidates:
            return response.candidates[0].content.parts[0].text
        else:
            return str(response)
    except Exception as e:
        logger.error(f"Error extracting text from Gemini response: {str(e)}")
        return str(response)