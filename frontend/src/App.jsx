import React, { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export default function App() {
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFile, setNewFile] = useState({ name: "", language: "python", content: "" });
  const [editFile, setEditFile] = useState(null);
  const [searchName, setSearchName] = useState("");

  const languages = ["python", "javascript", "java", "c++", "c#", "go", "ruby", "php", "none"];

  // 📂 Fetch all folders
  const fetchFolders = async () => {
    const res = await axios.get(`${API}/folders`);
    setFolders(res.data);
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  // 📂 Open folder
  const openFolder = async (id) => {
    const res = await axios.get(`${API}/folders/${id}`);
    setCurrentFolder(res.data);
  };

  // 📂 Create folder
  const createFolder = async () => {
    if (!newFolderName.trim()) return;
    await axios.post(`${API}/folders`, { name: newFolderName, parent_id: currentFolder?.id });
    setNewFolderName("");
    currentFolder ? openFolder(currentFolder.id) : fetchFolders();
  };

  // 📄 Create file
  const createFile = async () => {
    if (!newFile.name.trim()) return;
    await axios.post(`${API}/folders/${currentFolder.id}/files`, newFile);
    setNewFile({ name: "", language: "python", content: "" });
    openFolder(currentFolder.id);
  };

  // ✏️ Edit file
  const updateFile = async () => {
    await axios.put(`${API}/folders/${currentFolder.id}/files/${editFile.id}`, editFile);
    setEditFile(null);
    openFolder(currentFolder.id);
  };

  // ❌ Delete folder
  const deleteFolder = async (id, parentId) => {
    if (!window.confirm("Are you sure you want to delete this folder?")) return;
    await axios.delete(`${API}/folders/${id}`);
    parentId ? openFolder(parentId) : fetchFolders();
  };

  // ❌ Delete file
  const deleteFile = async (folderId, fileId) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    await axios.delete(`${API}/folders/${folderId}/files/${fileId}`);
    openFolder(folderId);
  };

  // 🔍 Search folder
  const searchFolder = async () => {
    try {
      const res = await axios.get(`${API}/folders/search/${searchName}`);
      setCurrentFolder(res.data);
    } catch {
      alert("Folder not found!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6 flex items-center gap-2">
        <span role="img" aria-label="folder">📂</span> Lab Code
      </h1>

      {/* Search Bar */}
      <div className="flex gap-2 w-full max-w-2xl mb-4">
        <input
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          placeholder="🔍 Search folder by name"
          className="flex-1 px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
        />
        <button
          onClick={searchFolder}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {/* Add Folder Form - visually enhanced */}
      <div className="flex flex-col w-full max-w-2xl mb-6">
        <div className="bg-green-50 border border-green-200 rounded-lg shadow px-4 py-3 flex items-center gap-3">
          <span className="text-xl text-green-700 font-medium mr-2">➕ Add New Folder</span>
          <input
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Folder name"
            className="flex-1 px-3 py-2 border border-green-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-400 outline-none"
          />
          <button
            onClick={createFolder}
            className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 font-semibold"
          >
            Add
          </button>
        </div>
      </div>

      {/* Back Buttons */}
      {currentFolder && (
        <div className="flex left-0 right-0 w-full max-w-2xl mx-auto gap-3 mb-6">
          <button
            className="bg-gray-400 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-500"
            onClick={() => setCurrentFolder(null)}
          >
            ⬅ Back to Root
          </button>
          {currentFolder.parent_id && (
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-600"
              onClick={() => openFolder(currentFolder.parent_id)}
            >
              ⬅ Back to Parent
            </button>
          )}
        </div>
      )}

      {/* Folder View */}
      <div className="flex left-0 right-0 w-full max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-6">
        {!currentFolder ? (
          <div className="flex flex-col w-full">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span role="img" aria-label="folder">📁</span> Root Folders
            </h2>
            <div className="flex flex-col w-full gap-3">
              {folders.map((f) => (
                <div
                  key={f.id}
                  className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow hover:bg-gray-200 w-full transition-colors cursor-pointer"
                >
                  <span
                    className="font-medium flex items-center text-lg"
                    onClick={() => openFolder(f.id)}
                    style={{ flex: 1 }}
                  >
                    <span className="mr-2">📂</span> {f.name}
                  </span>
                  <button
                    onClick={() => deleteFolder(f.id, null)}
                    className="text-red-400 hover:text-red-500 text-2xl px-2"
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold mb-4">📁 {currentFolder.name}</h2>

            {/* Subfolders */}
            <h3 className="text-lg font-medium mb-2">📂 Subfolders</h3>
            <div className="grid gap-3 mb-6">
              {currentFolder.subfolders.map((sf) => (
                <div
                  key={sf.id}
                  className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow hover:bg-gray-200"
                >
                  <span className="cursor-pointer font-medium" onClick={() => openFolder(sf.id)}>
                    📂 {sf.name}
                  </span>
                  <button
                    onClick={() => deleteFolder(sf.id, currentFolder.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>

            {/* Files */}
            <h3 className="text-lg font-medium mb-2">📄 Files</h3>
            <div className="grid gap-4 mb-6">
              {currentFolder.files.map((file) => (
                <div
                  key={file.id}
                  className="p-4 bg-gray-50 border rounded-lg shadow flex justify-between"
                >
                  <div className="flex-1">
                    <div className="font-semibold text-blue-700">
                      {file.name} <span className="text-gray-500">({file.language})</span>
                    </div>
                    <pre className="bg-gray-200 p-2 mt-2 rounded-lg overflow-x-auto text-sm">
                      {file.content}
                    </pre>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => setEditFile(file)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-lg shadow hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteFile(currentFolder.id, file.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg shadow hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add File Form */}
            <div className="p-4 bg-blue-50 border rounded-lg shadow">
              <h3 className="text-lg font-medium mb-3">➕ Add New File</h3>
              <input
                value={newFile.name}
                onChange={(e) => setNewFile({ ...newFile, name: e.target.value })}
                placeholder="File name"
                className="w-full px-3 py-2 mb-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
              />
              <select
                value={newFile.language}
                onChange={(e) => setNewFile({ ...newFile, language: e.target.value })}
                className="w-full px-3 py-2 mb-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
              <textarea
                value={newFile.content}
                onChange={(e) => setNewFile({ ...newFile, content: e.target.value })}
                placeholder="File content..."
                rows="5"
                className="w-full px-3 py-2 mb-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
              />
              <button
                onClick={createFile}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
              >
                Add File
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit File Modal */}
      {editFile && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">✏️ Edit File</h3>
            <input
              value={editFile.name}
              onChange={(e) => setEditFile({ ...editFile, name: e.target.value })}
              className="w-full px-3 py-2 mb-3 border rounded-lg shadow-sm"
            />
            <select
              value={editFile.language}
              onChange={(e) => setEditFile({ ...editFile, language: e.target.value })}
              className="w-full px-3 py-2 mb-3 border rounded-lg shadow-sm"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
            <textarea
              value={editFile.content}
              onChange={(e) => setEditFile({ ...editFile, content: e.target.value })}
              rows="5"
              className="w-full px-3 py-2 mb-3 border rounded-lg shadow-sm"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={updateFile}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={() => setEditFile(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
