FROM python:3.14.3

COPY --from=ghcr.io/astral-sh/uv:0.13.10 /uv /uvx /bin/

WORKDIR /app

# Don't write pyc files to disk
ENV PYTHONDONTWRITEBYTECODE 1
# Don't buffer stdout and stderr
ENV PYTHONUNBUFFERED 1

# Fresh system CA bundle (outdated CAs break TLS during login)
RUN apt-get update \
    && apt-get upgrade -y \
    && apt-get install -y --no-install-recommends ca-certificates \
    && update-ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Make requests/httpx/ssl use the system store instead of the bundled certifi one
ENV SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt
ENV REQUESTS_CA_BUNDLE=/etc/ssl/certs/ca-certificates.crt

# Install locked dependencies into /app/.venv (no dev group)
ENV UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy \
    UV_PYTHON_DOWNLOADS=never
COPY pyproject.toml uv.lock .python-version /app/
RUN uv sync --locked --no-dev --no-install-project
ENV PATH="/app/.venv/bin:$PATH"

RUN useradd --create-home --uid 1000 app

COPY --chown=app:app alembic alembic
COPY --chown=app:app alembic.ini .
COPY --chown=app:app app app

USER app

CMD ["uvicorn", "--host", "0.0.0.0", "--port", "8000", "app.main:app"]
