from fastapi import APIRouter, HTTPException, Depends
from typing import List
from datetime import datetime
import random

from models.game import Game, GameCreate, GameUpdate, SpinRequest, SpinResponse, Winner
from database import get_database

router = APIRouter(prefix="/api/roulette", tags=["roulette"])

@router.get("/game", response_model=Game)
async def get_current_game(db = Depends(get_database)):
    """Get the current active game"""
    game = await db.games.find_one({"is_active": True})
    if not game:
        # Create a default game if none exists
        default_participants = [
            "Ana García",
            "Carlos Rodríguez", 
            "María López",
            "José Martínez",
            "Laura González",
            "Pablo Sánchez"
        ]
        game_data = {
            "participants": default_participants,
            "winners": [],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "is_active": True
        }
        result = await db.games.insert_one(game_data)
        game = await db.games.find_one({"_id": result.inserted_id})
    
    # Convert MongoDB ObjectId to string for the response
    game["id"] = str(game["_id"])
    del game["_id"]
    return Game(**game)

@router.post("/game", response_model=Game)
async def create_game(game_data: GameCreate, db = Depends(get_database)):
    """Create a new game"""
    # Mark existing games as inactive
    await db.games.update_many({}, {"$set": {"is_active": False}})
    
    # Create new game
    game_dict = game_data.dict()
    game_dict.update({
        "winners": [],
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "is_active": True
    })
    
    result = await db.games.insert_one(game_dict)
    game = await db.games.find_one({"_id": result.inserted_id})
    
    game["id"] = str(game["_id"])
    del game["_id"]
    return Game(**game)

@router.put("/game/participants", response_model=Game)
async def update_participants(update_data: GameUpdate, db = Depends(get_database)):
    """Update participants in the current game"""
    game = await db.games.find_one({"is_active": True})
    if not game:
        raise HTTPException(status_code=404, detail="No active game found")
    
    update_dict = {
        "updated_at": datetime.utcnow()
    }
    
    if update_data.participants is not None:
        update_dict["participants"] = update_data.participants
    
    await db.games.update_one(
        {"_id": game["_id"]}, 
        {"$set": update_dict}
    )
    
    updated_game = await db.games.find_one({"_id": game["_id"]})
    updated_game["id"] = str(updated_game["_id"])
    del updated_game["_id"]
    return Game(**updated_game)

@router.post("/spin", response_model=SpinResponse)
async def spin_roulette(db = Depends(get_database)):
    """Spin the roulette and get a winner"""
    game = await db.games.find_one({"is_active": True})
    if not game:
        raise HTTPException(status_code=404, detail="No active game found")
    
    participants = game.get("participants", [])
    if len(participants) < 2:
        raise HTTPException(status_code=400, detail="At least 2 participants required")
    
    # Select random winner
    winner_name = random.choice(participants)
    
    # Create winner object
    winners = game.get("winners", [])
    position = len(winners) + 1
    
    winner = Winner(
        name=winner_name,
        position=position,
        timestamp=datetime.utcnow(),
        total_participants=len(participants)
    )
    
    # Remove winner from participants
    remaining_participants = [p for p in participants if p != winner_name]
    
    # Update game in database
    updated_winners = winners + [winner.dict()]
    await db.games.update_one(
        {"_id": game["_id"]},
        {
            "$set": {
                "participants": remaining_participants,
                "winners": updated_winners,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    return SpinResponse(
        winner=winner,
        remaining_participants=remaining_participants,
        total_winners=len(updated_winners)
    )

@router.get("/winners", response_model=List[Winner])
async def get_winners(db = Depends(get_database)):
    """Get all winners from the current game"""
    game = await db.games.find_one({"is_active": True})
    if not game:
        return []
    
    winners_data = game.get("winners", [])
    return [Winner(**winner) for winner in winners_data]

@router.delete("/game/reset", response_model=Game)
async def reset_game(db = Depends(get_database)):
    """Reset the current game"""
    game = await db.games.find_one({"is_active": True})
    if not game:
        raise HTTPException(status_code=404, detail="No active game found")
    
    # Reset to default participants
    default_participants = [
        "Ana García",
        "Carlos Rodríguez", 
        "María López",
        "José Martínez",
        "Laura González",
        "Pablo Sánchez"
    ]
    
    await db.games.update_one(
        {"_id": game["_id"]},
        {
            "$set": {
                "participants": default_participants,
                "winners": [],
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    updated_game = await db.games.find_one({"_id": game["_id"]})
    updated_game["id"] = str(updated_game["_id"])
    del updated_game["_id"]
    return Game(**updated_game)

@router.get("/participants", response_model=List[str])
async def get_participants(db = Depends(get_database)):
    """Get current participants"""
    game = await db.games.find_one({"is_active": True})
    if not game:
        return []
    
    return game.get("participants", [])