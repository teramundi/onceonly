import unittest
from unittest import mock
from unittest.mock import MagicMock
from datetime import timedelta
from app.errors import InvalidDaysValueException
from app.models import Log, Secret
from app.repository import SecretRepository
from app.services import LogService, RandomPasswdGenerator, SecretService, SaltGenerator
from app.settings import settings


class TestSecretService(unittest.TestCase):

    TEST_PASSWD = 'aU.OZn_zVc~Tlq-5'

    def setUp(self) -> None:
        self.log = Log()
        self.log.id = 123

        self.passwd_generator = RandomPasswdGenerator(16)
        self.salt_generator = SaltGenerator(16)

        self.log_service = LogService(repository=None)
        self.log_service.create_log = MagicMock(return_value=self.log)

        self.secret_repository = SecretRepository(db=None)
        def on_save_secret(secret):
            secret.id = 1
            return secret
        self.secret_repository.save = MagicMock(side_effect=on_save_secret)


        self.secret_service = SecretService(
            repository=self.secret_repository,
            passwd_generator=self.passwd_generator,
            salt_generator=self.salt_generator,
            log_service=self.log_service,
            secret_min_days=settings.secret_min_days,
            secret_max_days=settings.secret_max_days,
        )

        secret = Secret()
        passwd_hash = self.secret_service.hash(self.TEST_PASSWD)
        secret.passwd_hash = passwd_hash
        secrets = { passwd_hash: secret }
        def on_get_by_passwd_hash(passwd_hash):
            if passwd_hash in secrets:
                return secrets[passwd_hash]
            return None
        def on_remove_secret(secret):
            secrets.pop(secret.passwd_hash)
        self.secret_repository.get_by_passwd_hash = MagicMock(side_effect=on_get_by_passwd_hash)
        self.secret_repository.remove = MagicMock(side_effect=on_remove_secret)


    def test_create_secret_with_days_less_than_min(self):
        self.assert_invalid_days(settings.secret_min_days - 1)


    def test_create_secret_with_days_greater_than_max(self):
        self.assert_invalid_days(settings.secret_max_days + 1)


    def test_create_secret(self):
        subject = 'subject'
        body = 'body'
        days = 1
        client_address = 'client_address'
        client_user_agent = 'client_user_agent'

        secret = self.secret_service.create_secret(
            subject=subject,
            body=body,
            days=days,
            client_address=client_address,
            client_user_agent=client_user_agent,
        )

        self.secret_repository.save.assert_called_once()
        self.log_service.create_log.assert_called_once_with(
            secret=secret,
            action=Log.ADD,
            client_address=client_address,
            client_user_agent=client_user_agent
        )
        
        self.assertIsNotNone(secret)
        self.assertEqual(secret.id, 1)
        self.assertEqual(secret.subject, subject)
        self.assertEqual(secret.expires_in, secret.created_at + timedelta(days))


    def test_reveal_secret(self):
        client_address = 'client_address'
        client_user_agent = 'client_user_agent'

        secret = self.secret_service.reveal_secret(
            password=self.TEST_PASSWD,
            client_address=client_address,
            client_user_agent=client_user_agent,
        )

        self.secret_repository.remove.assert_called_once()
        self.log_service.create_log.assert_called_once_with(
            secret=secret,
            action=Log.VIEW,
            client_address=client_address,
            client_user_agent=client_user_agent
        )
        
        self.assertIsNotNone(secret)
        self.assertEqual(secret.passwd_hash, self.secret_service.hash(self.TEST_PASSWD))

        secret = self.secret_service.reveal_secret(
            password=self.TEST_PASSWD,
            client_address=client_address,
            client_user_agent=client_user_agent,
        )
        
        self.assertIsNone(secret)
    

    def assert_invalid_days(self, days: int):
        subject = 'subject'
        body = 'body'
        client_address = 'client_address'
        client_user_agent = 'client_user_agent'

        with self.assertRaises(InvalidDaysValueException):
            self.secret_service.create_secret(
                subject=subject,
                body=body,
                days=days,
                client_address=client_address,
                client_user_agent=client_user_agent,
            )
