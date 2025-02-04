from pydantic import BaseModel, Field, field_validator, EmailStr
from typing import Literal
from fastapi import UploadFile

class AddMenu(BaseModel):
    dish_name: str = Field(..., max_length=100, description="Name of the dish")
    category: str = Field(..., max_length=50, description="Category of the dish (e.g., Appetizer, Main Course)")
    dish_type: Literal['Veg', 'Non-veg']  # Restrict values to 'veg' or 'nonveg'
    price: int = Field(..., gt=0, description="Price of the dish in integer format")
    description: str = Field(..., max_length=200, description="Description of the dish")
    image: UploadFile  # To handle image file upload
    video: UploadFile  # To handle image file upload

    # Validators
    @field_validator('dish_name')
    def validate_dish_name(cls, value):
        if not value.strip():
            raise ValueError("Dish name cannot be empty.")
        return value

    @field_validator('category')
    def validate_category(cls, value):
        if not value.strip():
            raise ValueError("Category cannot be empty.")
        return value


class CategoryCreate(BaseModel):
    name: str
