🚀 LabCode – Code Sharing Platform

LabCode is a hassle-free code sharing app built with FastAPI (backend) and React (frontend).
It allows users to create folders, add files, edit code, and search for folders – making it super easy to organize and share coding projects in labs, classrooms, or teams.

✨ Features
📁 Folder Management

Create top-level folders

Create subfolders inside any folder

Search folders by name

📄 File Management

Add files inside folders

Store file name, programming language, and code content

Edit and update files easily

🔍 Search

Search for folders by name for quick navigation

🛠️ Tech Stack

Frontend: React + Axios + TailwindCSS

Backend: Python (FastAPI)

Database: In-memory (extendable to SQLite/PostgreSQL)

⚡ Getting Started
1. Clone the Repository
git clone https://github.com/your-username/code-sharing-app.git
cd code-sharing-app

2. Setup Backend (FastAPI)
cd backend
python -m venv venv
# Activate venv
source venv/bin/activate   # (Linux/Mac)
venv\Scripts\activate      # (Windows)

pip install -r requirements.txt
uvicorn app:app --reload


3. Setup Frontend (React)
cd frontend
npm install
npm run dev


Top-level folders view

Inside a folder (subfolders + files)

File editing interface

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

✅ Syntax highlighting in the code editor

👨‍💻 Authors

Kasif Khan – Passionate about building web apps & AI tools 🚀

Syed Saquib – Worked on backend & database integration ⚡

👉 This version is:

More readable with emojis + sections.

Developer-friendly (copy-paste commands).

Credits both of you.

Highlights improvements (shows roadmap).
