from typing import Set
from pydantic import BaseSettings


class Settings(BaseSettings):
    # Project
    PROJECT_NAME: str = 'OnceOn.ly'
    PROJECT_VERSION: str = '1.0.0'

    # API Cors
    cors_allow_origins: Set[str] = set()
    cors_allow_methods: Set[str] = set(['*'])
    cors_allow_headers: Set[str] = set(['*'])
    cors_allow_credentials: bool = True

    # Logs access control
    admin_user: str = 'admin'
    admin_pass: str = 'changeit!'

    # Secret config
    secret_min_days: int = 1
    secret_max_days: int = 30
    secret_max_subject_length: int = 128
    secret_max_body_length: int = 102400

    # Length for Random Password
    random_passwd_length: int = 16
    # Length for Password Salt
    random_salt_length: int = 16

    debug: bool = False

    # ORM
    database_url: str = "sqlite:///./data/app.db"

    # reCaptcha
    recaptcha_secret: str
    recaptcha_bypass_code: str

    class Config:
        env_file = ".env"

settings = Settings()
