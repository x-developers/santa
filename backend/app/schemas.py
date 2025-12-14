from pydantic import BaseModel
from typing import Optional, List


class ParticipantCreate(BaseModel):
    name: str
    wishlist: Optional[str] = None


class ParticipantResponse(BaseModel):
    id: int
    name: str
    wishlist: Optional[str] = None
    token: str

    class Config:
        from_attributes = True


class ParticipantPublic(BaseModel):
    id: int
    name: str
    wishlist: Optional[str] = None

    class Config:
        from_attributes = True


class GameCreate(BaseModel):
    name: Optional[str] = None


class GameResponse(BaseModel):
    id: int
    code: str
    name: Optional[str] = None
    shuffled: bool
    participants: List[ParticipantResponse] = []

    class Config:
        from_attributes = True


class AssignmentResponse(BaseModel):
    participant_name: str
    receiver_name: str
    receiver_wishlist: Optional[str] = None


class MyAssignmentResponse(BaseModel):
    my_name: str
    receiver_name: str
    receiver_wishlist: Optional[str] = None
