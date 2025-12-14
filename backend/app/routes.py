from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import random

from .database import get_db
from .models import Game, Participant
from .schemas import (
    GameCreate, GameResponse, 
    ParticipantCreate, ParticipantResponse, ParticipantPublic,
    MyAssignmentResponse
)

router = APIRouter()


@router.post("/games", response_model=GameResponse)
def create_game(game: GameCreate, db: Session = Depends(get_db)):
    db_game = Game(code=Game.generate_code(), name=game.name)
    db.add(db_game)
    db.commit()
    db.refresh(db_game)
    return db_game


@router.get("/games/{code}", response_model=GameResponse)
def get_game(code: str, db: Session = Depends(get_db)):
    game = db.query(Game).filter(Game.code == code).first()
    if not game:
        raise HTTPException(status_code=404, detail="Игра не найдена")
    return game


@router.delete("/games/{code}")
def delete_game(code: str, db: Session = Depends(get_db)):
    game = db.query(Game).filter(Game.code == code).first()
    if not game:
        raise HTTPException(status_code=404, detail="Игра не найдена")
    db.delete(game)
    db.commit()
    return {"message": "Игра удалена"}


@router.post("/games/{code}/participants", response_model=ParticipantResponse)
def add_participant(code: str, participant: ParticipantCreate, db: Session = Depends(get_db)):
    game = db.query(Game).filter(Game.code == code).first()
    if not game:
        raise HTTPException(status_code=404, detail="Игра не найдена")
    
    if game.shuffled:
        raise HTTPException(status_code=400, detail="Нельзя добавлять участников после жеребьёвки")
    
    existing = db.query(Participant).filter(
        Participant.game_id == game.id,
        Participant.name.ilike(participant.name)
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Участник с таким именем уже есть")
    
    db_participant = Participant(
        game_id=game.id,
        name=participant.name,
        wishlist=participant.wishlist,
        token=Participant.generate_token()
    )
    db.add(db_participant)
    db.commit()
    db.refresh(db_participant)
    return db_participant


@router.delete("/games/{code}/participants/{participant_id}")
def remove_participant(code: str, participant_id: int, db: Session = Depends(get_db)):
    game = db.query(Game).filter(Game.code == code).first()
    if not game:
        raise HTTPException(status_code=404, detail="Игра не найдена")
    
    if game.shuffled:
        raise HTTPException(status_code=400, detail="Нельзя удалять участников после жеребьёвки")
    
    participant = db.query(Participant).filter(
        Participant.id == participant_id,
        Participant.game_id == game.id
    ).first()
    if not participant:
        raise HTTPException(status_code=404, detail="Участник не найден")
    
    db.delete(participant)
    db.commit()
    return {"message": "Участник удалён"}


@router.post("/games/{code}/shuffle")
def shuffle_game(code: str, db: Session = Depends(get_db)):
    game = db.query(Game).filter(Game.code == code).first()
    if not game:
        raise HTTPException(status_code=404, detail="Игра не найдена")
    
    participants = game.participants
    if len(participants) < 3:
        raise HTTPException(status_code=400, detail="Нужно минимум 3 участника")
    
    # Reset previous assignments
    for p in participants:
        p.receiver_id = None
    
    # Derangement shuffle (no one gets themselves)
    attempts = 0
    while attempts < 1000:
        shuffled = participants.copy()
        random.shuffle(shuffled)
        
        valid = all(p.id != shuffled[i].id for i, p in enumerate(participants))
        if valid:
            for i, giver in enumerate(participants):
                giver.receiver_id = shuffled[i].id
            game.shuffled = True
            db.commit()
            return {"message": "Жеребьёвка проведена!"}
        attempts += 1
    
    raise HTTPException(status_code=500, detail="Не удалось провести жеребьёвку")


@router.post("/games/{code}/reshuffle")
def reshuffle_game(code: str, db: Session = Depends(get_db)):
    game = db.query(Game).filter(Game.code == code).first()
    if not game:
        raise HTTPException(status_code=404, detail="Игра не найдена")
    
    game.shuffled = False
    db.commit()
    
    return shuffle_game(code, db)


@router.get("/participant/{token}", response_model=MyAssignmentResponse)
def get_my_assignment(token: str, db: Session = Depends(get_db)):
    participant = db.query(Participant).filter(Participant.token == token).first()
    if not participant:
        raise HTTPException(status_code=404, detail="Участник не найден")
    
    if not participant.game.shuffled:
        raise HTTPException(status_code=400, detail="Жеребьёвка ещё не проведена")
    
    if not participant.receiver:
        raise HTTPException(status_code=400, detail="Получатель не назначен")
    
    return MyAssignmentResponse(
        my_name=participant.name,
        receiver_name=participant.receiver.name,
        receiver_wishlist=participant.receiver.wishlist
    )
