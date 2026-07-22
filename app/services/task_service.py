from sqlalchemy import select 
from sqlalchemy.orm import Session 
from app.models.task import Task 
from app.schemas.task import TaskCreate, TaskUpdate 
from app.models.project import Project
from app.models.user import User
from app.services import project_service

def create_task(db: Session, task_data: TaskCreate, current_user: User):

    project = project_service.get_project_by_id(db, task_data.project_id, current_user)
    if project is None:
        return None
    
    task = Task(
        title = task_data.title,
        description = task_data.description, 
        status = task_data.status.value,
        project_id = task_data.project_id
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

def get_all_tasks(db: Session, current_user: User):
    return db.execute(select(Task).join(Project).where(Project.user_id==current_user.id)).scalars().all()

def get_task_by_id(db: Session, task_id: int, current_user: User):
    return db.execute(select(Task).join(Project).where(Task.id == task_id, Project.user_id == current_user.id)).scalar_one_or_none()

def update_task(db: Session, task: Task, task_data: TaskUpdate, current_user: User):

    project = project_service.get_project_by_id(db, task_data.project_id, current_user)
    if project is None:
        return None
    
    task.title = task_data.title
    task.description = task_data.description 
    task.status = task_data.status.value
    task.project_id = task_data.project_id

    db.commit()
    db.refresh(task)
    return task

def delete_task(db: Session, task: Task):
    db.delete(task)
    db.commit()






