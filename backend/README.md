# onceonly backend

Python API to handle and store the secrets.


## About

The onceonly backend API is written using [FastAPI framework](https://fastapi.tiangolo.com/) and [SQLAlchemy ORM](https://docs.sqlalchemy.org/).


## Requirements

- Python 3.8
- Pipenv


## Installing

To install all python dependencies we must use `pipenv`:

```
pipenv install
```

or

```
python -m pipenv install
```


## Configuring

Below we see all environment variables required to start the backend:

- **RECAPTCHA_SECRET**: The reCaptcha v3 secret key
- **RECAPTCHA_BYPASS_CODE**: The pass code used to bypass the reCaptcha validation
- **CORS_ALLOW_ORIGINS**: Array of allowed origins (CORS)
- **RANDOM_KEY_LENGTH**: The length of the random public key used to generate the secret link

ps: For more options in the [settings.py](app/settings.py) file.


We can also create a `.env` file at backend root directory to define these variables:

```
RECAPTCHA_SECRET=<recaptcha-secret-key>
RECAPTCHA_BYPASS_CODE=<bypass-code>
CORS_ALLOW_ORIGINS='["http://127.0.0.1:3000", "http://localhost:3000" ]'
RANDOM_KEY_LENGTH=20
```

## Running

By default onceonly backend uses `uvicorn` to run the API:

```
uvicorn app.main:app
```

when developing we can use the `--reload` flag to auto reload changed files:

```
uvicorn app.main:app --reload
```

## Testing

All tests are located in the `tests` directory and to run we should use the `unittest` module:

```
python -m unittest discover -s tests/unit/
```
