# ==========================================
# Stage 1 — Base
# ==========================================

FROM python:3.12-slim AS base

# Prevent Python from creating .pyc files
ENV PYTHONDONTWRITEBYTECODE=1

# Send Python output directly to stdout/stderr
ENV PYTHONUNBUFFERED=1

# Poetry configuration
ENV POETRY_VERSION=2.1.3
ENV POETRY_NO_INTERACTION=1
ENV POETRY_VIRTUALENVS_CREATE=false

WORKDIR /app


# ==========================================
# Stage 2 — Dependencies
# ==========================================

FROM base AS deps

# System dependencies required for Poetry
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry
RUN pip install --no-cache-dir "poetry==$POETRY_VERSION"

# Copy dependency files first
# This allows Docker to cache dependency installation.
COPY pyproject.toml poetry.lock ./

# Install Python dependencies
RUN poetry install --only main --no-root


# ==========================================
# Stage 3 — Application
# ==========================================

FROM base AS runner

WORKDIR /app

# Copy installed Python packages
COPY --from=deps /usr/local/lib/python3.12/site-packages \
    /usr/local/lib/python3.12/site-packages

COPY --from=deps /usr/local/bin \
    /usr/local/bin

# Copy application
COPY . .

# Runtime configuration
ENV HOST=0.0.0.0
ENV PORT=8000

# FastAPI port
EXPOSE 8000

# Start FastAPI
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]