web: cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT
worker: cd backend && celery -A app.celery_app worker --loglevel=info
beat: cd backend && celery -A app.celery_app beat --loglevel=info
release: cd backend && python -m alembic upgrade head

