import secrets
from datetime import datetime, timedelta
from passlib.context import CryptContext

from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    return pwd_context.verify(password, hashed_password)


def generate_session_token() -> str:
    return secrets.token_urlsafe(48)


def get_session_expiry() -> datetime:
    return datetime.utcnow() + timedelta(minutes=settings.session_lifetime_minutes)
