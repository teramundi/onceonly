import unittest
from unittest.mock import MagicMock
from app.models import Log, Secret
from app.repository import LogRepository

from app.services import LogService


class TestLogService(unittest.TestCase):

    TEST_LOG_ID = 123

    def setUp(self) -> None:
        self.log = Log()
        self.log.id = 123

        self.all_logs = [self.log]

        self.repository = LogRepository(db=None)
        def on_save_log(log):
            log.id = self.TEST_LOG_ID
            return log
        self.repository.get_all = MagicMock(return_value=self.all_logs)
        self.repository.save = MagicMock(side_effect=on_save_log)

        self.service = LogService(self.repository)


    def test_get_all(self):
        offset = 10
        limit = 200
        logs = self.service.get_logs(offset=offset, limit=limit)

        self.repository.get_all.assert_called_once_with(
            offset=10,
            limit=200,
            action=None,
            secret_subject=None,
            client_address=None,
            client_user_agent=None,
            start_date=None,
            end_date=None
        )
        
        self.assertEqual(len(logs), len(self.all_logs))
        self.assertEqual(logs[0].id, self.log.id)


    def test_create_log(self):
        secret = Secret()
        action = Log.ADD
        client_address = 'client_ip'
        client_user_agent = 'user_agent'

        log = self.service.create_log(
            secret=secret,
            action=action,
            client_address=client_address,
            client_user_agent=client_user_agent,
        )

        self.repository.save.assert_called_once()
        
        self.assertIsNotNone(log)
        self.assertEqual(log.id, self.TEST_LOG_ID)
        self.assertEqual(log.action, action)
        self.assertEqual(log.client_address, client_address)
        self.assertEqual(log.client_user_agent, client_user_agent)
    