from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from os import getenv

# SQLALCHEMY_DATABASE_URL = "sqlite:///./db.sqlite"
SQLALCHEMY_DATABASE_URL = getenv("DATABASE_URL") or "postgresql://user:passwd@db:5432/table"

# engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": True}) # sqlite specific argument
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
