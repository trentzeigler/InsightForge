from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


class AuthRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)


class UserResponse(BaseModel):
    id: UUID
    email: EmailStr
    created_at: datetime

    class Config:
        orm_mode = True


class AuthResponse(BaseModel):
    user: UserResponse
    session_expires_at: datetime
