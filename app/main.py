from fastapi import FastAPI
from app.database import Base, engine
from app.models import task 
from app.routers.tasks import router as tasks_router 

Base.metadata.create_all(bind = engine)

app = FastAPI(title = "Task Manager System")

app.include_router(tasks_router) 

@app.get("/")
def root():
    return {"message":"Task Manager System running"}



