from datetime import datetime
from fastapi import Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.core.security import (
    generate_session_token,
    get_session_expiry,
    hash_password,
    verify_password,
)
from app.models import SessionToken, User


def create_user(db: Session, email: str, password: str) -> User:
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    user = User(email=email, hashed_password=hash_password(password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, email: str, password: str) -> User:
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    return user


def create_session(db: Session, user: User) -> SessionToken:
    token = generate_session_token()
    session = SessionToken(token=token, user_id=user.id, expires_at=get_session_expiry())
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


def destroy_session(db: Session, token: str) -> None:
    db.query(SessionToken).filter(SessionToken.token == token).delete()
    db.commit()


def get_user_from_session(db: Session, token: str) -> User:
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing session token")

    session = db.query(SessionToken).filter(SessionToken.token == token).first()
    if not session or session.expires_at < datetime.utcnow():
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session expired")

    user = db.query(User).filter(User.id == session.user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


def get_current_user(
    request: Request,
    db: Session = Depends(get_db),
):
    token = request.cookies.get(settings.session_cookie_name)
    return get_user_from_session(db, token)
