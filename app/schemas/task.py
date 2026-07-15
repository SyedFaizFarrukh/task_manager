from datetime import datetime 
from enum import Enum 
from pydantic import BaseModel, ConfigDict, Field 

class TaskStatus(str, Enum):
    pending = "pending"
    in_progress = "in_progess"
    completed = "completed"

class TaskCreate(BaseModel):
    title: str = Field(min_length = 1, max_length = 100)
    description: str | None = None
    status: TaskStatus = TaskStatus.pending 

class TaskUpdate(BaseModel):
    title: str = Field(min_length = 1, max_length = 100)
    description: str | None = None
    status: TaskStatus 

class TaskResponse(BaseModel):
    id: int 
    title: str
    description: str | None 
    status: TaskStatus 
    created_at: datetime
    updated_at: datetime 
    model_config = ConfigDict(from_attributes = True)
    
