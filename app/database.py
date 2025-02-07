from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import DeclarativeMeta, declarative_base


DATABASE_URL = "postgresql://sourabh:0PK7ZJmAUVqYFBRF9hY1XNkchmgHtyVD@dpg-cuirc0rqf0us73dt6kbg-a/digitalmenu_db_iovn"
engine = create_engine(DATABASE_URL)



# DATABASE_URL = "sqlite:///./database.db"
# engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base: DeclarativeMeta = declarative_base()

