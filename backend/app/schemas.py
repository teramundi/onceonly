from datetime import datetime
from typing import Optional
from pydantic import BaseModel, constr
from app.settings import settings


class CreateSecretRequest(BaseModel):
    subject: Optional[constr(max_length=settings.secret_max_subject_length)]
    body: constr(max_length=settings.secret_max_body_length)
    days: int
    captcha: str


class CreateSecretResponse(BaseModel):
    password: str
    subject: str
    expires_in: datetime


class RevealSecretResponse(BaseModel):
    subject: str
    body: str


class LogResponse(BaseModel):
    id: int
    action: str
    password: Optional[str]
    secret_passwd_hash: Optional[str]
    secret_subject: Optional[str]
    secret_created_at: Optional[datetime]
    secret_expires_in: Optional[datetime]
    client_address: str
    client_user_agent: str
    created_at: datetime

    class Config:
        orm_mode = True

