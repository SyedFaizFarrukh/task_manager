from datetime import datetime 
from sqlalchemy import DateTime, String, Integer, Text 
from sqlalchemy.orm import Mapped, mapped_column 
from app.database import Base 

class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(Integer, primary_key = True, index = True)

    title: Mapped[str] = mapped_column(String(100), nullable = False)

    description: Mapped[str | None] = mapped_column(Text, nullable = True)

    status: Mapped[str] = mapped_column(String(20), default = "pending", nullable = False)

    created_at: Mapped[datetime] = mapped_column(DateTime, default = datetime.utcnow)

    updated_at: Mapped[datetime] = mapped_column(DateTime, default = datetime.utcnow, onupdate = datetime.utcnow)

    