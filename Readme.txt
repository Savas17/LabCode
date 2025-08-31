Code Sharing App

A simple Code Sharing Platform built with Python (FastAPI) and React.
It allows users to create folders, add files, edit code, and search for folders – making it easy to organize and share coding projects.

🚀 Features

📁 Folder Management

Create top-level folders

Create subfolders inside any folder

Search folders by name

📄 File Management

Add files inside folders

Store file name, programming language, and code content

Edit and update files

🔍 Search

Search for folders by name to quickly navigate

🛠️ Tech Stack

Frontend: React + Axios + TailwindCSS
Backend: Python (FastAPI)
Database: In-memory (can be extended to SQLite/PostgreSQL)

📦 Installation
1. Clone the repository
git clone https://github.com/your-username/code-sharing-app.git
cd code-sharing-app

2. Setup Backend (FastAPI)
cd backend
python -m venv venv
source venv/bin/activate   # (Linux/Mac)
venv\Scripts\activate      # (Windows)

pip install -r requirements.txt
uvicorn app:app --reload


Backend will run on 👉 http://localhost:8000

3. Setup Frontend (React)
cd frontend
npm install
npm run dev


Frontend will run on 👉 http://localhost:5173 (Vite default)

📸 Screenshots

Top-level folders view

Inside a folder (subfolders + files)

File editing interface

(Add screenshots here once ready)

📌 API Endpoints
Method	Endpoint	Description
GET	/folders	Get all top-level folders
POST	/folders	Create new folder
GET	/folders/{id}	Get folder details (subfolders + files)
POST	/folders/{id}/files	Add file to folder
PUT	/folders/{id}/files/{file_id}	Update file
GET	/folders/search/{name}	Search folder by name
🔮 Future Improvements

✅ User authentication (login/signup)

✅ Share folders via unique links

✅ Real database integration (SQLite/PostgreSQL)

✅ Syntax highlighting for code editor

👨‍💻 Author

Kasif Khan – Passionate about building web apps & AI tools 🚀