from datetime import datetime 
from sqlalchemy import DateTime, String, Integer, Text, ForeignKey 
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base 
from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from app.models.project import Project

class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(Integer, primary_key = True, index = True)

    title: Mapped[str] = mapped_column(String(100), nullable = False)

    description: Mapped[str | None] = mapped_column(Text, nullable = True)

    status: Mapped[str] = mapped_column(String(20), default = "pending", nullable = False)

    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id"), nullable = False)

    created_at: Mapped[datetime] = mapped_column(DateTime, default = datetime.utcnow)

    updated_at: Mapped[datetime] = mapped_column(DateTime, default = datetime.utcnow, onupdate = datetime.utcnow)

    project: Mapped["Project"] = relationship("Project", back_populates="tasks")

    