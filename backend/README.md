# EOSC Search Service - backend

## Setting up environment

Install the Python version from `.tool-versions` and
[uv](https://docs.astral.sh/uv/getting-started/installation/).

To install the dependencies (including the dev group) into `backend/.venv`:
```shell
uv sync
```

Settings are read from the root `.env` file. Unlike pipenv, `uv run` does not load
`backend/.env`; if you keep variables there, pass it explicitly:
`uv run --env-file .env <command>`.


## Database

The DB can be run using docker-compose in the root directory.
```console
docker-compose up db
```

It spawns a database on `localhost:5442`.

### Migrations

To run missing migrations: `uv run alembic upgrade head`.

To auto-generate migrations after models changes:
`uv run alembic revision --autogenerate -m "<revision message>"`.


### Seed

To create basic DB seed, run:
```shell
uv run python -m app.manager db seed-basic
```

Available seeds:
- `seed-basic`
- `seed-oag-1`
- `seed-oag-2`


## Running in console

To run in console, ensure you have spun up required services (e.g. migrated db, Solr, etc.) and execute:
```shell
uv run uvicorn app.main:app
```

To reload on changes:
```shell
uv run uvicorn app.main:app --reload
```


## Styles

```console
uv run black alembic app tests
uv run isort .
uv run pylint app tests
```


## Running tests

You need to run the test services first `docker-compose -f dc-test.yml up -d`.

```console
ENVIRONMENT=test uv run pytest
```

To skip integration tests:
```console
ENVIRONMENT=test SOLR_URL=http://localhost:8993/solr/ uv run pytest -m "not integration"
```
