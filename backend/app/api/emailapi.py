from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel, EmailStr
from typing import Dict
import random
import smtplib
from email.mime.text import MIMEText
from datetime import datetime, timedelta

router = APIRouter()

# Store OTPs with expiration time
otp_storage: Dict[str, Dict[str, any]] = {}

# Email credentials (you can use environment variables in production)
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SENDER_EMAIL = "15.04.25ai@gmail.com"  # change this to your sender email
SENDER_PASSWORD = "bstu wgyt hezi gcug"  # for Gmail, generate app password

class EmailRequest(BaseModel):
    email: EmailStr

class OTPVerifyRequest(BaseModel):
    email: EmailStr
    otp: str

def generate_otp():
    """Generates a 6-digit OTP"""
    return str(random.randint(100000, 999999))

def send_otp_email(receiver_email: str, otp: str):
    subject = "Your One-Time Password (OTP)"
    body = (
        f"Dear User,\\n\\n"
        f"Your One-Time Password (OTP) for verification is: {otp}\\n\\n"
        f"This OTP is valid for 5 minutes. Please do not share this code with anyone.\\n\\n"
        f"If you did not request this, please ignore this email.\\n\\n"
        f"Note: This is an automated message. Please do not reply to this email.\\n\\n"
        f"Best regards,\\n"
        f"Your Support Team"
    )

    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = SENDER_EMAIL
    msg['To'] = receiver_email

    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.sendmail(SENDER_EMAIL, receiver_email, msg.as_string())
        print(f"OTP sent to {receiver_email}")
    except Exception as e:
        print(f"Failed to send OTP: {e}")
        raise HTTPException(status_code=500, detail="Failed to send OTP email. Please try again later.")

@router.post("/send-email-otp/")
async def send_otp(request: EmailRequest, background_tasks: BackgroundTasks):
    otp = generate_otp()
    expiration_time = datetime.utcnow() + timedelta(minutes=5)

    otp_storage[request.email] = {
        "otp": otp,
        "expires_at": expiration_time
    }

    # Send OTP in background
    background_tasks.add_task(send_otp_email, request.email, otp)

    return {"message": f"OTP sent to {request.email}"}

@router.post("/verify-email-otp/")
async def verify_otp(request: OTPVerifyRequest):
    record = otp_storage.get(request.email)

    if not record:
        raise HTTPException(status_code=404, detail="No OTP request found for this email")

    if datetime.utcnow() > record["expires_at"]:
        otp_storage.pop(request.email, None)  # Clean up expired OTP
        raise HTTPException(status_code=400, detail="OTP expired")

    if request.otp != record["otp"]:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    # OTP verified, cleanup
    otp_storage.pop(request.email, None)

    return {"message": "OTP verified successfully!"}
