from motor.motor_asyncio import AsyncIOMotorClient
import os

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'roulette_db')]

async def get_database():
    """Dependency to get database connection"""
    return db