from datetime import date
from typing import List, Optional
from fastapi import Depends, FastAPI, Request, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security.http import HTTPBasicCredentials
from app.database import Base, engine
from app.errors import CaptchaError, InvalidDaysValueException
from app.settings import settings
from app.services import CaptchaValidator, LogService, SecretService
from app.schemas import CreateSecretRequest, CreateSecretResponse, LogResponse, RevealSecretResponse
from app.deps import get_admin_user, secret_service, log_service, captcha_validator

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_allow_origins,
    allow_credentials=settings.cors_allow_credentials,
    allow_methods=settings.cors_allow_methods,
    allow_headers=settings.cors_allow_headers,
)


@app.post("/secrets", response_model=CreateSecretResponse, status_code=201)
def create_secret(
    data: CreateSecretRequest,
    request: Request,
    user_agent: Optional[str] = Header(None),
    captcha_validator: CaptchaValidator = Depends(captcha_validator),
    service: SecretService = Depends(secret_service),
):
    try:
        captcha_validator.validate(data.captcha)

        secret = service.create_secret(
            subject=data.subject,
            body=data.body,
            days=data.days,
            client_user_agent=user_agent,
            client_address=request.client.host,
        )
        return CreateSecretResponse(
            password=secret.password,
            subject=secret.subject,
            expires_in=secret.expires_in,
        )
    except CaptchaError as e:
        raise HTTPException(status_code=400, detail=e.message)
    except InvalidDaysValueException as e:
        raise HTTPException(status_code=400, detail='Invalid expiration days sent')
    except Exception as e:
        if settings.debug:
            print('DEBUG >> {}'.format(e))
        raise HTTPException(status_code=500, detail='Unknown error')


@app.get("/secrets/{password}", response_model=RevealSecretResponse)
def get_secret(
    password: str,
    request: Request,
    user_agent: Optional[str] = Header(None),
    service: SecretService = Depends(secret_service),
):
    secret = service.reveal_secret(
        password=password,
        client_user_agent=user_agent,
        client_address=request.client.host,
    )
    if not secret:
        raise HTTPException(status_code=404, detail="Secret not found")
    return RevealSecretResponse(
        subject=secret.subject,
        body=secret.body,
    )


@app.get("/logs", response_model=List[LogResponse])
def get_logs(
    offset: Optional[int] = 0,
    limit: Optional[int] = 20,
    action: Optional[str] = None,
    secret_subject: Optional[str] = None,
    client_address: Optional[str] = None,
    client_user_agent: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    service: LogService = Depends(log_service),
    credentials: HTTPBasicCredentials = Depends(get_admin_user),
):
    return service.get_logs(
        offset=offset,
        limit=limit,
        action=action,
        secret_subject=secret_subject,
        client_address=client_address,
        client_user_agent=client_user_agent,
        start_date=start_date,
        end_date=end_date,
    )
