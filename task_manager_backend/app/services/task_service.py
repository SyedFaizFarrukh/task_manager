from sqlalchemy import select 
from sqlalchemy.orm import Session 
from app.models.task import Task 
from app.schemas.task import TaskCreate, TaskUpdate 
from app.models.project import Project
from fastapi import HTTPException, status
from app.models.user import User, UserRole
from app.services import project_service

def create_task(db: Session, task_data: TaskCreate, current_user: User):

    project = db.get(Project, task_data.project_id)
    if project is None:
        return None

    assignee = db.get(User, task_data.assignee_id)
    if assignee is None:
        raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Assigned user not found"
    )
    if current_user.role == UserRole.ADMIN:
        pass

    elif current_user.role == UserRole.MANAGER:
        if assignee.role != UserRole.EMPLOYEE:
            raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Managers can only assign tasks to employees."
        )

    elif current_user.role == UserRole.EMPLOYEE:
        raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Employees cannot create tasks."
    )
    task = Task(
        title = task_data.title,
        description = task_data.description, 
        status = task_data.status.value,
        project_id = task_data.project_id,
        assignee_id = task_data.assignee_id
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

def get_all_tasks(db: Session, current_user: User):
    if current_user.role == UserRole.ADMIN:
        return db.execute(select(Task)).scalars().all()

    elif current_user.role == UserRole.MANAGER:
        return db.execute(select(Task).join(Project).where(Project.user_id == current_user.id)).scalars().all()

    elif current_user.role == UserRole.EMPLOYEE:
        return db.execute(select(Task).where(Task.assignee_id == current_user.id)).scalars().all()

def get_tasks_by_project(db: Session, project_id: int, current_user: User):
    if current_user.role == UserRole.ADMIN:
        return db.execute(
            select(Task).where(Task.project_id == project_id)
        ).scalars().all()

    elif current_user.role == UserRole.MANAGER:
        return db.execute(
            select(Task)
            .join(Project)
            .where(
                Project.user_id == current_user.id,
                Task.project_id == project_id
            )
        ).scalars().all()

    elif current_user.role == UserRole.EMPLOYEE:
        return db.execute(
            select(Task)
            .where(
                Task.assignee_id == current_user.id,
                Task.project_id == project_id
            )
        ).scalars().all()

def get_task_by_id(db: Session, task_id: int, current_user: User):

    if current_user.role == UserRole.ADMIN:
        return db.get(Task, task_id)

    elif current_user.role == UserRole.MANAGER:
        return db.execute(select(Task).join(Project).where(Task.id == task_id, Project.user_id == current_user.id)).scalar_one_or_none()

    elif current_user.role == UserRole.EMPLOYEE:
        return db.execute(select(Task).where(Task.id == task_id,Task.assignee_id == current_user.id)).scalar_one_or_none()

def update_task(db: Session, task: Task, task_data: TaskUpdate, current_user: User):

    project = db.get(Project, task_data.project_id)
    if project is None:
        return None

    assignee = db.get(User, task_data.assignee_id)
    if assignee is None:
        raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Assigned user not found"
    )
    if current_user.role == UserRole.ADMIN:
        pass
    elif current_user.role == UserRole.MANAGER:
        if assignee.role != UserRole.EMPLOYEE:
            raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Managers can only assign tasks to employees."
        )
    elif current_user.role == UserRole.EMPLOYEE:
        if assignee.id != current_user.id:
            raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Employees cannot assign tasks to other users."
        )

    task.title = task_data.title
    task.description = task_data.description 
    task.status = task_data.status.value
    task.project_id = task_data.project_id
    task.assignee_id = task_data.assignee_id

    db.commit()
    db.refresh(task)
    return task

def delete_task(db: Session, task: Task):
    db.delete(task)
    db.commit()






