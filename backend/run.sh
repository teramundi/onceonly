#!/usr/bin/env sh

if [ -z "${PORT}" ]; then
	uvicorn app.main:app --reload
else
	uvicorn app.main:app --reload --port=${PORT}
fi
