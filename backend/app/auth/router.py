from fastapi import APIRouter, Depends, Request, Response
from sqlalchemy.orm import Session

from app.auth.schemas import AuthRequest, AuthResponse, UserResponse
from app.auth.service import (
    authenticate_user,
    create_session,
    create_user,
    destroy_session,
    get_current_user,
)
from app.core.config import settings
from app.core.database import get_db

router = APIRouter()


def _attach_session_cookie(response: Response, token: str, expires_at):
    max_age = settings.session_lifetime_minutes * 60
    response.set_cookie(
        key=settings.session_cookie_name,
        value=token,
        httponly=True,
        secure=False if settings.environment == "local" else True,
        samesite="lax",
        max_age=max_age,
        expires=expires_at,
    )


@router.post("/register", response_model=AuthResponse)
def register(payload: AuthRequest, response: Response, db: Session = Depends(get_db)):
    user = create_user(db, payload.email, payload.password)
    session = create_session(db, user)
    _attach_session_cookie(response, session.token, session.expires_at)
    return AuthResponse(user=user, session_expires_at=session.expires_at)


@router.post("/login", response_model=AuthResponse)
def login(payload: AuthRequest, response: Response, db: Session = Depends(get_db)):
    user = authenticate_user(db, payload.email, payload.password)
    session = create_session(db, user)
    _attach_session_cookie(response, session.token, session.expires_at)
    return AuthResponse(user=user, session_expires_at=session.expires_at)


@router.post("/logout")
def logout(request: Request, response: Response, db: Session = Depends(get_db)):
    token = request.cookies.get(settings.session_cookie_name)
    if token:
        destroy_session(db, token)
    response.delete_cookie(settings.session_cookie_name)
    return {"status": "logged_out"}


@router.get("/me", response_model=UserResponse)
def me(current_user=Depends(get_current_user)):
    return current_user
