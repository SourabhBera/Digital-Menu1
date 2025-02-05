from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import models, schemas
from dependencies import get_db

router = APIRouter(prefix="/categories", tags=["Categories"])

@router.get("/")
def get_categories(db: Session = Depends(get_db)):
    return db.query(models.Category).all()
