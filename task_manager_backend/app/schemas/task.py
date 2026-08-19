from datetime import datetime 
from enum import Enum 
from pydantic import BaseModel, ConfigDict, Field 

class TaskStatus(str, Enum):
    pending = "pending"
    in_progress = "in_progress"
    completed = "completed"

class TaskCreate(BaseModel):
    title: str = Field(min_length = 1, max_length = 100)
    description: str | None = None
    status: TaskStatus = TaskStatus.pending
    project_id: int 
    assignee_id: int

class TaskUpdate(BaseModel):
    title: str = Field(min_length = 1, max_length = 100)
    description: str | None = None
    status: TaskStatus
    project_id: int
    assignee_id: int

class TaskResponse(BaseModel):
    id: int 
    title: str
    description: str | None 
    status: TaskStatus
    assignee_id: int
    project_id: int
    created_at: datetime
    updated_at: datetime 
    model_config = ConfigDict(from_attributes = True)
    
