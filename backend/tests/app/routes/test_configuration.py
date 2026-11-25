# pylint: disable=missing-module-docstring,missing-function-docstring
import pytest
from fastapi import FastAPI
from httpx import AsyncClient
from starlette.status import HTTP_200_OK

from app.settings import settings


@pytest.mark.asyncio
async def test_return_backend_config(app: FastAPI, client: AsyncClient) -> None:
    response = await client.get(app.url_path_for("web:configuration"))

    assert response.status_code == HTTP_200_OK
    assert response.json() == {
        "eosc_commons_env": "beta",
        "eosc_commons_url": "https://s3.cloud.cyfronet.pl/eosc-pl-common/",
        "eu_marketplace_url": "https://userspace.sandbox.eosc-beyond.eu/",
        "pl_marketplace_url": "https://marketplace.eosc.pl/",
        "eosc_explore_url": "https://explore.sandbox.eosc-beyond.eu/",
        "eosc_helpdesk_form_url": "https://helpdesk.sandbox.eosc-beyond.eu/assets/form/form.js",
        "helpdesk_target_id": 38,
        "knowledge_hub_url": "https://knowledge-hub.sandbox.eosc-beyond.eu/",
        "is_sort_by_relevance": True,
        "max_results_by_page": 50,
        "max_items_sort_relevance": 250,
        "show_beta_collections": False,
        "show_knowledge_base": True,
        "matomo_url": None,
        "matomo_site_id": None,
        "sentry": None,
    }


@pytest.mark.asyncio
async def test_return_sentry_config_when_sentry_is_on(
    app: FastAPI, client: AsyncClient, monkeypatch: pytest.MonkeyPatch
) -> None:
    monkeypatch.setattr(settings, "SENTRY_DSN", "https://key@sentry.test/1")
    monkeypatch.setattr(settings, "SENTRY_ENVIRONMENT", "staging")
    monkeypatch.setattr(settings, "SENTRY_RELEASE", "abc123")
    monkeypatch.setattr(settings, "SENTRY_VARIANT", "dh")
    monkeypatch.setattr(settings, "UI_BASE_URL", "https://search.test/")

    response = await client.get(app.url_path_for("web:configuration"))

    assert response.status_code == HTTP_200_OK
    assert response.json()["sentry"] == {
        "dsn": "https://key@sentry.test/1",
        "environment": "staging",
        "release": "abc123",
        "tags": {
            "variant": "dh",
            "instance": "search.test",
            "component": "ui",
        },
    }


@pytest.mark.asyncio
async def test_config_has_no_matomo_target_when_matomo_is_off(
    app: FastAPI, client: AsyncClient, monkeypatch: pytest.MonkeyPatch
) -> None:
    monkeypatch.setattr(settings, "MATOMO_ENABLED", False)
    monkeypatch.setattr(settings, "MATOMO_URL", "https://matomo.example.org/")
    monkeypatch.setattr(settings, "MATOMO_SITE_ID", 7)

    response = await client.get(app.url_path_for("web:configuration"))

    assert response.json()["matomo_url"] is None
    assert response.json()["matomo_site_id"] is None


@pytest.mark.asyncio
async def test_config_has_matomo_target_when_matomo_is_on(
    app: FastAPI, client: AsyncClient, monkeypatch: pytest.MonkeyPatch
) -> None:
    monkeypatch.setattr(settings, "MATOMO_ENABLED", True)
    monkeypatch.setattr(settings, "MATOMO_URL", "https://matomo.example.org/")
    monkeypatch.setattr(settings, "MATOMO_SITE_ID", 7)

    response = await client.get(app.url_path_for("web:configuration"))

    assert response.json()["matomo_url"] == "https://matomo.example.org/"
    assert response.json()["matomo_site_id"] == 7
