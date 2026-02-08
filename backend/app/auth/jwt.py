"""JWT verification middleware for Better Auth tokens."""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt

from app.config import settings

security = HTTPBearer()


async def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> str:
    """Extract and verify user ID from JWT Bearer token.

    Returns the user_id claim from a valid JWT token.
    Raises 401 if token is missing, invalid, or expired.
    """
    token = credentials.credentials
    try:
        payload = jwt.decode(
            token,
            settings.better_auth_secret,
            algorithms=[settings.jwt_algorithm],
        )
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: missing user identifier",
            )
        return user_id
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )
