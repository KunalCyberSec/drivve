from sqlalchemy.orm import Session
from . import models, schemas

def get_user_by_mobile(db: Session, mobile: str):
    return db.query(models.User).filter(models.User.mobile == mobile).first()

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(mobile=user.mobile)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_otp(db: Session, otp: schemas.OTPCreate):
    db_otp = models.OTP(user_id=otp.user_id, otp_code=otp.otp_code)
    db.add(db_otp)
    db.commit()
    db.refresh(db_otp)
    return db_otp

def verify_otp(db: Session, user_id: int, otp_code: str):
    otp = db.query(models.OTP).filter(
        models.OTP.user_id == user_id,
        models.OTP.otp_code == otp_code,
        models.OTP.is_used == False
    ).first()
    if otp:
        otp.is_used = True
        user = db.query(models.User).filter(models.User.id == user_id).first()
        if user:
            user.is_verified = True
        db.commit()
        return True
    return False
