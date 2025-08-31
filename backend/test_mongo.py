from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://mdkasifrazakhan1812_db_user:VIetriC9EMYzMWhI@cluster0.ldxpzh3.mongodb.net/codeshare?retryWrites=true&w=majority&appName=Cluster0")

try:
    client = MongoClient(MONGO_URI)
    db = client.codeshare
    
    # Test connection
    db.command("ping")
    print("✅ MongoDB connection successful!")
    
    # Test basic operations
    test_collection = db.test
    result = test_collection.insert_one({"test": "data"})
    print(f"✅ Insert test successful: {result.inserted_id}")
    
    # Clean up test
    test_collection.delete_one({"_id": result.inserted_id})
    print("✅ Database operations working!")
    
except Exception as e:
    print(f"❌ MongoDB connection failed: {e}")