import { useState } from "react";

export default function FileView({ file, setSelectedFile }) {
  const [code, setCode] = useState(file.content);
  const [output, setOutput] = useState("");

  const runCode = () => {
    try {
      // temporary (just eval for JS only)
      // later we’ll call backend here
      const result = eval(code);
      setOutput(String(result));
    } catch (err) {
      setOutput(err.message);
    }
  };

  return (
    <div>
      <button
        className="mb-4 bg-gray-600 text-white px-3 py-2 rounded"
        onClick={() => setSelectedFile(null)}
      >
        ⬅ Back
      </button>

      <h2 className="text-xl font-bold mb-2">{file.name}</h2>
      <textarea
        className="w-full h-60 border p-2 font-mono"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <button
        className="bg-purple-600 text-white px-4 py-2 mt-3 rounded"
        onClick={runCode}
      >
        ▶ Run Code
      </button>

      <div className="mt-4 p-3 border bg-gray-50 rounded">
        <h4 className="font-semibold">Output:</h4>
        <pre className="text-sm text-green-700">{output}</pre>
      </div>
    </div>
  );
}
