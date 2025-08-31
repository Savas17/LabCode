from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from bson import ObjectId


# Replace this with your Atlas connection string and db name
MONGO_URI = "mongodb+srv://Syed_Saquib:6DFiuCI6BNrJkJ9q@cluster0.umlx5az.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
DB_NAME = "LabCode"  # use your DB name here


app = FastAPI()

# Enable CORS for all origins (adjust as needed in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Initialize MongoDB client and get database and collections
client = MongoClient(MONGO_URI)
db = client[DB_NAME]
folders_col = db["folders"]
files_col = db["files"]

# -----------------------------------------------------------
# Helper functions: Convert MongoDB documents to JSON-friendly format
# -----------------------------------------------------------

def serialize_folder(folder):
    """ Convert a folder document from MongoDB to a JSON serializable dict """
    folder["id"] = str(folder["_id"])          # Convert ObjectId to string for 'id'
    folder.pop("_id", None)                     # Remove the internal _id field
    if folder.get("parent_id"):
        folder["parent_id"] = str(folder["parent_id"])  # Convert parent_id ObjectId if present
    if "subfolders" not in folder:
        folder["subfolders"] = []               # Ensure 'subfolders' key exists as list
    return folder

def serialize_file(file):
    """ Convert a file document from MongoDB to a JSON serializable dict """
    file["id"] = str(file["_id"])               # Convert ObjectId to string for 'id'
    file.pop("_id", None)                        # Remove the internal _id field
    if file.get("folder_id"):
        file["folder_id"] = str(file["folder_id"])  # Convert folder_id ObjectId if present
    return file

# -----------------------------------------------------------
# Folder endpoints
# -----------------------------------------------------------

@app.get("/folders")
def get_folders():
    """
    Get all top-level folders where parent_id is None (root folders)
    """
    folders = list(folders_col.find({"parent_id": None}))
    return [serialize_folder(f) for f in folders]

def find_folder_by_name(name: str):
    """
    Helper to find a single folder by name (case-sensitive exact match)
    """
    folder = folders_col.find_one({"name": name})
    return folder

@app.get("/folders/search/{name}")
def search_folder(name: str):
    """
    Search folder by name and return serialized folder details
    """
    folder = find_folder_by_name(name)
    if not folder:
        raise HTTPException(status_code=404, detail="Folder not found")
    return serialize_folder(folder)

@app.post("/folders")
def create_folder(folder: dict):
    """
    Create a new folder. Accepts a dict with 'name' and optional 'parent_id'.
    Initializes 'subfolders' as empty list.
    """
    parent_id = folder.get("parent_id")
    folder_doc = {
        "name": folder["name"],
        "parent_id": ObjectId(parent_id) if parent_id else None,
        "subfolders": [],
    }
    result = folders_col.insert_one(folder_doc)
    folder_doc["_id"] = result.inserted_id
    return serialize_folder(folder_doc)

@app.get("/folders/{folder_id}")
def get_folder(folder_id: str):
    """
    Retrieve a folder by its id, including its subfolders and files nested inside.
    """
    folder = folders_col.find_one({"_id": ObjectId(folder_id)})
    if not folder:
        raise HTTPException(status_code=404, detail="Folder not found")
    # Query nested subfolders and files belonging to this folder
    subfolders = list(folders_col.find({"parent_id": ObjectId(folder_id)}))
    files = list(files_col.find({"folder_id": ObjectId(folder_id)}))
    folder["subfolders"] = [serialize_folder(sf) for sf in subfolders]
    folder["files"] = [serialize_file(f) for f in files]
    return serialize_folder(folder)

# -----------------------------------------------------------
# File endpoints
# -----------------------------------------------------------

@app.post("/folders/{folder_id}/files")
def create_file_in_folder(folder_id: str, file: dict):
    """
    Create a new file inside a folder specified by folder_id.
    Validates folder existence before creating.
    """
    if not folders_col.find_one({"_id": ObjectId(folder_id)}):
        raise HTTPException(status_code=404, detail="Folder not found")
    file_doc = {
        "name": file["name"],
        "language": file["language"],
        "content": file["content"],
        "folder_id": ObjectId(folder_id),
    }
    result = files_col.insert_one(file_doc)
    file_doc["_id"] = result.inserted_id
    return serialize_file(file_doc)

@app.put("/folders/{folder_id}/files/{file_id}")
def update_file_in_folder(folder_id: str, file_id: str, updated_file: dict):
    """
    Update an existing file by file_id inside a given folder.
    Only updates fields provided in updated_file dict.
    """
    if not folders_col.find_one({"_id": ObjectId(folder_id)}):
        raise HTTPException(status_code=404, detail="Folder not found")
    upd = {
        "name": updated_file.get("name"),
        "language": updated_file.get("language"),
        "content": updated_file.get("content"),
    }
    result = files_col.update_one(
        {"_id": ObjectId(file_id), "folder_id": ObjectId(folder_id)},
        {"$set": {k: v for k, v in upd.items() if v is not None}},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="File not found")
    file = files_col.find_one({"_id": ObjectId(file_id)})
    return serialize_file(file)

# -----------------------------------------------------------
# Delete endpoints
# -----------------------------------------------------------

@app.delete("/folders/{folder_id}")
def delete_folder(folder_id: str):
    """
    Delete a folder by id, and recursively delete all its subfolders and files inside.
    """
    def _cascade_delete(fid):
        # Recursively delete subfolders
        subfolders = list(folders_col.find({"parent_id": ObjectId(fid)}))
        for sf in subfolders:
            _cascade_delete(str(sf["_id"]))
        # Delete folder and all files in it
        folders_col.delete_one({"_id": ObjectId(fid)})
        files_col.delete_many({"folder_id": ObjectId(fid)})

    if not folders_col.find_one({"_id": ObjectId(folder_id)}):
        raise HTTPException(status_code=404, detail="Folder not found")

    _cascade_delete(folder_id)
    return {"message": "Folder deleted successfully"}

@app.delete("/folders/{folder_id}/files/{file_id}")
def delete_file(folder_id: str, file_id: str):
    """
    Delete a file by id inside a given folder.
    """
    result = files_col.delete_one({"_id": ObjectId(file_id), "folder_id": ObjectId(folder_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="File not found")
    return {"message": "File deleted successfully"}
