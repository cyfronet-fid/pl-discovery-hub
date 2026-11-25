# pylint: disable=missing-module-docstring,missing-class-docstring
from typing import ClassVar, Optional

from pydantic import BaseModel

from app.sentry import SentryContext
from app.settings import Url


class SentryConfigurationResponse(BaseModel):
    """The values that start the Sentry SDK of the UI."""

    COMPONENT: ClassVar[str] = "ui"

    dsn: str
    environment: str
    release: Optional[str]
    tags: dict[str, str]

    @classmethod
    def from_context(
        cls, context: SentryContext
    ) -> Optional["SentryConfigurationResponse"]:
        """Give no values when Sentry is off, the same switch as the API."""
        if not context.enabled:
            return None

        return cls(
            dsn=context.dsn,
            environment=context.environment,
            release=context.release,
            tags=context.tags(cls.COMPONENT),
        )


class ConfigurationResponse(BaseModel):
    eu_marketplace_url: Url
    pl_marketplace_url: Url
    eosc_commons_url: Url
    eosc_commons_env: str
    eosc_explore_url: Url
    eosc_helpdesk_form_url: Url
    helpdesk_target_id: int
    knowledge_hub_url: Url
    is_sort_by_relevance: bool
    max_results_by_page: int
    max_items_sort_relevance: int
    show_beta_collections: bool
    show_knowledge_base: bool
    # Both are None unless Matomo is enabled
    matomo_url: Optional[Url] = None
    matomo_site_id: Optional[int] = None
    sentry: Optional[SentryConfigurationResponse] = None
