from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import DeclarativeMeta, declarative_base


# DATABASE_URL = "postgresql://sourabh:l9f62a1TA0JVPwWjO9YIbclmn532HHny@dpg-cuiadgogph6c73eibs20-a.oregon-postgres.render.com/digitalmenu_db_k2wp"
# engine = create_engine(DATABASE_URL)



DATABASE_URL = "sqlite:///./database.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base: DeclarativeMeta = declarative_base()

