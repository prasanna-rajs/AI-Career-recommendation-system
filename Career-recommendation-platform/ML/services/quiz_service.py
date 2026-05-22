import uuid
import json
import logging
from pathlib import Path
from typing import List, Dict
from datetime import datetime

logger = logging.getLogger(__name__)

class QuizService:
    """Service for managing quizzes and evaluating responses"""
    
    def __init__(self, quiz_storage_dir="quiz_data"):
        """Initialize quiz service with storage directory"""
        self.quiz_storage_dir = Path(quiz_storage_dir)
        self.quiz_storage_dir.mkdir(exist_ok=True)
        logger.info(f"Quiz storage directory: {self.quiz_storage_dir}")
    
    def generate_quiz_id(self):
        """Generate a unique quiz ID"""
        return f"quiz_{uuid.uuid4().hex[:12]}"
    
    def save_quiz(self, quiz_id: str, domain: str, questions: List[Dict]):
        """Save generated quiz to storage"""
        try:
            quiz_data = {
                "quiz_id": quiz_id,
                "domain": domain,
                "questions": questions,
                "created_at": datetime.now().isoformat(),
                "total_questions": len(questions)
            }
            
            quiz_path = self.quiz_storage_dir / f"{quiz_id}.json"
            with open(quiz_path, 'w') as f:
                json.dump(quiz_data, f, indent=2)
            
            logger.info(f"Quiz saved: {quiz_id}")
            return True
        except Exception as e:
            logger.error(f"Error saving quiz: {str(e)}")
            return False
    
    def get_quiz(self, quiz_id: str):
        """Retrieve a quiz by ID"""
        try:
            quiz_path = self.quiz_storage_dir / f"{quiz_id}.json"
            
            if not quiz_path.exists():
                logger.warning(f"Quiz not found: {quiz_id}")
                return None
            
            with open(quiz_path, 'r') as f:
                quiz_data = json.load(f)
            
            return quiz_data
        except Exception as e:
            logger.error(f"Error retrieving quiz: {str(e)}")
            return None
    
    def evaluate_quiz(self, quiz_id: str, answers: List[Dict]):
        """Evaluate quiz answers and calculate score"""
        try:
            # Get the quiz
            quiz_data = self.get_quiz(quiz_id)
            
            if not quiz_data:
                raise ValueError(f"Quiz not found: {quiz_id}")
            
            questions = quiz_data['questions']
            
            # Create answer map
            answer_map = {ans['question_id']: ans['selected_answer'] for ans in answers}
            
            # Evaluate each question
            correct_count = 0
            wrong_count = 0
            question_feedback = []
            
            for question in questions:
                q_id = question['question_id']
                correct_answer = question['correct_answer']
                user_answer = answer_map.get(q_id, '')
                
                is_correct = (user_answer == correct_answer)
                
                if is_correct:
                    correct_count += 1
                else:
                    wrong_count += 1
                
                question_feedback.append({
                    'question_id': q_id,
                    'question': question['question'],
                    'correct_answer': correct_answer,
                    'user_answer': user_answer,
                    'is_correct': is_correct
                })
            
            # Calculate scores
            total_questions = len(questions)
            score = correct_count
            performance_percentage = (correct_count / total_questions * 100) if total_questions > 0 else 0
            
            evaluation_result = {
                'quiz_id': quiz_id,
                'total_questions': total_questions,
                'correct_answers': correct_count,
                'wrong_answers': wrong_count,
                'score': score,
                'performance_percentage': round(performance_percentage, 2),
                'question_feedback': question_feedback
            }
            
            return evaluation_result
            
        except Exception as e:
            logger.error(f"Error evaluating quiz: {str(e)}")
            raise ValueError(f"Failed to evaluate quiz: {str(e)}")
    
    def save_quiz_result(self, user_id: str, quiz_id: str, evaluation_result: Dict):
        """Save quiz results for a user"""
        try:
            results_dir = self.quiz_storage_dir / "results"
            results_dir.mkdir(exist_ok=True)
            
            result_data = {
                "user_id": user_id,
                "quiz_id": quiz_id,
                "evaluation": evaluation_result,
                "submitted_at": datetime.now().isoformat()
            }
            
            result_filename = f"{user_id}_{quiz_id}.json"
            result_path = results_dir / result_filename
            
            with open(result_path, 'w') as f:
                json.dump(result_data, f, indent=2)
            
            logger.info(f"Quiz result saved for user {user_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error saving quiz result: {str(e)}")
            return False
    
    def get_user_quiz_history(self, user_id: str):
        """Get quiz history for a user"""
        try:
            results_dir = self.quiz_storage_dir / "results"
            
            if not results_dir.exists():
                return []
            
            user_results = []
            for result_file in results_dir.glob(f"{user_id}_*.json"):
                with open(result_file, 'r') as f:
                    result_data = json.load(f)
                    user_results.append(result_data)
            
            # Sort by submission date (most recent first)
            user_results.sort(key=lambda x: x.get('submitted_at', ''), reverse=True)
            
            return user_results
            
        except Exception as e:
            logger.error(f"Error getting quiz history: {str(e)}")
            return []
    
    def prepare_questions_for_gemini_analysis(self, questions: List[Dict], answers: List[Dict]):
        """Prepare question data for Gemini analysis"""
        answer_map = {ans['question_id']: ans['selected_answer'] for ans in answers}
        
        questions_with_answers = []
        for q in questions:
            questions_with_answers.append({
                'question_id': q['question_id'],
                'question': q['question'],
                'options': q['options'],
                'correct_answer': q['correct_answer'],
                'user_answer': answer_map.get(q['question_id'], 'Not answered'),
                'category': q.get('category', 'General')
            })
        
        return questions_with_answers
    
    def generate_performance_summary(self, evaluation_result: Dict):
        """Generate a summary of quiz performance"""
        performance = evaluation_result['performance_percentage']
        
        if performance >= 80:
            level = "Excellent"
            message = "Outstanding performance! You have a strong grasp of the concepts."
        elif performance >= 60:
            level = "Good"
            message = "Good job! You have a solid understanding, with room for improvement."
        elif performance >= 40:
            level = "Average"
            message = "Decent effort. Focus on strengthening your weak areas."
        else:
            level = "Needs Improvement"
            message = "Keep learning! Review the concepts and try again."
        
        return {
            "level": level,
            "message": message,
            "performance_percentage": performance,
            "correct_answers": evaluation_result['correct_answers'],
            "total_questions": evaluation_result['total_questions']
        }