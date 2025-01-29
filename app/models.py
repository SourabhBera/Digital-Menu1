from sqlalchemy import Column, Integer, String, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship
from database import Base


class Category(Base):
    __tablename__ = 'category'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)

    # Establish a relationship with the Menu table
    menus = relationship("Menu", back_populates="category")

from sqlalchemy import Column, Integer, String, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship
from models import Base  # Assuming this Base is defined in your models setup

class Menu(Base):
    __tablename__ = 'menu'

    id = Column(Integer, primary_key=True, index=True)
    dish_name = Column(String, nullable=False)
    category_id = Column(Integer, ForeignKey("category.id"), nullable=False)
    dish_type = Column(String, nullable=False)
    price = Column(Integer, nullable=False)
    image_path = Column(String, nullable=True)

    # Establish a relationship with the Category table
    category = relationship("Category", back_populates="menus")

    # Updated CHECK constraint to allow more types of dishes
    __table_args__ = (
        CheckConstraint(
            "dish_type IN ('Veg', 'Non-Veg', 'Vegetarian', 'Non-Vegetarian', 'Vegan')",
            name="check_dish_type"
        ),
    )

