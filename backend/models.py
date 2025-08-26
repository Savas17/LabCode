from sqlalchemy import Column, Integer, String, Text
from .database import Base

class CodeFile(Base):
    __tablename__ = "codefiles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    language = Column(String, index=True)
    content = Column(Text)
