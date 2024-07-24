from sqlalchemy import Boolean, Column, Integer, String, Float, ForeignKey
from typing import Optional
from database import Base
from pydantic import BaseModel, Field, field_validator

from sqlalchemy.orm import relationship


class Book(Base):
    __tablename__ = "books"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    author = Column(String, index=True)
    details = Column(String, index=True)
    synopsis = Column(String, index=True)
    category = Column(String, index=True)
    year = Column(Integer, index=True)
    is_published = Column(Boolean, index=True)


class BookUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    details: Optional[str] = None
    synopsis: Optional[str] = None
    category: Optional[str] = None
    year: Optional[int] = None
    is_published: Optional[bool] = None


class BookResponse(BaseModel):
    id: int
    title: str
    author: str
    details: str
    synopsis: str
    category: str
    year: int
    is_published: bool


class Coffee(Base):
    __tablename__ = "coffees"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    price = Column(Integer, index=True)
    description = Column(String, index=True)


class CoffeeResponse(BaseModel):
    id: int
    name: str
    price: int
    description: str


class CoffeeCreate(BaseModel):
    name: str = Field(..., example="Latte")
    price: int = Field(..., gt=0, example=2)
    description: str = Field(..., example="A creamy coffee with milk")

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("ชื่อกาแฟต้องไม่เป็นช่องว่าง")
        return v.strip()


class CoffeeUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[int] = None
    description: Optional[str] = None


class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    coffee_id = Column(Integer, ForeignKey("coffees.id"))
    quantity = Column(Integer)
    notes = Column(String)
    status = Column(String, default="pending")  # pending, completed, cancelled
    coffee = relationship("Coffee")


class OrderResponse(BaseModel):
    id: int
    coffee_id: int
    quantity: int
    status: str
    notes: str
    coffee_name: str


class OrderCreate(BaseModel):
    coffee_id: int
    quantity: int
    notes: str = None


class OrderUpdate(BaseModel):
    coffee_id: Optional[int] = None
    quantity: Optional[int] = None
    notes: Optional[str] = None
    status: Optional[str] = None
