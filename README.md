# 🧠 LinkedIn Talent Finder

**LinkedIn Talent Finder** is a fullstack AI recruitment tool that helps identify the right talent from LinkedIn-like data using AI-based analysis.

Built with:
- ⚙️ **Backend**: Python (Flask)
- 🌐 **Frontend**: React (JavaScript)
- 📊 (Planned) AI/LLM integration for resume ranking, MongoDB for storage

---

## 📁 Project Structure

LinkedIn-Talent-Finder/
├── backend/ # Flask API
│ ├── app.py
│ └── requirements.txt
├── frontend/ # React App
│ ├── package.json
│ └── src/
├── README.md # This file

yaml
Copy
Edit

---

## 🛠️ Prerequisites

Each contributor must have the following installed:

| Tool         | Link                                |
|--------------|--------------------------------------|
| Python 3.10+ | https://www.python.org/downloads/    |
| Node.js + npm | https://nodejs.org/                 |
| Git          | https://git-scm.com/downloads        |

---

## 🚀 Setup Instructions (No Docker Needed)

### 🔁 Step 1: Clone the Repository

```bash
git clone https://github.com/Yashwanth137/LinkedIn-Talent-Finder.git
cd LinkedIn-Talent-Finder
🔧 Step 2: Run the Flask Backend
Open a terminal and navigate to the backend folder:

bash
Copy
Edit
cd backend
Create a virtual environment and activate it:

Windows:

bash
Copy
Edit
python -m venv venv
venv\Scripts\activate
Mac/Linux:

bash
Copy
Edit
python3 -m venv venv
source venv/bin/activate
Install required Python packages:

bash
Copy
Edit
pip install -r requirements.txt
Run the Flask server:

bash
Copy
Edit
python app.py
📍 Visit your backend API: http://localhost:5000

🌐 Step 3: Run the React Frontend
Open a new terminal window:

bash
Copy
Edit
cd frontend
npm install
npm start
📍 React app will open in the browser at: http://localhost:3000

🔄 Backend-Frontend Connection
The React frontend makes API calls to http://localhost:5000.
Make sure the Flask server is running in parallel when testing the frontend.

🧪 Troubleshooting
Problem	Solution
CORS error	Ensure flask-cors is installed and imported
Port 5000 or 3000 already in use	Stop the app using it, or change the port
Backend not responding	Ensure Flask server is running properly
React fetch failing	Check API URL and that both apps are running

👥 Contributing Guidelines
Fork this repository.

Clone your fork:

bash
Copy
Edit
git clone https://github.com/<your-username>/LinkedIn-Talent-Finder.git
Create a new feature branch:

bash
Copy
Edit
git checkout -b feature-name
Make changes, commit, and push:

bash
Copy
Edit
git add .
git commit -m "Describe your changes"
git push origin feature-name
Open a Pull Request from GitHub UI.

📦 Planned Features (Roadmap)
✅ Flask backend setup

✅ React frontend with API call

🔲 Resume parsing and AI ranking

🔲 MongoDB integration

🔲 User authentication

🔲 Deployment (Netlify for frontend, Render for backend)

📬 Contact
For help or collaboration, contact the maintainer:

Yashwanth – GitHub Profile

