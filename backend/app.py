from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from . import models, database
from pydantic import BaseModel
from typing import List

# Create DB tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic schemas
class FileBase(BaseModel):
    name: str
    language: str
    content: str

class FileCreate(FileBase):
    pass

class FileResponse(FileBase):
    id: int
    class Config:
        orm_mode = True

# Routes
@app.get("/files", response_model=List[FileResponse])
def get_files(db: Session = Depends(get_db)):
    return db.query(models.CodeFile).all()

@app.post("/files", response_model=FileResponse)
def create_file(file: FileCreate, db: Session = Depends(get_db)):
    db_file = models.CodeFile(**file.dict())
    db.add(db_file)
    db.commit()
    db.refresh(db_file)
    return db_file
