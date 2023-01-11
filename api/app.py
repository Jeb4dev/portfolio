import datetime
from typing import Optional

from fastapi import FastAPI, Depends, Request, Form, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from starlette.responses import RedirectResponse
from starlette.templating import Jinja2Templates

import models
from database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

templates = Jinja2Templates(directory="templates")

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins="*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def home(_: Request, db: Session = Depends(get_db)):
    projects = db.query(models.Project).all()
    for project in projects:
        project.tags = project.tags
    return projects


@app.get("/get/{project_id}")
def home(_: Request, project_id: int, db: Session = Depends(get_db)):
    return db.query(models.Project).filter(models.Project.id == project_id).first()


@app.post("/add")
def add(
        request: Request,
        name: str = Form(...),
        github: Optional[str] = Form(None),
        demo: Optional[str] = Form(None),
        img: Optional[str] = Form(None),
        date: str = Form(...),
        tags: Optional[str] = Form(""),
        team: Optional[bool] = Form(False),
        score: Optional[int] = Form(False),
        db: Session = Depends(get_db)):
    new_project = models.Project(
        name=name,
        github_url=github,
        demo_url=demo,
        cover_img=img,
        created=datetime.datetime.strptime(date, '%Y-%m-%d').date(),
        team=team,
        score=score
    )
    db.add(new_project)
    db.commit()

    for tag in tags.split(", "):
        new_tag = models.Tag(
            project_id=new_project.id,
            label=tag
        )
        db.add(new_tag)

    db.commit()

    url = app.url_path_for("home")
    return RedirectResponse(url=url, status_code=status.HTTP_303_SEE_OTHER)


@app.get("/update/{project_id}")
def update(
        request: Request,
        project_id,
        name: str = Form(...),
        github: str = Form(...),
        demo: str = Form(...),
        img: str = Form(...),
        date: str = Form(...),
        tags: str = Form(...),
        score: str = Form(...),
        db: Session = Depends(get_db)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()

    # Redefine values
    project.name = name,
    project.github_url = github,
    project.demo_url = demo,
    project.cover_img = img,
    project.score = score,
    project.created = datetime.datetime.strptime(date, '%Y-%m-%d').date()

    # Delete older tags
    db.query(models.Tag).filter(models.Tag.project_id == project_id).delete()

    # Add new tags
    for tag in tags.split(", "):
        new_tag = models.Tag(
            project_id=project.id,
            label=tag
        )
        db.add(new_tag)

    # Commit changes
    db.commit()

    url = app.url_path_for("home")
    return RedirectResponse(url=url, status_code=status.HTTP_302_FOUND)


@app.get("/delete/{project_id}")
def delete(request: Request, project_id: int, db: Session = Depends(get_db)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    db.delete(project)
    db.commit()

    url = app.url_path_for("home")
    return RedirectResponse(url=url, status_code=status.HTTP_302_FOUND)
