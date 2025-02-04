from sqlalchemy import Column, Integer, String, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship
from database import Base
from sqlalchemy import Column, Integer, String, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship
from models import Base  

class Category(Base):
    __tablename__ = 'category'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    menus = relationship("Menu", back_populates="category")

class Menu(Base):
    __tablename__ = 'menu'

    id = Column(Integer, primary_key=True, index=True)
    dish_name = Column(String, nullable=False)
    category_id = Column(Integer, ForeignKey("category.id"), nullable=False)
    dish_type = Column(String, nullable=False)
    description=Column(String, nullable=True)
    price = Column(Integer, nullable=False)
    image_path = Column(String, nullable=True)
    video_path = Column(String, nullable=True)

    category = relationship("Category", back_populates="menus")

    __table_args__ = (
        CheckConstraint(
            "dish_type IN ('Veg', 'Non-Veg', 'Vegetarian', 'Non-Vegetarian', 'Vegan')",
            name="check_dish_type"
        ),
    )

