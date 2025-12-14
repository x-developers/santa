from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from .database import Base
import secrets


class Game(Base):
    __tablename__ = "games"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True)
    name = Column(String, nullable=True)
    shuffled = Column(Boolean, default=False)

    participants = relationship("Participant", back_populates="game", cascade="all, delete-orphan")

    @staticmethod
    def generate_code():
        return secrets.token_urlsafe(6)


class Participant(Base):
    __tablename__ = "participants"

    id = Column(Integer, primary_key=True, index=True)
    game_id = Column(Integer, ForeignKey("games.id"))
    name = Column(String)
    wishlist = Column(String, nullable=True)
    token = Column(String, unique=True, index=True)
    receiver_id = Column(Integer, ForeignKey("participants.id"), nullable=True)

    game = relationship("Game", back_populates="participants")
    receiver = relationship("Participant", remote_side=[id], foreign_keys=[receiver_id])

    @staticmethod
    def generate_token():
        return secrets.token_urlsafe(8)
