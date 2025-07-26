from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from typing import Dict
import random
import time
from sqlalchemy import Table, Column, String, MetaData, select
from ..db import database, metadata
from .statecity import router as statecity_router
from .emailapi import router as emailapi_router

router = APIRouter()

users = Table(
    "users",
    metadata,
    Column("mobile", String, primary_key=True),
    Column("is_authenticated", String, default="false"),
)

otps = Table(
    "otps",
    metadata,
    Column("mobile", String, primary_key=True),
    Column("otp", String),
    Column("expiry", String),
)

class SendOtpRequest(BaseModel):
    mobile: str

class VerifyOtpRequest(BaseModel):
    mobile: str
    otp: str

def generate_otp() -> str:
    return f"{random.randint(100000, 999999)}"

@router.post("/send-otp")
async def send_otp(request: SendOtpRequest):
    otp = generate_otp()
    expiry = str(time.time() + 300)  # 5 minutes expiry
    existing = await database.fetch_one(select(otps).where(otps.c.mobile == request.mobile))
    if existing:
        query = otps.update().where(otps.c.mobile == request.mobile).values(otp=otp, expiry=expiry)
    else:
        query = otps.insert().values(mobile=request.mobile, otp=otp, expiry=expiry)
    await database.execute(query)
    print(f"Sending OTP {otp} to mobile {request.mobile}")
    return {"message": "OTP sent successfully"}

@router.post("/verify-otp")
async def verify_otp(request: VerifyOtpRequest):
    query = select(otps).where(otps.c.mobile == request.mobile)
    record = await database.fetch_one(query)
    if not record:
        raise HTTPException(status_code=400, detail="OTP not found or expired")
    otp, expiry = record["otp"], float(record["expiry"])
    if time.time() > expiry:
        delete_query = otps.delete().where(otps.c.mobile == request.mobile)
        await database.execute(delete_query)
        raise HTTPException(status_code=400, detail="OTP expired")
    if request.otp != otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    delete_query = otps.delete().where(otps.c.mobile == request.mobile)
    await database.execute(delete_query)
    user_query = select(users).where(users.c.mobile == request.mobile)
    user = await database.fetch_one(user_query)
    if not user:
        insert_user = users.insert().values(mobile=request.mobile, is_authenticated="true")
        await database.execute(insert_user)
    else:
        update_user = users.update().where(users.c.mobile == request.mobile).values(is_authenticated="true")
        await database.execute(update_user)
    return {"message": "OTP verified successfully", "authenticated": True}

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, mobile: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[mobile] = websocket

    def disconnect(self, mobile: str):
        self.active_connections.pop(mobile, None)

    async def send_personal_message(self, message: str, mobile: str):
        websocket = self.active_connections.get(mobile)
        if websocket:
            await websocket.send_text(message)

manager = ConnectionManager()

@router.websocket("/ws/{mobile}")
async def websocket_endpoint(websocket: WebSocket, mobile: str):
    await manager.connect(mobile, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.send_personal_message(f"Message text was: {data}", mobile)
    except WebSocketDisconnect:
        manager.disconnect(mobile)

# Admin endpoints

from fastapi import Query

@router.get("/admin/users")
async def get_users(skip: int = 0, limit: int = 100):
    query = users.select().offset(skip).limit(limit)
    result = await database.fetch_all(query)
    return [{"mobile": r["mobile"], "is_authenticated": r["is_authenticated"]} for r in result]

@router.put("/admin/users/{mobile}")
async def update_user(mobile: str, is_authenticated: str = Query(None)):
    query = users.update().where(users.c.mobile == mobile)
    values = {}
    if is_authenticated is not None:
        values["is_authenticated"] = is_authenticated
    if not values:
        return {"message": "No update fields provided"}
    query = query.values(**values)
    await database.execute(query)
    return {"message": f"User {mobile} updated successfully"}

@router.get("/admin/stats")
async def get_stats():
    total_users_query = users.count()
    total_users = await database.fetch_val(total_users_query)
    verified_users_query = users.count().where(users.c.is_authenticated == "true")
    verified_users = await database.fetch_val(verified_users_query)
    return {
        "total_users": total_users,
        "verified_users": verified_users,
    }

# Include the new statecity router
router.include_router(statecity_router, prefix="/statecity", tags=["statecity"])

# Include the new emailapi router
router.include_router(emailapi_router, prefix="/emailapi", tags=["emailapi"])
