
# LinkedIn Talent Finder

A web application to streamline talent discovery using LinkedIn data. Built with a React frontend and a Python backend.

## 📁 Project Structure

```
LinkedIn-Talent-Finder/
├── frontend/        # React app
├── backend/         # Python backend (FastAPI)
└── README.md
```

##  Getting Started

### Prerequisites

- Node.js (v18+)
- Python (v3.9+)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/LinkedIn-Talent-Finder.git
cd LinkedIn-Talent-Finder
```

### 2. Setup Frontend

```bash
cd frontend
npm install
npm start
```

### 3. Setup Backend

```bash
cd ../backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py  # or uvicorn main:app --reload for FastAPI
```

## 🧪 Testing

- Frontend: `npm test`
- Backend: `pytest` or your preferred test runner

## 🤝 Contributing

1. Fork the repo
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## 📄 License

MIT License

---
