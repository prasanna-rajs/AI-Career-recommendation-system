"""
Database initialization script
Run this to create all tables in the database
"""
from database import engine, Base
from db_models import User, College, QuizResult, Resume, LearningRoadmap

def init_database():
    """Create all tables in the database"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✓ Database tables created successfully!")
    print("\nCreated tables:")
    print("  - users")
    print("  - colleges")
    print("  - quiz_results")
    print("  - resumes")
    print("  - learning_roadmaps")

if __name__ == "__main__":
    init_database()
