#!/bin/bash

echo "Pulling the latest changes..."
git stash
git pull origin master

echo "Activating virtual environment..."
source venv/bin/activate.fish

echo "Installing dependencies..."
pip install -r requirements.txt

echo "Applying migrations..."
python3 manage.py migrate

echo "Collecting static files..."
python3 manage.py collectstatic --noinput

echo "Restarting Gunicorn..."
pkill gunicorn

echo "Restarting Celery worker..."
pkill -f "celery worker"
nohup celery -A backend worker --loglevel=info > celery_worker.log 2>&1 &
# nohup gunicorn --bind 0.0.0.0:8000 backend.wsgi:application > gunicorn.log 2>&1 &
nohup python3 manage.py  runserver > server.log 2>&1 &

echo "Deployment completed!"
