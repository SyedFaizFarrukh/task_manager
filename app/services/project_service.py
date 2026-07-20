from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectUpdate


def create_project(db: Session, project_data: ProjectCreate):
    project = Project(
        name=project_data.name,
        description=project_data.description
    )

    db.add(project)
    db.commit()
    db.refresh(project)
    return project


def get_all_projects(db: Session):
    return db.execute(select(Project)).scalars().all()


def get_project_by_id(db: Session, project_id: int):
    return db.get(Project, project_id)


def update_project(db: Session, project: Project, project_data: ProjectUpdate):
    if project_data.name is not None:
        project.name = project_data.name

    if project_data.description is not None:
        project.description = project_data.description

    db.commit()
    db.refresh(project)
    return project


def delete_project(db: Session, project: Project):
    db.delete(project)
    db.commit()

def get_project_tasks(db: Session, project_id: int):
    project = db.get(Project, project_id)

    if project is None:
        return None

    return project.tasks




