import { useState } from "react";

export default function Dashboard({ setSelectedFile }) {
  const [folders, setFolders] = useState([]);

  const createFolder = () => {
    const name = prompt("Enter folder name:");
    if (name) setFolders([...folders, { name, files: [] }]);
  };

  const addFile = (folderIndex) => {
    const name = prompt("Enter file name:");
    const content = "// Write your code here";
    if (name) {
      let updated = [...folders];
      updated[folderIndex].files.push({ name, content });
      setFolders(updated);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">📂 All Folders</h2>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={createFolder}
      >
        ➕ Create Folder
      </button>

      <div className="grid grid-cols-3 gap-4 mt-6">
        {folders.map((folder, i) => (
          <div
            key={i}
            className="p-4 border rounded shadow bg-white"
          >
            <h3 className="font-semibold">{folder.name}</h3>
            <p>{folder.files.length} files</p>
            <button
              className="bg-green-600 text-white px-2 py-1 mt-2 rounded"
              onClick={() => addFile(i)}
            >
              ➕ Add File
            </button>

            <ul className="mt-2">
              {folder.files.map((file, j) => (
                <li
                  key={j}
                  className="flex justify-between p-2 border rounded mt-2 bg-gray-50"
                >
                  <span>{file.name}</span>
                  <button
                    className="bg-purple-600 text-white px-2 py-1 rounded"
                    onClick={() => setSelectedFile(file)}
                  >
                    Open
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
