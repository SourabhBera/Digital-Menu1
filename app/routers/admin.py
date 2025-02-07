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



async def convert_file_to_binary(file: UploadFile):
    file.seek(0)  # 
    return await file.read()



@router.post("/add-dishes")
async def add_dish(
    dish_name: str = Form(...),
    category_id: int = Form(...),
    dish_type: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    image: UploadFile = File(...),
    video: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    try:
        # Read binary data
        binary_image = await convert_file_to_binary(image)

        video_extension = video.filename.split(".")[-1].lower()
        allowed_video_extensions = {"mp4", "avi", "mov", "mkv"}
        if video_extension not in allowed_video_extensions:
            raise HTTPException(status_code=400, detail="Invalid video file type.")
        
        unique_video_filename = f"{uuid.uuid4()}.{video_extension}"
        video_path = os.path.join("static/videos", unique_video_filename)
        os.makedirs(os.path.dirname(video_path), exist_ok=True)
        
        with open(video_path, "wb") as buffer:
            shutil.copyfileobj(video.file, buffer)

        # Insert into Menu table
        new_dish = models.Menu(
            dish_name=dish_name,
            category_id=category_id,
            dish_type=dish_type,
            description=description,
            price=price,
            image=binary_image,
            video_path=unique_video_filename
        )
        db.add(new_dish)
        db.commit()
        db.refresh(new_dish)


        return {"message": "Dish added successfully!", "dish_id": new_dish.id}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


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
    # Find the dish to update
    dish = db.query(models.Menu).filter(models.Menu.id == id).first()
    if not dish:
        raise HTTPException(status_code=404, detail="Dish not found")
    
    # Update basic fields
    dish.dish_name = dish_name
    dish.category_id = category_id
    dish.dish_type = dish_type
    dish.price = price
    dish.description = description
    
    # Update image if provided
    if image:
        image_extension = image.filename.split(".")[-1].lower()
        if image_extension not in {"jpg", "jpeg", "png"}:
            raise HTTPException(status_code=400, detail="Invalid image file type")
        
        image_data = await image.read()
        dish.image = image_data  # Save new image as binary
    
    # Update video if provided
    if video:
        video_extension = video.filename.split(".")[-1].lower()
        if video_extension not in {"mp4", "avi", "mov", "mkv"}:
            raise HTTPException(status_code=400, detail="Invalid video file type.")
        
        video_data = await video.read()
        dish.video = video_data  # Save new video as binary
    
    db.commit()
    db.refresh(dish)

    return {"message": "Dish updated successfully"}

@router.delete("/delete/{id}")
def delete_item(id: int, db: Session = Depends(get_db)):
    item = db.query(models.Menu).filter(models.Menu.id == id).first()
    if not item:
        raise HTTPException(status_code=404, detail=f"Menu item with ID {id} not found.")
    
    # Delete the item from the database
    db.delete(item)
    db.commit()
    
    return {"message": f"{item.dish_name} Deleted Successfully."}
