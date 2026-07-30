from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.user import UserCreate, UserResponse
from app.services.user_service import create_user
from app.schemas.user import Token
from app.services.user_service import authenticate_user
from app.utils.security import create_access_token
from app.models.user import User
from app.utils.security import get_current_user
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter(
    prefix="/auth", 
    tags=["Authentication"]
    )

@router.post(
    "/register",
    response_model = UserResponse,
    status_code = 201
)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    user = create_user(db, user_data)
    if user is None:
        raise HTTPException(
            status_code = 400,
            detail = "Email already registered"
        )
    return user

@router.post(
    "/login",
    response_model=Token
)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password"
        )
    access_token = create_access_token(user.id)
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.get(
    "/me",
    response_model=UserResponse
)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
