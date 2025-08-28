import React, { useState } from "react";

export default function FileEditor() {
  const [filename, setFilename] = useState("");
  const [code, setCode] = useState("");

  const handleSave = async () => {
    if (!filename || !code) {
      alert("Please enter filename and code before saving.");
      return;
    }

    const blob = new Blob([code], { type: "text/plain" });
    const file = new File([blob], filename);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("filename", filename);

    try {
      const response = await fetch("http://127.0.0.1:8000/save-file/", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      alert("✅ " + result.message);
    } catch (error) {
      console.error("Error saving file:", error);
      alert("❌ Failed to save file");
    }
  };

  return (
    <div className="p-4 w-full">
      <input
        type="text"
        placeholder="Enter filename (e.g., hello.py)"
        value={filename}
        onChange={(e) => setFilename(e.target.value)}
        className="border p-2 mb-2 w-full rounded"
      />
      <textarea
        placeholder="Write your code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="border p-2 w-full h-64 rounded font-mono"
      />
      <button
        onClick={handleSave}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600"
      >
        Save File
      </button>
    </div>
  );
}
