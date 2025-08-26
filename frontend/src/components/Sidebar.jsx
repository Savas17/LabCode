export default function Sidebar({ folders, setFolders, setSelectedFolder }) {
  const createFolder = () => {
    const name = prompt("Enter folder name:");
    if (name) setFolders([...folders, { name, files: [] }]);
  };

  return (
    <div className="w-64 bg-gray-100 border-r p-4">
      <h2 className="font-semibold mb-4">📂 Folders</h2>
      <button
        className="bg-green-600 text-white px-3 py-2 w-full rounded mb-4"
        onClick={createFolder}
      >
        ➕ Create Folder
      </button>

      <ul className="space-y-2">
        {folders.map((folder, i) => (
          <li
            key={i}
            className="p-2 bg-white border rounded cursor-pointer hover:bg-gray-200"
            onClick={() => setSelectedFolder(i)}
          >
            {folder.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
