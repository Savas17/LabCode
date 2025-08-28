from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory database
folders = []
folder_id_counter = 1
file_id_counter = 1


# 🟢 Helper: Find folder by ID (recursive)
def find_folder(folder_list, folder_id: int):
    for folder in folder_list:
        if folder["id"] == folder_id:
            return folder
        found = find_folder(folder["subfolders"], folder_id)
        if found:
            return found
    return None


# 🟢 Get top-level folders
@app.get("/folders")
def get_folders():
    return folders


# 🟢 Search folder by name (recursive)
def find_folder_by_name(folder_list, name: str):
    for folder in folder_list:
        if folder["name"].lower() == name.lower():
            return folder
        found = find_folder_by_name(folder["subfolders"], name)
        if found:
            return found
    return None


@app.get("/folders/search/{name}")
def search_folder(name: str):
    folder = find_folder_by_name(folders, name)
    if not folder:
        raise HTTPException(status_code=404, detail="Folder not found")
    return folder


# 🟢 Create folder
@app.post("/folders")
def create_folder(folder: dict):
    global folder_id_counter
    parent_id = folder.get("parent_id")
    new_folder = {
        "id": folder_id_counter,
        "name": folder["name"],
        "subfolders": [],
        "files": [],
        "parent_id": parent_id,
    }
    folder_id_counter += 1

    if parent_id:
        parent_folder = find_folder(folders, parent_id)
        if not parent_folder:
            raise HTTPException(status_code=404, detail="Parent folder not found")
        parent_folder["subfolders"].append(new_folder)
    else:
        folders.append(new_folder)

    return new_folder


# 🟢 View folder content
@app.get("/folders/{folder_id}")
def get_folder(folder_id: int):
    folder = find_folder(folders, folder_id)
    if not folder:
        raise HTTPException(status_code=404, detail="Folder not found")
    return folder


# 🟢 Create file inside folder
@app.post("/folders/{folder_id}/files")
def create_file_in_folder(folder_id: int, file: dict):
    global file_id_counter
    folder = find_folder(folders, folder_id)
    if not folder:
        raise HTTPException(status_code=404, detail="Folder not found")

    new_file = {
        "id": file_id_counter,
        "name": file["name"],
        "language": file["language"],
        "content": file["content"],
    }
    file_id_counter += 1
    folder["files"].append(new_file)
    return new_file


# 🟢 Update file
@app.put("/folders/{folder_id}/files/{file_id}")
def update_file_in_folder(folder_id: int, file_id: int, updated_file: dict):
    folder = find_folder(folders, folder_id)
    if not folder:
        raise HTTPException(status_code=404, detail="Folder not found")

    for f in folder["files"]:
        if f["id"] == file_id:
            f["name"] = updated_file.get("name", f["name"])
            f["language"] = updated_file.get("language", f["language"])
            f["content"] = updated_file.get("content", f["content"])
            return f

    raise HTTPException(status_code=404, detail="File not found")


# 🟢 Delete folder (recursive)
@app.delete("/folders/{folder_id}")
def delete_folder(folder_id: int):
    def _delete(folder_list, folder_id):
        for i, folder in enumerate(folder_list):
            if folder["id"] == folder_id:
                del folder_list[i]
                return True
            if _delete(folder["subfolders"], folder_id):
                return True
        return False

    if not _delete(folders, folder_id):
        raise HTTPException(status_code=404, detail="Folder not found")
    return {"message": "Folder deleted successfully"}


# 🟢 Delete file
@app.delete("/folders/{folder_id}/files/{file_id}")
def delete_file(folder_id: int, file_id: int):
    folder = find_folder(folders, folder_id)
    if not folder:
        raise HTTPException(status_code=404, detail="Folder not found")

    for i, f in enumerate(folder["files"]):
        if f["id"] == file_id:
            del folder["files"][i]
            return {"message": "File deleted successfully"}

    raise HTTPException(status_code=404, detail="File not found")
