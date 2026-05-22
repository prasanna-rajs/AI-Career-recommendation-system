"""
College recommendation routes
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import List, Optional
from pydantic import BaseModel
from database import get_db
from db_models import College

router = APIRouter(prefix="/api/colleges", tags=["Colleges"])


# Pydantic models
class CollegeResponse(BaseModel):
    id: int
    name: str
    location: str
    state: str
    city: str
    college_type: str
    affiliation: str
    nirf_ranking: Optional[int]
    programs_offered: List[str]
    entrance_exams: List[str]
    min_percentile: float
    avg_fees_per_year: float
    avg_placement_package: float
    highest_placement: float
    placement_percentage: float
    facilities: List[str]
    website: Optional[str]
    description: str

    class Config:
        from_attributes = True


class CollegeFilterRequest(BaseModel):
    career_domain: Optional[str] = None  # Engineering, Management, Medical, Law, Design
    state: Optional[str] = None
    college_type: Optional[str] = None  # Government, Private
    max_fees: Optional[float] = None
    min_percentile: Optional[float] = None
    programs: Optional[List[str]] = None
    entrance_exam: Optional[str] = None


@router.get("/", response_model=List[CollegeResponse])
async def get_all_colleges(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, le=100),
    db: Session = Depends(get_db)
):
    """
    Get all colleges with pagination

    Args:
        skip: Number of records to skip
        limit: Maximum number of records to return
        db: Database session

    Returns:
        List of colleges
    """
    colleges = db.query(College).offset(skip).limit(limit).all()
    return colleges


@router.get("/search", response_model=List[CollegeResponse])
async def search_colleges(
    query: str = Query(..., min_length=2),
    db: Session = Depends(get_db)
):
    """
    Search colleges by name, location, or city

    Args:
        query: Search query string
        db: Database session

    Returns:
        List of matching colleges
    """
    search_pattern = f"%{query}%"

    colleges = db.query(College).filter(
        or_(
            College.name.ilike(search_pattern),
            College.location.ilike(search_pattern),
            College.city.ilike(search_pattern),
            College.state.ilike(search_pattern)
        )
    ).all()

    return colleges


@router.get("/{college_id}", response_model=CollegeResponse)
async def get_college_by_id(
    college_id: int,
    db: Session = Depends(get_db)
):
    """
    Get college details by ID

    Args:
        college_id: College ID
        db: Database session

    Returns:
        College details
    """
    college = db.query(College).filter(College.id == college_id).first()

    if not college:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="College not found")

    return college


@router.post("/filter", response_model=List[CollegeResponse])
async def filter_colleges(
    filters: CollegeFilterRequest,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, le=100),
    db: Session = Depends(get_db)
):
    """
    Filter colleges based on multiple criteria

    Args:
        filters: Filter criteria
        skip: Number of records to skip
        limit: Maximum number of records to return
        db: Database session

    Returns:
        List of filtered colleges
    """
    query_obj = db.query(College)

    # Apply filters
    if filters.state:
        query_obj = query_obj.filter(College.state == filters.state)

    if filters.college_type:
        query_obj = query_obj.filter(College.college_type == filters.college_type)

    if filters.max_fees:
        query_obj = query_obj.filter(College.avg_fees_per_year <= filters.max_fees)

    if filters.min_percentile:
        query_obj = query_obj.filter(College.min_percentile <= filters.min_percentile)

    if filters.entrance_exam:
        # Filter colleges that accept the specified entrance exam
        query_obj = query_obj.filter(
            College.entrance_exams.contains([filters.entrance_exam])
        )

    # Program filtering (if specific programs are requested)
    if filters.programs:
        # Check if any of the requested programs are offered
        for program in filters.programs:
            query_obj = query_obj.filter(
                College.programs_offered.contains([program])
            )

    # Order by NIRF ranking (lower is better)
    query_obj = query_obj.order_by(College.nirf_ranking.asc().nullslast())

    colleges = query_obj.offset(skip).limit(limit).all()
    return colleges


@router.get("/recommend/by-career", response_model=List[CollegeResponse])
async def recommend_colleges_by_career(
    career: str = Query(..., description="Target career path (e.g., Software Engineer, Doctor, MBA)"),
    user_percentile: float = Query(..., ge=0, le=100),
    max_fees: Optional[float] = Query(None),
    preferred_state: Optional[str] = Query(None),
    limit: int = Query(10, le=50),
    db: Session = Depends(get_db)
):
    """
    Recommend colleges based on career choice and user eligibility

    Args:
        career: Target career path
        user_percentile: User's entrance exam percentile
        max_fees: Maximum affordable fees per year
        preferred_state: Preferred state for college
        limit: Maximum number of recommendations
        db: Database session

    Returns:
        List of recommended colleges
    """
    # Map career to programs/entrance exams
    career_mapping = {
        "software": {"programs": ["B.Tech CSE", "B.Tech IT"], "exam": "JEE Main"},
        "engineer": {"programs": ["B.Tech"], "exam": "JEE Main"},
        "doctor": {"programs": ["MBBS", "MD"], "exam": "NEET"},
        "mba": {"programs": ["MBA"], "exam": "CAT"},
        "lawyer": {"programs": ["LLB", "BA LLB"], "exam": "CLAT"},
        "designer": {"programs": ["B.Des"], "exam": "NID"},
    }

    # Normalize career input
    career_lower = career.lower()

    # Find matching career type
    program_filter = None
    for key, value in career_mapping.items():
        if key in career_lower:
            program_filter = value
            break

    query_obj = db.query(College)

    # Filter by user's eligibility (percentile)
    query_obj = query_obj.filter(College.min_percentile <= user_percentile)

    # Filter by max fees if specified
    if max_fees:
        query_obj = query_obj.filter(College.avg_fees_per_year <= max_fees)

    # Filter by preferred state if specified
    if preferred_state:
        query_obj = query_obj.filter(College.state == preferred_state)

    # Filter by relevant programs if career mapping found
    if program_filter:
        # Use text search for programs (SQLite doesn't support array contains well)
        for program_keyword in program_filter["programs"]:
            # This will do a partial match
            pass  # For SQLite, we'll handle this in Python after fetching

    # Order by placement and ranking
    query_obj = query_obj.order_by(
        College.placement_percentage.desc(),
        College.nirf_ranking.asc().nullslast()
    )

    colleges = query_obj.limit(limit * 2).all()  # Fetch more for filtering

    # Post-filter by programs (since SQLite JSON contains is limited)
    if program_filter:
        filtered_colleges = []
        for college in colleges:
            # Check if any program keyword matches
            for program_keyword in program_filter["programs"]:
                if any(program_keyword in prog for prog in college.programs_offered):
                    filtered_colleges.append(college)
                    break
        colleges = filtered_colleges[:limit]
    else:
        colleges = colleges[:limit]

    return colleges


@router.get("/states", response_model=List[str])
async def get_all_states(db: Session = Depends(get_db)):
    """
    Get list of all states with colleges

    Args:
        db: Database session

    Returns:
        List of state names
    """
    states = db.query(College.state).distinct().all()
    return [state[0] for state in states if state[0]]


@router.get("/types", response_model=List[str])
async def get_college_types(db: Session = Depends(get_db)):
    """
    Get list of all college types

    Args:
        db: Database session

    Returns:
        List of college types
    """
    types = db.query(College.college_type).distinct().all()
    return [ctype[0] for ctype in types if ctype[0]]
