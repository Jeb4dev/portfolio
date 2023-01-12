import datetime
import json
from os import getenv

from fastapi import FastAPI, Depends, Request, status, HTTPException, Header, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import models
from database import SessionLocal, engine

APIKEY = getenv("APIKEY") or "squiresses_fitchy_logic_ditty_afar_signalmen_evohes_sphinx"

models.Base.metadata.create_all(bind=engine)

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
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if project:
        project.tags = project.tags
        return project
    raise HTTPException(status_code=404)


@app.post("/add")
async def add(
        request: Request,
        db: Session = Depends(get_db),
        apikey: str | None = Header(default=None)
):
    if apikey == APIKEY:

        try:
            data: dict = json.loads(await request.body())

            new_project = models.Project()

            # Redefine values
            new_project.name = data["name"]
            new_project.github_url = data["github"] or ""
            new_project.demo_url = data["demo"] or ""
            new_project.cover_img = data["img"] or "https://placehold.co/100x100/EEE/31343C"
            new_project.score = int(data["score"]) or 5
            new_project.team = bool(data["team"]) or False
            new_project.created = datetime.datetime.strptime(data["date"], '%Y-%m-%d').date()

            db.add(new_project)
            db.commit()

            # Add new tags
            for tag in data["tags"].split(", "):
                new_tag = models.Tag(
                    project_id=new_project.id,
                    label=tag
                )
                db.add(new_tag)

            # # Commit changes
            db.commit()
        except Exception:
            raise HTTPException(status_code=400)

        return Response(status_code=status.HTTP_201_CREATED)
    raise HTTPException(status_code=401)


@app.put("/update/{project_id}")
async def update(
        request: Request,
        project_id,
        db: Session = Depends(get_db),
        apikey: str | None = Header(default=None)
):
    if apikey == APIKEY:
        try:
            data: dict = json.loads(await request.body())
            project = db.query(models.Project).filter(models.Project.id == project_id).first()
            if not project:
                raise HTTPException(status_code=404)

            # Redefine values
            project.name = data["name"] or "DEFAULT NAME"
            project.github_url = data["github"] or ""
            project.demo_url = data["demo"] or ""
            project.cover_img = data["img"] or "https://placehold.co/100x100/EEE/31343C"
            project.score = int(data["score"]) or 5
            project.team = bool(data["team"]) or False
            project.created = datetime.datetime.strptime(data["date"], '%Y-%m-%d').date()

            # Delete older tags
            db.query(models.Tag).filter(models.Tag.project_id == project_id).delete()

            db.add(project)
            db.commit()

            # Add new tags
            for tag in data["tags"].split(", "):
                new_tag = models.Tag(
                    project_id=project.id,
                    label=tag
                )
                db.add(new_tag)

            # # Commit changes
            db.commit()
        except Exception:
            raise HTTPException(status_code=400)

        return Response(status_code=status.HTTP_302_FOUND)

    raise HTTPException(status_code=401)


@app.delete("/delete/{project_id}")
def delete(_: Request,
           project_id: int,
           db: Session = Depends(get_db),
           apikey: str | None = Header(default=None)
           ):
    print(apikey)
    if apikey == APIKEY:
        project = db.query(models.Project).filter(models.Project.id == project_id).first()
        if project is None:
            raise HTTPException(status_code=404)

        db.delete(project)
        db.commit()
        return Response(status_code=status.HTTP_200_OK)
    raise HTTPException(status_code=401)
