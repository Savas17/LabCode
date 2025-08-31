from pydantic import BaseModel
from typing import Optional

class FileCreate(BaseModel):
    name: str
    language: str
    content: str

class FileUpdate(BaseModel):
    name: Optional[str] = None
    language: Optional[str] = None
    content: Optional[str] = None

class FolderCreate(BaseModel):
    name: str
    parent_id: Optional[str] = None
