from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    mobile = Column(String, unique=True, index=True, nullable=False)
    is_verified = Column(Boolean, default=False)

class OTP(Base):
    __tablename__ = "otps"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    otp_code = Column(String, nullable=False)
    is_used = Column(Boolean, default=False)
