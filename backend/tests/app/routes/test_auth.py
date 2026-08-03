# pylint: disable=missing-module-docstring,missing-function-docstring
from unittest.mock import patch

import httpx
import pytest
from fastapi import status
from httpx import AsyncClient

from app.settings import settings

original_get = AsyncClient.get
dummy_request = httpx.Request(
    "GET", f"{settings.PL_MARKETPLACE_BASE_URL}/api/v1/users/test"
)


def mock_marketplace_get(marketplace_response: httpx.Response):
    async def mock_get(self, url, *args, **kwargs):
        url_str = str(url)
        if settings.PL_MARKETPLACE_BASE_URL in url_str:
            return marketplace_response
        return await original_get(self, url, *args, **kwargs)

    return mock_get


@pytest.mark.asyncio
async def test_user_roles_unauthenticated(client: AsyncClient) -> None:
    response = await client.get("/api/web/auth/user-roles")
    assert response.status_code in (
        status.HTTP_401_UNAUTHORIZED,
        status.HTTP_403_FORBIDDEN,
    )


@pytest.mark.asyncio
async def test_user_roles_success(auth_client: AsyncClient) -> None:
    marketplace_res = httpx.Response(
        status_code=200,
        json={"roles": ["admin", "coordinator"]},
        request=dummy_request,
    )
    with patch.object(AsyncClient, "get", mock_marketplace_get(marketplace_res)):
        response = await auth_client.get("/api/web/auth/user-roles")
        assert response.status_code == status.HTTP_200_OK
        assert response.json() == ["admin", "coordinator"]


@pytest.mark.asyncio
async def test_user_roles_success_no_roles(auth_client: AsyncClient) -> None:
    marketplace_res = httpx.Response(
        status_code=200,
        json={"roles": []},
        request=dummy_request,
    )
    with patch.object(AsyncClient, "get", mock_marketplace_get(marketplace_res)):
        response = await auth_client.get("/api/web/auth/user-roles")
        assert response.status_code == status.HTTP_200_OK
        assert response.json() == []


@pytest.mark.asyncio
async def test_user_roles_marketplace_401(auth_client: AsyncClient) -> None:
    marketplace_res = httpx.Response(
        status_code=401,
        json={"detail": "Unauthorized"},
        request=dummy_request,
    )
    with patch.object(AsyncClient, "get", mock_marketplace_get(marketplace_res)):
        response = await auth_client.get("/api/web/auth/user-roles")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert response.json()["detail"] == "Invalid marketplace token"


@pytest.mark.asyncio
async def test_user_roles_marketplace_404(auth_client: AsyncClient) -> None:
    marketplace_res = httpx.Response(
        status_code=404,
        json={"detail": "Not found"},
        request=dummy_request,
    )
    with patch.object(AsyncClient, "get", mock_marketplace_get(marketplace_res)):
        response = await auth_client.get("/api/web/auth/user-roles")
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert "not found" in response.json()["detail"]


@pytest.mark.asyncio
async def test_user_roles_unexpected_error(auth_client: AsyncClient) -> None:
    marketplace_res = httpx.Response(
        status_code=500,
        request=dummy_request,
    )
    with patch.object(AsyncClient, "get", mock_marketplace_get(marketplace_res)):
        response = await auth_client.get("/api/web/auth/user-roles")
        assert response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR
