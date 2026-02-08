"""Health check endpoint."""

from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
async def health_check():
    """Return API health status."""
    return {"status": "ok", "version": "0.1.0"}
