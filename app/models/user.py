from datetime import datetime
from sqlalchemy import String, Integer, DateTime 
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base
from enum import Enum
from sqlalchemy import Enum as SQLEnum
from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from app.models.project import Project
    from app.models.task import Task

class UserRole(str, Enum):
    ADMIN = "admin"
    MANAGER = "manager"
    EMPLOYEE = "employee"

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )
    
    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True
    )

    hashed_password: Mapped[str] = mapped_column(
        String,
        nullable=False
    )

    role: Mapped[UserRole] = mapped_column(
        SQLEnum(UserRole),
        nullable=False,
        default=UserRole.EMPLOYEE
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )

    projects: Mapped[list["Project"]] = relationship(
        back_populates="user"
    )

    tasks: Mapped[list["Task"]] = relationship(
        back_populates="assignee"
    )
    