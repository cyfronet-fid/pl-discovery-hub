# pylint: disable=missing-module-docstring,missing-class-docstring

from enum import Enum

from pydantic import BaseModel, EmailStr


class ResourceOption(Enum):
    SERVICE = "service"
    DATA_SOURCE = "data_source"
    OTHER = "other"


class BecomeProviderForm(BaseModel):
    email: EmailStr
    option: ResourceOption
    message: str
