from pydantic import BaseModel

class UserBase(BaseModel):
    mobile: str

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: int
    is_verified: bool

    class Config:
        orm_mode = True

class OTPBase(BaseModel):
    user_id: int
    otp_code: str

class OTPCreate(OTPBase):
    pass

class OTP(OTPBase):
    id: int
    is_used: bool

    class Config:
        orm_mode = True
