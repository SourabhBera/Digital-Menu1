from fastapi import Depends, FastAPI, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
import schemas
import models
from database import engine, SessionLocal
import os
import shutil
import uuid
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

# Mount the static directory
app = FastAPI()

# Mount the static files directory
app.mount("/static", StaticFiles(directory="static"), name="static")

# Create database tables
models.Base.metadata.create_all(bind=engine)

origins = [
    "http://localhost:3000",  # React frontend
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)



# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



@app.get("/static/images/{image_name}")
async def get_image(image_name: str):
    image_path = os.path.join("static", "images", image_name)  # Path is relative to the root
    if os.path.exists(image_path):
        return FileResponse(image_path)
    else:
        raise HTTPException(status_code=404, detail="Image not found")



@app.get("/")
def get_menu(db: Session = Depends(get_db)):
    # Join the Menu table with the Category table to get the category name
    menu = db.query(models.Menu, models.Category.name.label("category_name")) \
              .join(models.Category, models.Menu.category_id == models.Category.id) \
              .all()
    
    # Return a list of dictionaries containing menu items and their category names
    result = [{"id": item.Menu.id, "dish_name": item.Menu.dish_name, "category_id": item.Menu.category_id, 
               "category_name": item.category_name, "dish_type": item.Menu.dish_type, 
               "price": item.Menu.price, "image_path": f"/static/images/{item.Menu.image_path.split('/')[-1]}"} 
              for item in menu]
    
    return result

# Category Management Endpoints
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
    return {
        "message": f"Category '{name}' created successfully",
        "category_id": new_category.id
    }


@app.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(models.Category).all()
    return categories

@app.put("/update-category/{id}")
def update_category(id: int, request: schemas.CategoryCreate, db: Session = Depends(get_db)):
    # Fetch the category to update
    category = db.query(models.Category).filter(models.Category.id == id).first()

    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    # Validate the new name
    new_name = request.name
    print(new_name, "-------------------------")
    if not new_name:
        raise HTTPException(status_code=400, detail="New category name cannot be empty")
    if db.query(models.Category).filter(models.Category.name.ilike(new_name)).first():
        raise HTTPException(status_code=400, detail="Category with this name already exists")

    # Update and commit the changes
    category.name = new_name
    db.commit()
    db.refresh(category)

    return {
        "message": f"Category with ID {id} updated successfully",
        "updated_category": {"id": category.id, "name": category.name},
    }

# Dish Management Endpoints
@app.post("/admin/add-dishes")
async def add_item(
    dish_name: str = Form(...),
    category_id: int = Form(...),
    dish_type: str = Form(...),
    price: float = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Validate category existence
    category = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=400, detail="Invalid category")

    # Validate file extension
    file_extension = image.filename.split(".")[-1].lower()
    allowed_extensions = ["jpg", "jpeg", "png"]
    if file_extension not in allowed_extensions:
        raise HTTPException(
            status_code=400, detail="Invalid file type. Only jpg, jpeg, and png are allowed."
        )

    # Create a unique file name and path
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    # Save the file to the specified directory
    file_path = os.path.join("static/images", unique_filename)

    # Ensure the directory exists
    os.makedirs(os.path.dirname(file_path), exist_ok=True)

    # Save the file
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")


    # Save the new item to the database
    try:
        new_item = models.Menu(
            dish_name=dish_name,
            category_id=category_id,
            dish_type=dish_type,
            price=price,
            image_path=unique_filename,  # Save only the filename, not the full path
        )
        db.add(new_item)
        db.commit()
        db.refresh(new_item)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    return {"message": f"Item added to menu with ID {new_item.id}"}




@app.put("/update-dish/{id}")
def update_dish(id: int, request: schemas.AddMenu, db: Session = Depends(get_db)):
    item_query = db.query(models.Menu).filter(models.Menu.id == id)
    item = item_query.first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Menu with item id {id} not found.")

    if request.category_id:
        category = db.query(models.Category).filter(models.Category.id == request.category_id).first()
        if not category:
            raise HTTPException(status_code=400, detail="Invalid category")

    update_data = request.dict(exclude_unset=True)
    item_query.update(update_data, synchronize_session=False)
    db.commit()

    return {"message": f"Item with id {id} updated successfully."}


@app.delete("/delete/{id}")
def delete_item(id: int, db: Session = Depends(get_db)):
    item_query = db.query(models.Menu).filter(models.Menu.id == id)
    item = item_query.first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Menu with item id {id} not found.")

    try:
        if os.path.exists(os.path.join("static/images", item.image_path)):
            os.remove(os.path.join("static/images", item.image_path))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting file: {str(e)}")

    db.delete(item)
    db.commit()
    return {"message": f"Item deleted with id {id}."}
