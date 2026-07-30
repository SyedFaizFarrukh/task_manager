from datetime import datetime
from sqlalchemy import Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base
from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from app.models.task import Task
if TYPE_CHECKING:
    from app.models.user import User

class Project(Base):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(
        Integer, 
        primary_key=True,
        index=True 
    )

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False
    )

    tasks: Mapped[list["Task"]] = relationship(
        "Task",
        back_populates="project"
    )

    user: Mapped["User"] = relationship(
        back_populates="projects"
    )
    
