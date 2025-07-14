from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

class Participant(BaseModel):
    name: str

class Winner(BaseModel):
    name: str
    position: int
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    total_participants: int

class Game(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    participants: List[str] = Field(default_factory=list)
    winners: List[Winner] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True

class GameCreate(BaseModel):
    participants: List[str] = Field(default_factory=list)

class GameUpdate(BaseModel):
    participants: Optional[List[str]] = None

class SpinRequest(BaseModel):
    game_id: str

class SpinResponse(BaseModel):
    winner: Winner
    remaining_participants: List[str]
    total_winners: int