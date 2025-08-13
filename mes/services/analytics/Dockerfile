# syntax=docker/dockerfile:1
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt ./requirements.txt
RUN pip install -r requirements.txt
COPY app ./app
ENV PORT=5000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "5000"]