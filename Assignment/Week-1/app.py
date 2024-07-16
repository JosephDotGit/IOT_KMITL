from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI, Depends, Response, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

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


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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


@router_v1.get("/student")
async def get_student(db: Session = Depends(get_db)):
    db_students = db.query(models.Student).all()

    responses = []
    for student in db_students:
        response = models.StudentResponse(
            id=student.id,
            firstname=student.firstname,
            surname=student.surname,
            birth=student.birth,
            gender=student.gender,
        )
        responses.append(response)
    return responses


@router_v1.get("/student/{student_id}")
async def get_student(student_id: str, db: Session = Depends(get_db)):
    db_students = (
        db.query(models.Student).filter(models.Student.id == student_id).first()
    )

    response = models.StudentResponse(
        id=db_students.id,
        firstname=db_students.firstname,
        surname=db_students.surname,
        birth=db_students.birth,
        gender=db_students.gender,
    )

    return response


@router_v1.post("/student")
async def create_student(
    student: dict, response: Response, db: Session = Depends(get_db)
):
    # TODO: Add validation
    newstudent = models.Student(
        id=student["id"],
        firstname=student["firstname"],
        surname=student["surname"],
        birth=student["birth"],
        gender=student["gender"],
    )
    db.add(newstudent)
    db.commit()
    db.refresh(newstudent)
    response.status_code = 201
    return newstudent


@router_v1.put("/student/{student_id}")
async def put_student(
    student_id: str,
    response: Response,
    student: models.StudentUpdate,
    db: Session = Depends(get_db),
):
    all_info = db.query(models.Student).filter(models.Student.id == student_id).first()
    if all_info == None:
        response.status_code = 404
        return {"404 Error": "Student not found"}
    student_data = student.dict(exclude_unset=True)
    for key, value in student_data.items():
        setattr(all_info, key, value)
    db.commit()
    db.refresh(all_info)
    response.status_code = 200
    return all_info


# @router_v1.patch("/student/{student_id}")
# async def patch_student(
#     student_id: str,
#     response: Response,
#     student: models.StudentUpdate,
#     db: Session = Depends(get_db),
# ):
#     all_info = db.query(models.Student).filter(models.Student.id == student_id).first()
#     student_data = student.dict(exclude_unset=True)
#     for key, value in student_data.items():
#         setattr(all_info, key, value)
#     db.commit()
#     db.refresh(all_info)
#     response.status_code = 200
#     return all_info


@router_v1.delete("/student/{student_id}")
async def delete_book(
    student_id: str,
    response: Response,
    db: Session = Depends(get_db),
):
    db.query(models.Student).filter(models.Student.id == student_id).delete()
    db.commit()
    response.status_code = 200
    return {"delete status": "success"}


app.include_router(router_v1)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app)
