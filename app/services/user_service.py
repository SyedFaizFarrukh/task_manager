from sqlalchemy import select
from sqlalchemy.orm import Session
from pwdlib import PasswordHash
from app.models.user import User
from app.schemas.user import UserCreate

password_hash = PasswordHash.recommended()

def get_user_by_email(db: Session, email: str):
    return db.execute(select(User).where(User.email==email)).scalar_one_or_none()

def create_user(db: Session, user_data: UserCreate):
    existing_user = get_user_by_email(db, user_data.email)
    if existing_user:
        return None
    hashed_password = password_hash.hash(user_data.password)
    user = User(
        name = user_data.name,
        email = user_data.email,
        hashed_password = hashed_password
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

