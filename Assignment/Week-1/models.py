from sqlalchemy import Column, String

# from sqlalchemy.orm import relationship
from typing import Optional

from database import Base
from pydantic import BaseModel


class Student(Base):
    __tablename__ = "students"

    id = Column(String, primary_key=True, index=True)
    firstname = Column(String, index=True)
    surname = Column(String, index=True)
    birth = Column(String, index=True)
    gender = Column(String, index=True)


class StudentUpdate(BaseModel):
    firstname: str | None = None
    surname: str | None = None
    birth: str | None = None
    gender: str | None = None

    class Config:
        from_attributes = True
