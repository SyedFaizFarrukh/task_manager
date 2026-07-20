from sqlalchemy import select 
from sqlalchemy.orm import Session 
from app.models.task import Task 
from app.schemas.task import TaskCreate, TaskUpdate 
from app.models.project import Project

def create_task(db: Session, task_data: TaskCreate):

    project = db.get(Project, task_data.project_id)
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

def get_all_tasks(db: Session):
    return db.execute(select(Task)).scalars().all()

def get_task_by_id(db: Session, task_id: int):
    return db.get(Task, task_id)

def update_task(db: Session, task: Task, task_data: TaskUpdate):

    project = db.get(Project, task_data.project_id)
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






