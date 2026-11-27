# pylint: disable=missing-module-docstring,missing-function-docstring

import os
from datetime import datetime, timezone

import pytest
import schemathesis
from hypothesis import HealthCheck, settings
from sqlalchemy.orm import Session

from app.models import Dump, DumpElement

pytest.skip("Enable when we will work with db", allow_module_level=True)

schema = schemathesis.openapi.from_path(
    os.path.dirname(__file__) + "/../eosc-search-service-v1.yaml"
)


@schema.parametrize()
@settings(suppress_health_check=[HealthCheck.function_scoped_fixture])
async def test_empty_db(case, managed_app) -> None:
    case.call_and_validate(app=managed_app)


@schema.parametrize()
@settings(suppress_health_check=[HealthCheck.function_scoped_fixture])
# pylint: disable=redefined-outer-name,unused-argument
async def test_non_empty_db(case, managed_app, prepare_db) -> None:
    case.call_and_validate(app=managed_app)


@pytest.fixture
def prepare_db(db: Session) -> None:
    s3_prefix = "https://s3.example.org"
    dump = Dump(
        name="foo",
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
        elements=[
            DumpElement(
                name=f"file_{el_name}",
                reference_type="s3:v1",
                reference=f"{s3_prefix}/foo/v1/{el_name}",
            )
            for el_name in ["bar", "baz", "baz/bar"]
        ],
    )
    db.add(dump)
    db.commit()
