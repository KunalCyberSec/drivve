import os
import databases
import sqlalchemy

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:Drivve@db:5432/drivve_db")

database = databases.Database(DATABASE_URL)
metadata = sqlalchemy.MetaData()

engine = sqlalchemy.create_engine(DATABASE_URL)
