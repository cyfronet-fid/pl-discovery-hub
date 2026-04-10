from pydantic import BaseModel, EmailStr
from enum import Enum

class ResourceOption(Enum):
    SERVICE = "service"
    DATA_SOURCE = "data_source"
    OTHER = "other"

class BecomeProviderForm(BaseModel):
    """Contact form model"""

    email: EmailStr
    option: ResourceOption
    message: str
