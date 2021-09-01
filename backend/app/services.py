import base64
import secrets
import hashlib
import requests
from requests.models import HTTPError
from datetime import date, datetime, time, timedelta
from typing import List
from sqlalchemy.exc import IntegrityError
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.scrypt import Scrypt

from app.settings import settings
from app.errors import CaptchaError, InvalidDaysValueException
from app.repository import LogRepository, SecretRepository
from app.models import Log, Secret

class CaptchaValidator:

    def __init__(self, captcha_secret_key: str, captcha_bypass_code: str):
        self.captcha_secret_key = captcha_secret_key
        self.captcha_bypass_code = captcha_bypass_code

    def validate(self, value: str):
        if value == self.captcha_bypass_code:
            return
        try:
            payload = {
                'secret': self.captcha_secret_key,
                'response': value,
            }
            resp = requests.post("https://www.google.com/recaptcha/api/siteverify", data=payload)
            resp.raise_for_status()
            if not resp.json()['success']:
                raise CaptchaError("Captcha validation error")
        except HTTPError:
            raise CaptchaError("Error trying to validate reCaptcha")


class RandomPasswdGenerator:

    CHARS = 'ABCDEFGHIJKLMNOPQRSTUVXWYZabcdefghijklmnopqrstuvxwyz0123456789-_~.'

    def __init__(self, size: int) -> None:
        self.size = size

    def generate(self) -> str:
        return ''.join(secrets.choice(self.CHARS) for _ in range(self.size))

class SaltGenerator:

    def __init__(self, size: int) -> None:
        self.size = size

    def generate(self) -> bytes:
        return base64.urlsafe_b64encode(secrets.token_bytes(self.size))

class Crypt:

    def __init__(self, salt: str, passwd: str) -> str:
        self.salt = salt
        self.passwd = passwd

    def generate_key(self) -> str:
        kdf = Scrypt(
                salt=self.salt,
                length=32,
                n=2**18,
                r=8,
                p=1
        )
        key = kdf.derive(self.passwd.encode())
        return base64.urlsafe_b64encode(key)

    def encrypt(self, secret: str) -> str:
        f = Fernet(self.generate_key())
        return f.encrypt(secret.encode())

    def decrypt(self, secret: bytes) -> str:
        f = Fernet(self.generate_key())
        return f.decrypt(secret)

class LogService:

    def __init__(self, repository: LogRepository) -> None:
        self.repository = repository


    def create_log(
        self,
        action: str,
        client_address: str,
        client_user_agent: str,
        secret: Secret = None,
        password: str = None,
    ) -> Log:
        log = Log()
        log.action = action
        log.created_at = datetime.now()
        log.client_address = client_address
        log.client_user_agent = client_user_agent
        log.password = password
        if secret:
            log.secret_passwd_hash = secret.passwd_hash
            log.secret_subject = secret.subject
            log.secret_created_at = secret.created_at
            log.secret_expires_in = secret.expires_in
        return self.repository.save(log)

    def get_logs(
        self,
        limit: int,
        offset: int=0,
        action: str = None,
        secret_subject: str = None,
        client_address: str = None,
        client_user_agent: datetime = None,
        start_date: date = None,
        end_date: date = None,
    ) -> List[Log]:
        start_datetime = None
        if start_date:
            start_datetime = datetime.combine(start_date, time(0,0,0))
        end_datetime= None
        if end_date:
            end_datetime = datetime.combine(end_date, time(23, 59, 59))

        return self.repository.get_all(
            offset=offset,
            limit=limit,
            action=action,
            secret_subject=secret_subject,
            client_address=client_address,
            client_user_agent=client_user_agent,
            start_datetime=start_datetime,
            end_datetime=end_datetime,
        )


class SecretService:

    def __init__(
        self,
        repository: SecretRepository,
        passwd_generator: RandomPasswdGenerator,
        salt_generator: SaltGenerator,
        log_service: LogService,
        secret_min_days: int,
        secret_max_days: int,
    ) -> None:
        self.repository = repository
        self.passwd_generator = passwd_generator
        self.salt_generator = salt_generator
        self.log_service = log_service
        self.secret_min_days = secret_min_days
        self.secret_max_days = secret_max_days


    def create_secret(
        self,
        subject: str,
        body: str,
        days: int,
        client_address: str,
        client_user_agent: str,
    ) -> Secret:
        if days < self.secret_min_days or days > self.secret_max_days:
            raise InvalidDaysValueException()
        saved = False
        secret = Secret()
        secret.subject = subject
        while not saved:
            try:
                secret.password = self.passwd_generator.generate()
                secret.key_salt = self.salt_generator.generate()
                crypt = Crypt(secret.key_salt, secret.password)
                secret.body = crypt.encrypt(body)
                secret.passwd_hash = self.hash(secret.password)
                now = datetime.now()
                secret.created_at = now
                secret.expires_in = now + timedelta(days)
                secret = self.repository.save(secret)
                saved = True
            except IntegrityError:
                # passwd_hash unique constraint
                pass
            except Exception as e:
                if settings.debug:
                    print('DEBUG >> {}'.format(e))
        self.log_service.create_log(
            secret=secret,
            action=Log.ADD,
            client_address=client_address,
            client_user_agent=client_user_agent
        )
        return secret


    def reveal_secret(
        self,
        password: str,
        client_address: str,
        client_user_agent: str,
    ) -> Secret:
        passwd_hash = self.hash(password)
        secret = self.repository.get_by_passwd_hash(passwd_hash)
        if secret:
            crypt = Crypt(secret.key_salt, password)
            secret.body = crypt.decrypt(secret.body)
            self.repository.remove(secret)
            is_expired = secret.expires_in < datetime.now()
            action = Log.EXPIRED if is_expired else Log.VIEW
            self.log_service.create_log(
                secret=secret,
                action=action,
                password=password,
                client_address=client_address,
                client_user_agent=client_user_agent
            )
            if is_expired:
                secret = None
        else:
            self.log_service.create_log(
                action=Log.VIEW,
                password=password,
                client_address=client_address,
                client_user_agent=client_user_agent
            )
        return secret


    def hash(self, value: str) -> str:
        return hashlib.sha256(value.encode()).hexdigest()
