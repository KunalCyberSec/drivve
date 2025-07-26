from fastapi import APIRouter, HTTPException, Query
from typing import List
import httpx

router = APIRouter()

BASE_API_URL = "https://countriesnow.space/api/v0.1/countries"

@router.get("/countries", response_model=List[str])
async def get_countries():
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(f"{BASE_API_URL}")
            response.raise_for_status()
            data = response.json()
            if data and "data" in data and isinstance(data["data"], list):
                return [country["country"] for country in data["data"]]
            raise HTTPException(status_code=500, detail="Invalid response format from external API")
        except httpx.HTTPError as e:
            raise HTTPException(status_code=502, detail=f"External API error: {str(e)}")

@router.get("/states", response_model=List[str])
async def get_states(country: str = Query(..., description="Country name")):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(f"{BASE_API_URL}/states", json={"country": country})
            response.raise_for_status()
            data = response.json()
            if data and "data" in data and "states" in data["data"] and isinstance(data["data"]["states"], list):
                return [state["name"] for state in data["data"]["states"]]
            raise HTTPException(status_code=500, detail="Invalid response format from external API")
        except httpx.HTTPError as e:
            raise HTTPException(status_code=502, detail=f"External API error: {str(e)}")

@router.get("/cities", response_model=List[str])
async def get_cities(country: str = Query(..., description="Country name"), state: str = Query(..., description="State name")):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(f"{BASE_API_URL}/state/cities", json={"country": country, "state": state})
            response.raise_for_status()
            data = response.json()
            if data and "data" in data and isinstance(data["data"], list):
                return data["data"]
            raise HTTPException(status_code=500, detail="Invalid response format from external API")
        except httpx.HTTPError as e:
            raise HTTPException(status_code=502, detail=f"External API error: {str(e)}")
