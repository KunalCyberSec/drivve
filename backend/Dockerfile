FROM python:3.11-slim

WORKDIR /app

COPY ./app /app
COPY ./docker-compose.yml /app/docker-compose.yml
COPY requirements.txt /app/requirements.txt

RUN apt-get update && apt-get install -y gcc libpq-dev && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt

ENV PYTHONPATH=/app

RUN pip install --no-cache-dir --upgrade pip uvicorn

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
