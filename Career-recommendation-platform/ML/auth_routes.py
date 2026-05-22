"""
Authentication and user management routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional
from database import get_db
from db_models import User
from auth import (
    get_password_hash,
    authenticate_user,
    create_access_token,
    get_current_user,
    get_current_active_user
)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


# Pydantic models for request/response
class UserSignup(BaseModel):
    email: EmailStr
    username: str
    password: str
    full_name: Optional[str] = None


class UserLogin(BaseModel):
    username: str  # Can be username or email
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict


class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    full_name: Optional[str]
    age: Optional[int]
    education_level: Optional[str]
    stream: Optional[str]
    marks_12th: Optional[float]
    college_name: Optional[str]
    cgpa: Optional[float]
    interests: Optional[list]
    skills: Optional[dict]
    domain_preference: Optional[str]

    class Config:
        from_attributes = True


class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    age: Optional[int] = None
    education_level: Optional[str] = None
    stream: Optional[str] = None
    marks_12th: Optional[float] = None
    college_name: Optional[str] = None
    cgpa: Optional[float] = None
    interests: Optional[list] = None
    skills: Optional[dict] = None
    domain_preference: Optional[str] = None
    experience_years: Optional[float] = None
    current_ctc: Optional[float] = None
    expected_ctc: Optional[float] = None
    location_preference: Optional[str] = None


@router.post("/signup", response_model=Token, status_code=status.HTTP_201_CREATED)
async def signup(user_data: UserSignup, db: Session = Depends(get_db)):
    """
    Register a new user

    Args:
        user_data: User registration data
        db: Database session

    Returns:
        JWT token and user information
    """
    # Check if email already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Check if username already exists
    existing_username = db.query(User).filter(User.username == user_data.username).first()
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )

    # Create new user
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        email=user_data.email,
        username=user_data.username,
        hashed_password=hashed_password,
        full_name=user_data.full_name
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Create access token
    access_token = create_access_token(data={"sub": str(new_user.id)})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "username": new_user.username,
            "full_name": new_user.full_name
        }
    }


@router.post("/login", response_model=Token)
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """
    Login user and return JWT token

    Args:
        credentials: Login credentials (username/email and password)
        db: Database session

    Returns:
        JWT token and user information
    """
    user = authenticate_user(db, credentials.username, credentials.password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create access token
    access_token = create_access_token(data={"sub": str(user.id)})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "full_name": user.full_name,
            "education_level": user.education_level,
            "domain_preference": user.domain_preference
        }
    }


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(current_user: User = Depends(get_current_active_user)):
    """
    Get current user profile

    Args:
        current_user: Authenticated user from JWT token

    Returns:
        User profile information
    """
    return current_user


@router.put("/profile", response_model=UserResponse)
async def update_profile(
    profile_data: ProfileUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Update user profile

    Args:
        profile_data: Profile data to update
        current_user: Authenticated user
        db: Database session

    Returns:
        Updated user profile
    """
    # Update user fields
    for field, value in profile_data.dict(exclude_unset=True).items():
        setattr(current_user, field, value)

    db.commit()
    db.refresh(current_user)

    return current_user


@router.post("/logout")
async def logout():
    """
    Logout user (client-side should remove token)

    Returns:
        Success message
    """
    return {"message": "Logged out successfully. Please remove the token from client."}


@router.delete("/account")
async def delete_account(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Deactivate user account

    Args:
        current_user: Authenticated user
        db: Database session

    Returns:
        Success message
    """
    current_user.is_active = False
    db.commit()

    return {"message": "Account deactivated successfully"}
