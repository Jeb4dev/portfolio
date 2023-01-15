from sqlalchemy import Column, Integer, String, ForeignKey, Date, Boolean
from sqlalchemy.orm import relationship

from database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    github_url = Column(String, nullable=True, default=None)
    demo_url = Column(String, nullable=True, default=None)
    cover_img = Column(String, nullable=True, default=None)
    created = Column(Date)
    team = Column(Boolean)
    score = Column(Integer, default=0)
    tags = relationship("Tag", backref="projects")


class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    label = Column(String)
