from google import genai
from config import Config
import json
import re
import logging
from utils import extract_json_from_response, extract_text_from_gemini_response

logger = logging.getLogger(__name__)

class GeminiService:
    
    def __init__(self):
        """Initialize Gemini service with API key"""
        if Config.GEMINI_API_KEY:
            self.client = genai.Client(api_key=Config.GEMINI_API_KEY)
        else:
            logger.error("Gemini API key not configured!")
            self.client = None
    
    def _generate_content(self, prompt):
        """Internal method to generate content using Gemini"""
        if not self.client:
            raise ValueError("Gemini client not initialized. Check your API key.")
        
        try:
            response = self.client.models.generate_content(
                model=Config.GEMINI_MODEL,
                contents=prompt
            )
            return extract_text_from_gemini_response(response)
        except Exception as e:
            logger.error(f"Gemini API error: {str(e)}")
            raise ValueError(f"Failed to generate content: {str(e)}")
    
    # ==================== FROM CODE 3: RESUME ANALYSIS ====================
    
    def analyze_resume(self, resume_text):
        """Analyze resume text using Gemini"""
        prompt = f"""
        Analyze the following resume and provide a detailed summary that can be used for job matching:
        
        {resume_text}
        
        Provide a detailed analysis in JSON format with the following structure:
        {{
            "summary": "A comprehensive summary of the candidate's background, skills, experience, and qualifications that would be relevant for job matching.",
            "education": [
                {{"degree": "", "institution": "", "year": ""}}
            ],
            "work_experience": [
                {{"title": "", "company": "", "duration": "", "responsibilities": []}}
            ],
            "technical_skills": [],
            "soft_skills": [],
            "certifications": [],
            "projects": [
                {{"title": "", "description": "", "technologies": []}}
            ],
            "key_skills": []
        }}
        
        Return only valid JSON with no additional text.
        """
        
        try:
            response_text = self._generate_content(prompt)
            analysis_json = extract_json_from_response(response_text)
            return analysis_json
        except Exception as e:
            logger.error(f"Resume analysis error: {str(e)}")
            raise ValueError(f"Failed to analyze resume: {str(e)}")
    
    # ==================== FROM CODE 3: SKILL GAP ANALYSIS ====================
    
    def analyze_skill_gap(self, resume_summary, job_description):
        """Analyze skill gap between resume and job description"""
        prompt = f"""
        Compare this resume summary:
        
        {resume_summary}
        
        With this job description:
        
        {job_description}
        
        Identify the skill gaps and provide recommendations for the candidate.
        
        Return ONLY a valid JSON object with the following structure:
        {{
            "missing_skills": ["List of skills mentioned in the job description but not found in the resume", "Include both technical and soft skills"],
            "recommendations": ["Specific recommendations for how the candidate can address the skill gaps", "Provide at least 3 actionable recommendations"],
            "additional_training": ["Suggested courses, certifications, or experiences that would help bridge the gaps", "Provide at least 2 specific training options"]
        }}
        
        Ensure the response is strictly valid JSON format with no additional text.
        """
        
        try:
            response_text = self._generate_content(prompt)
            analysis = extract_json_from_response(response_text)
            return analysis
        except Exception as e:
            logger.error(f"Skill gap analysis error: {str(e)}")
            raise ValueError(f"Failed to analyze skill gap: {str(e)}")
    
    # ==================== FROM CODE 3: INTERVIEW QUESTIONS ====================
    
    def generate_interview_questions(self, job_description, num_questions=10):
        """Generate interview questions based on job description"""
        prompt = f"""
        Generate {num_questions} HR interview questions based on this job description:
        
        {job_description}
        
        Include a mix of:
        - Behavioral questions
        - Cultural fit questions
        - Experience-related questions
        - Motivation questions
        - Technical questions (if applicable)
        
        Return ONLY a valid JSON array with structure:
        [{{"question": "...", "category": "..."}}]

        Do not include any additional text, only return the valid JSON array.
        """
        
        try:
            response_text = self._generate_content(prompt)
            questions = extract_json_from_response(response_text)
            return questions
        except Exception as e:
            logger.error(f"Generate interview questions error: {str(e)}")
            raise ValueError(f"Failed to generate interview questions: {str(e)}")
    
    # ==================== FROM CODE 2: CAREER GUIDANCE ====================
    
    def generate_response(self, text: str):
        """Generate a chatbot response for general queries"""
        prompt = f'''You are a helpful mentor chatbot. Respond to the following in a supportive, educational, and engaging way: {text}'''
        
        try:
            response_text = self._generate_content(prompt)
            return response_text if response_text else "I'm here to help! Could you rephrase your question?"
        except Exception as e:
            logger.error(f"Error in generate_response: {e}")
            return "I encountered a technical issue, but I'm here to help. Could you ask your question again?"
    
    def recommend_skills(self, job_name: str):
        """Recommend skills for a specific job"""
        prompt = f"List the most important skills required for the job of {job_name}. Return the skills in a comma-separated list."
        
        try:
            response_text = self._generate_content(prompt)
            skills = response_text.strip().replace("\n", ", ") if response_text else "Problem solving, Communication, Technical skills, Teamwork, Adaptability"
            return skills
        except Exception as e:
            logger.error(f"Error in recommend_skills: {e}")
            return "Problem solving, Communication, Technical skills"
    
    def career_guidance_after_10th(self, selected_stream: str, interests: list, stream_data: dict):
        """Provide career guidance after 10th grade"""
        interests_str = ", ".join(interests) if interests else "general career growth"
        
        prompt = f"""
        Provide detailed career guidance for a 10th grade student who wants to pursue {stream_data['full_name']} stream.
        
        Stream: {selected_stream} - {stream_data['description']}
        Student's interests: {interests_str}
        
        Include:
        1. Why this stream is good for their interests
        2. Detailed explanation of what they'll study in 11th-12th
        3. Step-by-step roadmap from 11th grade to career
        4. Skills to develop during 11th-12th
        5. Preparation strategies for entrance exams
        6. Alternative career paths within this stream
        7. Industry trends and future scope
        
        Make it comprehensive but easy to understand for a 16-year-old student. Use plain text, no markdown formatting.
        """
        
        try:
            roadmap = self._generate_content(prompt)
            return roadmap if roadmap else f"Focus on {stream_data['full_name']} subjects and develop strong fundamentals."
        except Exception as e:
            logger.error(f"Error in after_10th career_guidance: {e}")
            return f"Focus on building strong fundamentals in {stream_data['full_name']} and explore the career opportunities in this field."
    
    def career_guidance_after_12th(self, stream: str, interests: list, preferred_field: str):
        """Provide career guidance after 12th grade"""
        interests_str = ", ".join(interests)
        
        prompt = f"""
        Provide comprehensive career guidance for a 12th grade student.
        
        Stream: {stream}
        Interests: {interests_str}
        Preferred Field: {preferred_field or "Open to explore"}
        
        Provide guidance on:
        1. Best career options based on their stream and interests
        2. Undergraduate courses they should consider
        3. Entrance exams to prepare for
        4. Skills to develop during gap year or college prep
        5. Industry insights and job market trends
        6. Salary expectations and growth prospects
        7. Alternative paths like entrepreneurship, freelancing
        8. Specific action plan for next 6 months
        
        Make it comprehensive and actionable. Use plain text, no markdown formatting.
        """
        
        try:
            roadmap = self._generate_content(prompt)
            return roadmap if roadmap else "Focus on identifying your strengths and preparing for relevant entrance exams."
        except Exception as e:
            logger.error(f"Error in after_12th career_guidance: {e}")
            return "Focus on building skills relevant to your field of interest and prepare for competitive exams."
    
    def career_guidance_after_btech(self, skills: list, interests: list):
        """Provide career guidance for B.Tech graduates"""
        skills_str = ", ".join(skills)
        interests_str = ", ".join(interests)
        
        prompt = f"""
        Provide detailed career guidance for a B.Tech graduate.
        
        Skills: {skills_str}
        Interests: {interests_str}
        
        Cover:
        1. Career paths in their engineering domain
        2. Industry vs higher studies (MS/MTech) decision framework  
        3. Skills to develop for better job prospects
        4. Emerging technologies they should learn
        5. Certification courses that add value
        6. Networking and professional development strategies
        7. Salary negotiation and career growth tips
        8. Entrepreneurship opportunities in their field
        9. International career opportunities
        10. 1-year, 3-year, and 5-year career milestones
        
        Make it detailed and actionable for an engineering graduate. Use plain text, no markdown formatting.
        """
        
        try:
            roadmap = self._generate_content(prompt)
            return roadmap if roadmap else "Focus on developing both technical and soft skills while exploring various career opportunities in your field."
        except Exception as e:
            logger.error(f"Error in after_btech career_guidance: {e}")
            return "Focus on building industry-relevant skills, networking, and gaining practical experience through internships or projects."
    
    def career_guidance_abroad_studies(self, current_education_level: str, target_country: str, field_of_interest: str, budget_range: str):
        """Provide guidance for studying abroad"""
        prompt = f"""
        Provide comprehensive guidance for studying abroad.
        
        Current Education Level: {current_education_level}
        Target Country: {target_country or "Open to suggestions"}
        Field of Interest: {field_of_interest}
        Budget Range: {budget_range or "Flexible"}
        
        Cover:
        1. Best countries for their field of study
        2. Top universities and admission requirements
        3. Standardized tests needed (GRE, GMAT, IELTS, TOEFL, etc.)
        4. Application timeline and deadlines
        5. Scholarship opportunities and funding options
        6. Cost breakdown (tuition, living expenses, misc.)
        7. Visa process and requirements
        8. Part-time job opportunities while studying
        9. Post-graduation work opportunities
        10. Cultural adaptation and networking tips
        11. Documentation and preparation checklist
        12. Alternative countries if primary choice is difficult
        
        Make it comprehensive and actionable. Use plain text, no markdown formatting.
        """
        
        try:
            roadmap = self._generate_content(prompt)
            return roadmap if roadmap else "Start by researching universities in your field of interest and begin preparing for required standardized tests."
        except Exception as e:
            logger.error(f"Error in abroad_studies career_guidance: {e}")
            return "Begin by researching universities and requirements for your field of interest, and start preparing for standardized tests early."
    
    # ==================== NEW: QUIZ GENERATION ====================
    
    def generate_quiz(self, domain: str, num_questions: int = 10, difficulty: str = "medium"):
        """Generate domain-specific quiz questions"""
        prompt = f"""
        Generate {num_questions} multiple-choice questions for assessing aptitude in the {domain} domain.
        Difficulty level: {difficulty}
        
        Create questions that test:
        - Domain knowledge
        - Analytical thinking
        - Problem-solving skills
        - Practical application
        
        Return ONLY a valid JSON array with this exact structure:
        [
            {{
                "question_id": 1,
                "question": "Question text here",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correct_answer": "Option A",
                "category": "Knowledge/Analytical/Problem-solving",
                "difficulty": "{difficulty}"
            }}
        ]
        
        Ensure exactly {num_questions} questions. No additional text, only valid JSON.
        """
        
        try:
            response_text = self._generate_content(prompt)
            questions = extract_json_from_response(response_text)
            return questions
        except Exception as e:
            logger.error(f"Quiz generation error: {str(e)}")
            raise ValueError(f"Failed to generate quiz: {str(e)}")
    
    def analyze_quiz_responses(self, questions: list, answers: list):
        """Analyze quiz responses and provide detailed feedback"""
        # Create a mapping of question_id to user answer
        answer_map = {ans['question_id']: ans['selected_answer'] for ans in answers}
        
        # Prepare questions with user answers for analysis
        questions_with_answers = []
        for q in questions:
            questions_with_answers.append({
                'question_id': q['question_id'],
                'question': q['question'],
                'options': q['options'],
                'correct_answer': q['correct_answer'],
                'user_answer': answer_map.get(q['question_id'], 'Not answered'),
                'category': q['category']
            })
        
        prompt = f"""
        Analyze the following quiz responses and provide detailed feedback:
        
        {json.dumps(questions_with_answers, indent=2)}
        
        For each question, provide:
        1. Whether the answer is correct or wrong
        2. Detailed explanation of why the correct answer is right
        3. Learning points from this question
        
        Also provide:
        - Overall performance analysis
        - Strengths identified
        - Areas for improvement
        - Specific recommendations
        
        Return ONLY a valid JSON object with this structure:
        {{
            "question_feedback": [
                {{
                    "question_id": 1,
                    "is_correct": true/false,
                    "explanation": "Detailed explanation",
                    "learning_points": "Key takeaways"
                }}
            ],
            "overall_feedback": "Comprehensive performance analysis",
            "strengths": ["Identified strength 1", "Identified strength 2"],
            "improvements": ["Area to improve 1", "Area to improve 2"],
            "recommendations": ["Specific recommendation 1", "Specific recommendation 2"]
        }}
        
        No additional text, only valid JSON.
        """
        
        try:
            response_text = self._generate_content(prompt)
            analysis = extract_json_from_response(response_text)
            return analysis
        except Exception as e:
            logger.error(f"Quiz analysis error: {str(e)}")
            raise ValueError(f"Failed to analyze quiz responses: {str(e)}")
    
    # ==================== NEW: CAREER PREDICTION WITH CONFIDENCE ====================
    
    def predict_careers_with_confidence(self, user_profile: dict, top_n: int = 3):
        """Predict top careers with confidence scores based on user profile"""
        prompt = f"""
        Based on the following user profile, predict the top {top_n} most suitable career options with confidence scores.
        
        User Profile:
        {json.dumps(user_profile, indent=2)}
        
        Analyze:
        1. Education background and academic performance
        2. Skills and their proficiency levels
        3. Interests and passions
        4. Quiz performance (if available)
        5. Career preferences
        
        For each career prediction, provide:
        - Career name
        - Confidence score (0.0 to 1.0) - how well the career matches the profile
        - Detailed description
        - Required skills for this career
        - Salary range in India (in LPA)
        - Growth prospects
        - Specific reasons why this career suits the user
        
        Return ONLY a valid JSON object with this structure:
        {{
            "top_careers": [
                {{
                    "career_title": "Career Title",
                    "confidence": 0.85,
                    "description": "Detailed career description",
                    "required_skills": ["Skill 1", "Skill 2", "Skill 3"],
                    "salary_range": "6-12 LPA",
                    "growth_prospects": "High/Medium/Low with explanation",
                    "reasons": ["Reason 1 why this suits the user", "Reason 2", "Reason 3"]
                }}
            ],
            "recommendations": "Overall career guidance and next steps"
        }}
        
        Ensure exactly {top_n} career options. No additional text, only valid JSON.
        """
        
        try:
            response_text = self._generate_content(prompt)
            prediction = extract_json_from_response(response_text)

            # Convert confidence scores from 0-1 to 0-100 (percentage)
            if 'top_careers' in prediction:
                for career in prediction['top_careers']:
                    if 'confidence' in career and career['confidence'] <= 1.0:
                        career['confidence'] = round(career['confidence'] * 100, 1)

            return prediction
        except Exception as e:
            logger.error(f"Career prediction error: {str(e)}")
            raise ValueError(f"Failed to predict careers: {str(e)}")
    
    # ==================== NEW: STRUCTURED LEARNING ROADMAP ====================
    
    def generate_structured_roadmap(self, target_career: str, current_skills: list, time_commitment: str, learning_style: str):
        """Generate a structured learning roadmap with phases and timeline"""
        current_skills_str = ", ".join(current_skills) if current_skills else "Beginner level"
        
        prompt = f"""
        Create a detailed, structured learning roadmap for someone who wants to become a {target_career}.
        
        Current Skills: {current_skills_str}
        Time Commitment: {time_commitment}
        Learning Style: {learning_style}
        
        Create a phase-by-phase roadmap with:
        - Clear learning phases (e.g., Foundation, Intermediate, Advanced, Specialization)
        - Duration for each phase
        - Topics to cover in each phase
        - Resources (courses, books, projects) for each phase
        - Milestones to achieve in each phase
        
        Also provide:
        - Total duration
        - Final outcome/goal
        - Additional tips for success
        
        Return ONLY a valid JSON object with this structure:
        {{
            "total_duration": "{time_commitment}",
            "phases": [
                {{
                    "phase_number": 1,
                    "phase_name": "Foundation Phase",
                    "duration": "1-2 months",
                    "topics": ["Topic 1", "Topic 2", "Topic 3"],
                    "resources": ["Resource 1 (Course/Book)", "Resource 2", "Resource 3"],
                    "milestones": ["Milestone 1", "Milestone 2"]
                }}
            ],
            "final_outcome": "What you'll achieve after completing this roadmap",
            "additional_tips": ["Tip 1 for success", "Tip 2", "Tip 3"]
        }}
        
        Create 3-5 phases based on the time commitment. No additional text, only valid JSON.
        """
        
        try:
            response_text = self._generate_content(prompt)
            roadmap = extract_json_from_response(response_text)
            return roadmap
        except Exception as e:
            logger.error(f"Roadmap generation error: {str(e)}")
            raise ValueError(f"Failed to generate roadmap: {str(e)}")