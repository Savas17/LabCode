// src/App.jsx
import { useState } from "react";
import { FileText, X } from "lucide-react";

export default function App() {
  const [files, setFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newFile, setNewFile] = useState({
    name: "",
    language: "javascript",
    content: "",
  });

  const handleSave = () => {
    if (!newFile.name.trim()) return;
    setFiles([...files, { ...newFile, id: Date.now() }]);
    setNewFile({ name: "", language: "javascript", content: "" });
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navbar */}
      <header className="flex justify-between items-center px-6 py-4 border-b">
        <h1 className="text-xl font-bold flex items-center space-x-2">
          <span>{"</>"}</span>
          <span>CodeShare</span>
        </h1>
        <div className="space-x-3">
          <button className="px-4 py-2 border rounded-md bg-white hover:bg-gray-100">
            Browse Public
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-md bg-black text-white hover:bg-gray-800"
          >
            + Create File
          </button>
        </div>
      </header>

      {/* Search + File Section */}
      <main className="px-6 py-8">
        {/* Search bar */}
        <div className="max-w-4xl mx-auto">
          <div className="flex">
            <input
              type="text"
              placeholder="Search files by name or content..."
              className="flex-1 border rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
            <button className="px-4 py-2 bg-gray-200 rounded-r-md hover:bg-gray-300">
              Search
            </button>
          </div>
        </div>

        {/* Files Section */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">All Files</h2>
            <button
              onClick={() => setShowModal(true)}
              className="px-3 py-1 border rounded-md bg-white hover:bg-gray-100"
            >
              + Add File
            </button>
          </div>

          {/* Empty State */}
          {files.length === 0 ? (
            <div className="border rounded-lg py-16 flex flex-col items-center justify-center text-gray-500">
              <FileText className="w-12 h-12 mb-3" />
              <p className="font-medium">No files yet</p>
              <p className="text-sm">Create your first code snippet to get started.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100"
                >
                  <h3 className="font-medium">{file.name}</h3>
                  <p className="text-sm text-gray-600">{file.language}</p>
                  <pre className="mt-2 bg-white p-2 rounded border text-sm overflow-x-auto">
                    {file.content}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Floating Create File Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 left-6 px-4 py-2 rounded-md bg-black text-white shadow-lg hover:bg-gray-800"
      >
        + Create File
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <X size={20} />
            </button>

            <h2 className="text-lg font-semibold mb-4">Create New File</h2>

            <input
              type="text"
              placeholder="File Name"
              value={newFile.name}
              onChange={(e) => setNewFile({ ...newFile, name: e.target.value })}
              className="w-full border rounded-md px-3 py-2 mb-3"
            />

            <select
              value={newFile.language}
              onChange={(e) =>
                setNewFile({ ...newFile, language: e.target.value })
              }
              className="w-full border rounded-md px-3 py-2 mb-3"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="c">C</option>
              <option value="cpp">C++</option>
            </select>

            <textarea
              placeholder="Write your code here..."
              value={newFile.content}
              onChange={(e) =>
                setNewFile({ ...newFile, content: e.target.value })
              }
              className="w-full border rounded-md px-3 py-2 mb-3 h-40 font-mono"
            />

            <button
              onClick={handleSave}
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800"
            >
              Save File
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
