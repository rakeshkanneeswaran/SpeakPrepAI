# ---- Base Image ----
FROM python:3.11-slim AS base

# Set environment vars for Python
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    POETRY_VERSION=2.1.4 \
    PATH="/root/.local/bin:$PATH"

WORKDIR /app

# ---- Install System Dependencies ----
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential curl && \
    rm -rf /var/lib/apt/lists/*

# ---- Install Poetry ----
RUN pip install --no-cache-dir poetry==$POETRY_VERSION

# ---- Copy Dependency Files ----
COPY pyproject.toml poetry.lock ./

# ---- Install Dependencies (Production only) ----
RUN poetry config virtualenvs.create false \
    && poetry install --no-root --no-interaction --no-ansi

# ---- Copy Source Code ----
COPY . .

# ---- Expose Port (Cloud Run expects 8080) ----
EXPOSE 8080

# ---- Run App via Gunicorn + Uvicorn ----
CMD ["gunicorn", "main:app", "-k", "uvicorn.workers.UvicornWorker", "--workers", "4", "--bind", "0.0.0.0:8080"]