class CaptchaError(Exception):
    def __init__(self, message: str) -> None:
        self.message = message

class SecretError(Exception):
    pass


class InvalidDaysValueException(SecretError):
    pass
