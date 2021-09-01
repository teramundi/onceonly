import secrets
from fastapi.exceptions import HTTPException
from fastapi.param_functions import Depends
from fastapi.security.http import HTTPBasic, HTTPBasicCredentials
from app.database import SessionLocal
from app.repository import LogRepository, SecretRepository
from app.services import CaptchaValidator, LogService, RandomPasswdGenerator, SecretService, SaltGenerator
from app.settings import settings

security = HTTPBasic()

def get_admin_user(credentials: HTTPBasicCredentials = Depends(security)):
    correct_username = secrets.compare_digest(credentials.username.strip(), settings.admin_user)
    correct_password = secrets.compare_digest(credentials.password.strip(), settings.admin_pass)
    if not (correct_username and correct_password):
        raise HTTPException(
            status_code=401,
            detail="Incorrect admin user or password",
            headers={
                "WWW-Authenticate": "Basic"
            },
        )
    return credentials


def db_session() -> SessionLocal:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def captcha_validator() -> CaptchaValidator:
    return CaptchaValidator(settings.recaptcha_secret, settings.recaptcha_bypass_code)

def random_passwd_generator() -> RandomPasswdGenerator:
    return RandomPasswdGenerator(settings.random_passwd_length)

def salt_generator() -> SaltGenerator:
    return SaltGenerator(settings.random_salt_length)

def secret_repository(db = Depends(db_session)) -> SecretRepository:
    return SecretRepository(db)

def log_repository(db = Depends(db_session)) -> LogRepository:
    return LogRepository(db)

def log_service(repository = Depends(log_repository)) -> LogService:
    return LogService(repository)

def secret_service(
    repository = Depends(secret_repository),
    passwd_generator = Depends(random_passwd_generator),
    salt_generator = Depends(salt_generator),
    log_service = Depends(log_service)
) -> SecretService:
    return SecretService(
        repository,
        passwd_generator,
        salt_generator,
        log_service,
        settings.secret_min_days,
        settings.secret_max_days,
    )
