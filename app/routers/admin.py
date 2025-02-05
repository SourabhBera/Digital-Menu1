from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
import os
import shutil
import uuid
import models, schemas
from dependencies import get_db


router = APIRouter(prefix="/admin", tags=["Admin"])


@router.post("/create-category", status_code=201)
def create_category(category: schemas.CategoryCreate, db: Session = Depends(get_db)):
    name = category.name.strip()
    if not name:
        raise HTTPException(status_code=400, detail="Category name cannot be empty")
    
    if db.query(models.Category).filter(models.Category.name.ilike(name)).first():
        raise HTTPException(status_code=400, detail="Category already exists")

    new_category = models.Category(name=name)
    db.add(new_category)
    db.commit()
    db.refresh(new_category)

    return {"message": f"Category '{name}' created successfully", "category_id": new_category.id}


@router.put("/update-category/{id}")
def update_category(id: int, request: schemas.CategoryCreate, db: Session = Depends(get_db)):
    category = db.query(models.Category).filter(models.Category.id == id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    new_name = request.name.strip()
    if not new_name:
        raise HTTPException(status_code=400, detail="New category name cannot be empty")
    
    if db.query(models.Category).filter(models.Category.name.ilike(new_name)).first():
        raise HTTPException(status_code=400, detail="Category with this name already exists")

    category.name = new_name
    db.commit()
    db.refresh(category)

    return {"message": f"Category with ID {id} updated successfully", "updated_category": {"id": category.id, "name": category.name}}


@router.post("/add-dishes")
async def add_item(
    dish_name: str = Form(...),
    category_id: int = Form(...),
    dish_type: str = Form(...),
    price: float = Form(...),
    description: str = Form(...),
    image: UploadFile = File(...),
    video: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if not db.query(models.Category).filter(models.Category.id == category_id).first():
        raise HTTPException(status_code=400, detail="Invalid category")
    
    image_extension = image.filename.split(".")[-1].lower()
    allowed_image_extensions = {"jpg", "jpeg", "png"}
    if image_extension not in allowed_image_extensions:
        raise HTTPException(status_code=400, detail="Invalid image file type.")
    
    unique_image_filename = f"{uuid.uuid4()}.{image_extension}"
    image_path = os.path.join("static/images", unique_image_filename)
    os.makedirs(os.path.dirname(image_path), exist_ok=True)
    
    with open(image_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)
    
    video_extension = video.filename.split(".")[-1].lower()
    allowed_video_extensions = {"mp4", "avi", "mov", "mkv"}
    if video_extension not in allowed_video_extensions:
        raise HTTPException(status_code=400, detail="Invalid video file type.")
    
    unique_video_filename = f"{uuid.uuid4()}.{video_extension}"
    video_path = os.path.join("static/videos", unique_video_filename)
    os.makedirs(os.path.dirname(video_path), exist_ok=True)
    
    with open(video_path, "wb") as buffer:
        shutil.copyfileobj(video.file, buffer)
    
    new_item = models.Menu(
        dish_name=dish_name,
        category_id=category_id,
        dish_type=dish_type,
        price=price,
        description=description,
        image_path=unique_image_filename,
        video_path=unique_video_filename
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)

    return {"message": f"Item added to menu with ID {new_item.id}"}


@router.put("/update-dish/{id}")
async def update_dish(
    id: int,
    dish_name: str = Form(...),
    description: str = Form(...),
    category_id: int = Form(...),
    dish_type: str = Form(...),
    price: float = Form(...),
    image: UploadFile = File(None),
    video: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    dish = db.query(models.Menu).filter(models.Menu.id == id).first()
    if not dish:
        raise HTTPException(status_code=404, detail="Dish not found")
    
    dish.dish_name, dish.category_id, dish.dish_type, dish.price, dish.description = dish_name, category_id, dish_type, price, description
    
    if image:
        file_extension = image.filename.split(".")[-1].lower()
        if file_extension not in {"jpg", "jpeg", "png"}:
            raise HTTPException(status_code=400, detail="Invalid file type")
        
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        file_path = os.path.join("static/images", unique_filename)
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        
        os.remove(os.path.join("static/images", dish.image_path))
        dish.image_path = unique_filename
    
    if video:
        video_extension = video.filename.split(".")[-1].lower()
        if video_extension not in {"mp4", "avi", "mov", "mkv"}:
            raise HTTPException(status_code=400, detail="Invalid video file type.")
        
        unique_video_filename = f"{uuid.uuid4()}.{video_extension}"
        video_file_path = os.path.join("static/videos", unique_video_filename)
        os.makedirs(os.path.dirname(video_file_path), exist_ok=True)
        
        with open(video_file_path, "wb") as buffer:
            shutil.copyfileobj(video.file, buffer)
        
        os.remove(os.path.join("static/videos", dish.video_path))
        dish.video_path = unique_video_filename
    
    db.commit()
    db.refresh(dish)

    return {"message": "Dish updated successfully"}


@router.delete("/delete/{id}")
def delete_item(id: int, db: Session = Depends(get_db)):
    item = db.query(models.Menu).filter(models.Menu.id == id).first()
    if not item:
        raise HTTPException(status_code=404, detail=f"Menu item with ID {id} not found.")
    
    os.remove(os.path.join("static/images", item.image_path))
    os.remove(os.path.join("static/videos", item.video_path))
    
    db.delete(item)
    db.commit()
    
    return {"message": f"{item.dish_name} Deleted Successfully."}
