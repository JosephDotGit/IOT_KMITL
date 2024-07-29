from dotenv import load_dotenv

load_dotenv()

from fastapi import status, FastAPI, Depends, Response, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

# Import models
from database import SessionLocal, engine
import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI()
router_v1 = APIRouter(prefix="/api/v1")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:5173",
    "https://iot-kmitl-week-2.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return "Hello World "


@router_v1.get("/")
def version():
    return {"version": "1.0.0"}


@router_v1.get("/books", response_model=List[models.BookResponse])
async def get_book(db: Session = Depends(get_db)):
    return db.query(models.Book).all()


@router_v1.get("/books/{book_id}", response_model=models.BookResponse)
async def get_book(book_id: str, response: Response, db: Session = Depends(get_db)):
    db_books = db.query(models.Book).filter(models.Book.id == book_id).first()
    if db_books:
        return db_books
    else:
        response.status_code = 404
        return {"404 Error": "Book not found"}


@router_v1.post("/books")
async def create_book(book: dict, response: Response, db: Session = Depends(get_db)):
    # TODO: Add validation
    category_str = ",".join(book["category"])
    newbook = models.Book(
        title=book["title"],
        author=book["author"],
        details=book["details"],
        synopsis=book["synopsis"],
        category=category_str,
        year=book["year"],
        is_published=book["is_published"],
    )
    db.add(newbook)
    db.commit()
    db.refresh(newbook)
    response.status_code = 200
    return newbook


@router_v1.patch("/books/{book_id}")
async def patch_book(
    book_id: int,
    book: models.BookUpdate,
    db: Session = Depends(get_db),
):
    book_info = db.query(models.Book).filter(models.Book.id == book_id).first()
    if book_info is None:
        raise HTTPException(status_code=404, detail="Book not found")

    book_data = book.dict(exclude_unset=True)
    for key, value in book_data.items():
        setattr(book_info, key, value)

    db.commit()
    db.refresh(book_info)

    return book_info


@router_v1.delete("/books/{book_id}")
async def delete_book(
    book_id: str,
    response: Response,
    db: Session = Depends(get_db),
):
    db.query(models.Book).filter(models.Book.id == book_id).delete()
    db.commit()
    response.status_code = 200
    return {"delete status": "success"}


# coffee
@router_v1.get("/coffees", response_model=List[models.CoffeeResponse])
async def get_book(db: Session = Depends(get_db)):
    return db.query(models.Coffee).all()


@router_v1.get("/coffees/{coffee_id}", response_model=models.CoffeeResponse)
async def get_book(coffee_id=int, db: Session = Depends(get_db)):
    return db.query(models.Coffee).filter(models.Coffee.id == coffee_id).first()


@router_v1.post("/coffees")
def create_coffee(
    coffee: models.CoffeeCreate, response: Response, db: Session = Depends(get_db)
):
    try:
        db_coffee = models.Coffee(
            name=coffee.name,
            price=coffee.price,
            description=coffee.description,
        )
        db.add(db_coffee)
        db.commit()
        db.refresh(db_coffee)
        response.status_code = 201  # Created
        return db_coffee
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@router_v1.patch("/coffees/{coffee_id}")
async def patch_coffee(
    coffee_id: int,
    coffee: models.CoffeeUpdate,
    db: Session = Depends(get_db),
):
    db_coffee = db.query(models.Coffee).filter(models.Coffee.id == coffee_id).first()
    if db_coffee is None:
        raise HTTPException(status_code=404, detail="Coffee not found")

    coffee_data = coffee.dict(exclude_unset=True)
    for key, value in coffee_data.items():
        setattr(db_coffee, key, value)

    db.commit()
    db.refresh(db_coffee)

    return db_coffee


@router_v1.delete("/coffees/{coffee_id}")
async def delete_coffee(
    coffee_id: str,
    response: Response,
    db: Session = Depends(get_db),
):
    db.query(models.Coffee).filter(models.Coffee.id == coffee_id).delete()
    db.commit()
    response.status_code = 200
    return {"delete status": "success"}


# order
@router_v1.get("/orders/{order_id}", response_model=models.OrderResponse)
def read_order(order_id: int, db: Session = Depends(get_db)):
    db_order = (
        db.query(models.Order)
        .join(models.Coffee)
        .filter(models.Order.id == order_id)
        .first()
    )
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return models.OrderResponse(
        id=db_order.id,
        coffee_id=db_order.coffee_id,
        quantity=db_order.quantity,
        status=db_order.status,
        notes=db_order.notes,
        coffee_name=db_order.coffee.name,
    )


@router_v1.get("/orders", response_model=List[models.OrderResponse])
def get_orders(db: Session = Depends(get_db)):
    orders = db.query(models.Order).join(models.Coffee).all()
    order_responses = []
    for order in orders:
        order_responses.append(
            models.OrderResponse(
                id=order.id,
                coffee_id=order.coffee_id,
                quantity=order.quantity,
                status=order.status,
                notes=order.notes,
                coffee_name=order.coffee.name,
            )
        )
    return order_responses


@router_v1.post("/orders")
def create_order(
    order: models.OrderCreate, response: Response, db: Session = Depends(get_db)
):
    db_coffee = (
        db.query(models.Coffee).filter(models.Coffee.id == order.coffee_id).first()
    )
    if db_coffee is None:
        raise HTTPException(status_code=404, detail="Coffee not found")

    db_order = models.Order(
        coffee_id=order.coffee_id, quantity=order.quantity, notes=order.notes
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    response.status_code = 200
    return db_order


@router_v1.patch("/orders/{order_id}")
async def patch_order(
    order_id: int,
    order: models.OrderUpdate,
    db: Session = Depends(get_db),
):
    db_order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")

    order_data = order.dict(exclude_unset=True)
    for key, value in order_data.items():
        setattr(db_order, key, value)

    db.commit()
    db.refresh(db_order)

    return db_order


@router_v1.delete("/orders/{order_id}")
async def delete_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()

    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")

    db.delete(order)
    db.commit()
    return {"detail": "Order deleted successfully"}


app.include_router(router_v1)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app)
