from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectUpdate
from app.models.user import User, UserRole

def create_project(db: Session, project_data: ProjectCreate, current_user: User):
    project = Project(
        name=project_data.name,
        description=project_data.description,
        user_id = current_user.id
    )

    db.add(project)
    db.commit()
    db.refresh(project)
    return project


def get_all_projects(db: Session, current_user: User):
    if current_user.role == UserRole.ADMIN:
        return db.execute(select(Project)).scalars().all()

    elif current_user.role == UserRole.MANAGER:
        return db.execute(select(Project).where(Project.user_id == current_user.id)).scalars().all()

    elif current_user.role == UserRole.EMPLOYEE:
        return []

def get_project_by_id(db: Session, project_id: int, current_user: User) -> Project | None:

    if current_user.role == UserRole.ADMIN:
        return db.get(Project, project_id)
    
    elif current_user.role == UserRole.MANAGER:
        return db.execute(select(Project).where(Project.id == project_id, Project.user_id == current_user.id)).scalar_one_or_none()
    
    elif current_user.role == UserRole.EMPLOYEE:
        return None


def update_project(db: Session, project: Project, project_data: ProjectUpdate):
    if project_data.name is not None:
        project.name = project_data.name

    if project_data.description is not None:
        project.description = project_data.description

    db.commit()
    db.refresh(project)
    return project


def delete_project(db: Session, project: Project):

    if project.tasks:
        return False
    db.delete(project)
    db.commit()
    return True


def get_project_tasks(db: Session, project_id: int, current_user: User):
    project = get_project_by_id(db, project_id, current_user)

    if project is None:
        return None

    return project.tasks




