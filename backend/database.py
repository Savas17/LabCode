from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

MONGO_URL = "mongodb://localhost:27017"
client = AsyncIOMotorClient(MONGO_URL)

db = client["code_sharing_app"]  # database name
folders_collection = db["folders"]
files_collection = db["files"]

# Helper to convert Mongo _id to str
def to_dict(doc):
    if not doc:
        return None
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    return doc
