# pylint: disable=no-member
"""The application tasks"""

import logging
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.settings import settings

logger = logging.getLogger(__name__)


def create_session_local() -> sessionmaker:
    """Just creates a new session_local"""
    engine = create_engine(
        settings.DATABASE_URI.unicode_string(), future=True, echo=True
    )
    return sessionmaker(engine)


def connect_to_db(app: FastAPI, session_local: sessionmaker) -> None:
    """Connect to DB"""
    try:
        # pylint: disable=protected-access
        app.state._db = session_local()
    except Exception as e:  # pylint: disable=broad-exception-caught
        logger.warning("--- DB CONNECTION ERROR ---")
        logger.warning(e)
        logger.warning("--- DB CONNECTION ERROR ---")


def close_db_connection(app: FastAPI) -> None:
    """Close connection to DB"""
    try:
        # pylint: disable=protected-access
        app.state._db.close()
    except Exception as e:  # pylint: disable=broad-exception-caught
        logger.warning("--- DB DISCONNECT ERROR ---")
        logger.warning(e)
        logger.warning("--- DB DISCONNECT ERROR ---")


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Connect to DB on startup and close the connection on shutdown"""
    connect_to_db(app, create_session_local())
    yield
    close_db_connection(app)
