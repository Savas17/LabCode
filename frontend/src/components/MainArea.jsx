import { useState } from "react";

export default function MainArea({
  folders,
  selectedFolder,
  selectedFile,
  setSelectedFile,
  setFolders,
}) {
  const [output, setOutput] = useState("");

  if (selectedFolder === null) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a folder to view files
      </div>
    );
  }

  const folder = folders[selectedFolder];

  const addFile = () => {
    const name = prompt("Enter file name:");
    const content = "// Write your code here";
    if (name) {
      let updated = [...folders];
      updated[selectedFolder].files.push({ name, content });
      setFolders(updated);
    }
  };

  const runCode = () => {
    try {
      const result = eval(selectedFile.content); // temporary JS-only execution
      setOutput(String(result));
    } catch (err) {
      setOutput(err.message);
    }
  };

  return (
    <div className="flex-1 p-6 overflow-auto">
      {/* File List */}
      {!selectedFile && (
        <div>
          <h2 className="text-xl font-bold mb-4">
            Folder: {folder.name}
          </h2>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={addFile}
          >
            ➕ Add File
          </button>

          <ul className="mt-4 space-y-2">
            {folder.files.map((file, j) => (
              <li
                key={j}
                className="flex justify-between p-2 border rounded bg-gray-50"
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
      )}

      {/* Code Editor */}
      {selectedFile && (
        <div>
          <button
            className="mb-4 bg-gray-600 text-white px-3 py-2 rounded"
            onClick={() => setSelectedFile(null)}
          >
            ⬅ Back
          </button>

          <h2 className="text-lg font-bold mb-2">{selectedFile.name}</h2>
          <textarea
            className="w-full h-60 border p-2 font-mono"
            value={selectedFile.content}
            onChange={(e) => {
              selectedFile.content = e.target.value;
              setFolders([...folders]);
            }}
          />

          <button
            className="bg-green-600 text-white px-4 py-2 mt-3 rounded"
            onClick={runCode}
          >
            ▶ Run Code
          </button>

          <div className="mt-4 p-3 border bg-gray-50 rounded">
            <h4 className="font-semibold">Output:</h4>
            <pre className="text-sm text-green-700">{output}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
