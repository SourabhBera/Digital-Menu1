import base64
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
import shutil, uuid, os
import models, schemas
from dependencies import get_db
from config import STATIC_IMAGE_DIR, STATIC_VIDEO_DIR

router = APIRouter(prefix="/menu", tags=["Menu"])

@router.get("/")
def get_menu(db: Session = Depends(get_db)):
    menu = db.query(models.Menu, models.Category.name.label("category_name")) \
             .join(models.Category, models.Menu.category_id == models.Category.id).all()

    return [
        {
            "id": item.Menu.id,
            "dish_name": item.Menu.dish_name,
            "category_id": item.Menu.category_id,
            "category_name": item.category_name,
            "dish_type": item.Menu.dish_type,
            "description": item.Menu.description,
            "price": item.Menu.price,
            "image": base64.b64encode(item.Menu.image).decode("utf-8") if item.Menu.image else None,
            "video_path": f"/static/videos/{item.Menu.video_path.split('/')[-1]}"
            
        } 
        for item in menu
    ]




@router.get("/dishes/")
def get_dishes(category_id: int, db: Session = Depends(get_db)):
    dishes = db.query(models.Menu).filter(models.Menu.category_id == category_id).all()
    
    if not dishes:
        raise HTTPException(status_code=404, detail="No dishes found for this category")

    for dish in dishes:
        print(f"Dish ID: {dish.id}, Video Path: {dish.video_path}")  # Debugging

    return [
        {
            "id": dish.id,
            "dish_name": dish.dish_name,
            "category_id": dish.category_id,
            "description": dish.description,
            "dish_type": dish.dish_type,
            "price": dish.price,
            "image": base64.b64encode(dish.Menu.image).decode("utf-8") if dish.Menu.image else None,
            "video_path": f"/static/videos/{dish.video_path}" if dish.video_path else None  # Handle NULL values
        }
        for dish in dishes
    ]