from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from datetime import datetime, timedelta
import os
import shutil
import uuid

import schemas
import models
from database import engine, SessionLocal

# Initialize FastAPI app
app = FastAPI()

# Serve static files for images
app.mount("/static", StaticFiles(directory="static"), name="static")

# Create database tables
models.Base.metadata.create_all(bind=engine)

# CORS Configuration
origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

# Dependency for Database Session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# API Endpoints
@app.get("/")
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
            "price": item.Menu.price,
            "image_path": f"/static/images/{item.Menu.image_path.split('/')[-1]}",
            "video_path": f"/static/videos/{item.Menu.video_path.split('/')[-1]}"
            
        } 
        for item in menu
    ]


@app.post("/admin/create-category", status_code=201)
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


@app.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    return db.query(models.Category).all()


@app.put("/update-category/{id}")
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

@app.post("/admin/add-dishes")
async def add_item(
    dish_name: str = Form(...),
    category_id: int = Form(...),
    dish_type: str = Form(...),
    price: float = Form(...),
    image: UploadFile = File(...),
    video: UploadFile = File(...),  # Added parameter for video
    db: Session = Depends(get_db)
):
    if not db.query(models.Category).filter(models.Category.id == category_id).first():
        raise HTTPException(status_code=400, detail="Invalid category")

    # Validate and save image
    image_extension = image.filename.split(".")[-1].lower()
    allowed_image_extensions = {"jpg", "jpeg", "png"}
    if image_extension not in allowed_image_extensions:
        raise HTTPException(status_code=400, detail="Invalid image file type. Only jpg, jpeg, and png are allowed.")

    unique_image_filename = f"{uuid.uuid4()}.{image_extension}"
    image_path = os.path.join("static/images", unique_image_filename)
    os.makedirs(os.path.dirname(image_path), exist_ok=True)

    try:
        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save image: {str(e)}")

    # Validate and save video
    video_extension = video.filename.split(".")[-1].lower()
    allowed_video_extensions = {"mp4", "avi", "mov", "mkv"}
    if video_extension not in allowed_video_extensions:
        raise HTTPException(status_code=400, detail="Invalid video file type. Only mp4, avi, mov, mkv are allowed.")

    unique_video_filename = f"{uuid.uuid4()}.{video_extension}"
    video_path = os.path.join("static/videos", unique_video_filename)
    os.makedirs(os.path.dirname(video_path), exist_ok=True)

    try:
        with open(video_path, "wb") as buffer:
            shutil.copyfileobj(video.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save video: {str(e)}")

    # Create new menu item and save to database
    new_item = models.Menu(
        dish_name=dish_name,
        category_id=category_id,
        dish_type=dish_type,
        price=price,
        image_path=unique_image_filename,
        video_path=unique_video_filename  # Saving video path to database
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)

    return {"message": f"Item added to menu with ID {new_item.id}"}



@app.get("/dishes/")
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
            "dish_type": dish.dish_type,
            "price": dish.price,
            "image_path": f"/static/images/{dish.image_path}",
            "video_path": f"/static/videos/{dish.video_path}" if dish.video_path else None  # Handle NULL values
        }
        for dish in dishes
    ]


@app.put("/update-dish/{id}")
async def update_dish(
    id: int,
    dish_name: str = Form(...),
    category_id: int = Form(...),
    dish_type: str = Form(...),
    price: float = Form(...),
    image: UploadFile = File(None),
    video: UploadFile = File(None),  # Added parameter for video
    db: Session = Depends(get_db),
):
    dish = db.query(models.Menu).filter(models.Menu.id == id).first()
    if not dish:
        raise HTTPException(status_code=404, detail="Dish not found")

    dish.dish_name, dish.category_id, dish.dish_type, dish.price = dish_name, category_id, dish_type, price

    # Update image if provided
    if image:
        file_extension = image.filename.split(".")[-1].lower()
        if file_extension not in {"jpg", "jpeg", "png"}:
            raise HTTPException(status_code=400, detail="Invalid file type")

        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        file_path = os.path.join("static/images", unique_filename)
        os.makedirs(os.path.dirname(file_path), exist_ok=True)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        old_image_path = os.path.join("static/images", dish.image_path)
        if os.path.exists(old_image_path):
            os.remove(old_image_path)

        dish.image_path = unique_filename

    # Update video if provided
    if video:
        video_extension = video.filename.split(".")[-1].lower()
        if video_extension not in {"mp4", "avi", "mov", "mkv"}:
            raise HTTPException(status_code=400, detail="Invalid video file type.")

        unique_video_filename = f"{uuid.uuid4()}.{video_extension}"
        video_file_path = os.path.join("static/videos", unique_video_filename)
        os.makedirs(os.path.dirname(video_file_path), exist_ok=True)

        with open(video_file_path, "wb") as buffer:
            shutil.copyfileobj(video.file, buffer)

        old_video_path = os.path.join("static/videos", dish.video_path)
        if os.path.exists(old_video_path):
            os.remove(old_video_path)

        dish.video_path = unique_video_filename

    db.commit()
    db.refresh(dish)

    return {"message": "Dish updated successfully"}



@app.delete("/delete/{id}")
def delete_item(id: int, db: Session = Depends(get_db)):
    item = db.query(models.Menu).filter(models.Menu.id == id).first()
    if not item:
        raise HTTPException(status_code=404, detail=f"Menu item with ID {id} not found.")

    if os.path.exists(os.path.join("static/images", item.image_path)):
        os.remove(os.path.join("static/images", item.image_path))

    if os.path.exists(os.path.join("static/videos", item.video_path)):
        os.remove(os.path.join("static/videos", item.video_path))

    db.delete(item)
    db.commit()
    
    return {"message": f"{item.dish_name} Deleted Successfully."}
