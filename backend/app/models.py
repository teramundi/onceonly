from sqlalchemy import Column, Integer, Text, String, DateTime
from app.database import Base


class Secret(Base):
    __tablename__ = "secrets"
    
    id = Column(Integer, primary_key=True, index=True)
    passwd_hash = Column(String(64), unique=True, index=True, nullable=False)
    key_salt = Column(String(64), nullable=False)
    subject = Column(Text, nullable=True)
    body = Column(Text, nullable=False)
    expires_in = Column(DateTime, nullable=False)
    created_at = Column(DateTime, nullable=False)

    # transient
    password: str


class Log(Base):
    __tablename__ = "logs"

    ADD = 'ADD'
    VIEW = 'VIEW'
    EXPIRED = 'EXPIRED'

    id = Column(Integer, primary_key=True, index=True)
    action = Column(String(10), index=True, nullable=False)
    secret_passwd_hash = Column(String(64), index=True)
    password = Column(String(64), index=True)
    secret_subject = Column(Text)
    secret_created_at = Column(DateTime)
    secret_expires_in = Column(DateTime)
    client_address = Column(String(39))
    client_user_agent = Column(String(300))
    created_at = Column(DateTime)
