# ⚡ StudyAI — AI PDF Tutor

> Turn any PDF into a complete study guide using AI!

![StudyAI](https://img.shields.io/badge/StudyAI-AI%20PDF%20Tutor-FFD700?style=for-the-badge&logoColor=black)
![Python](https://img.shields.io/badge/Python-3.10+-FFD700?style=for-the-badge&logo=python&logoColor=black)
![React](https://img.shields.io/badge/React-18-FFD700?style=for-the-badge&logo=react&logoColor=black)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-FFD700?style=for-the-badge&logo=fastapi&logoColor=black)
![Groq AI](https://img.shields.io/badge/Groq_AI-LLaMA3-FFD700?style=for-the-badge&logoColor=black)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-FFD700?style=for-the-badge&logo=vercel&logoColor=black)

---

## 🌐 Live Demo

🔗 **Frontend:** https://ai-pdf-tutor-seven.vercel.app

🔗 **Backend API:** https://ai-pdf-tutor-backend.onrender.com

---

## 🎯 What is StudyAI?

**StudyAI** is an AI-powered web application that analyzes any PDF document and instantly generates:

- 📋 **Document Summary** — 2-3 sentence overview of the PDF
- ❓ **8 Exam Questions** — Conceptual, Factual, and Application questions with hints
- 📚 **Study Notes** — Topic-wise key points for quick revision
- 🔑 **Key Terms** — Important terms with definitions

---

## 🖼️ Screenshots

| Upload PDF | AI Results |
|------------|-----------|
| Drop any PDF | Questions + Notes + Key Terms generated in 15-20 seconds |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js + Vite |
| Backend | Python FastAPI |
| AI Model | Groq AI (llama-3.3-70b-versatile) |
| PDF Reading | pdfplumber |
| Styling | Custom CSS with animations |
| Backend Hosting | Render.com (Free) |
| Frontend Hosting | Vercel (Free) |

---

## 📁 Project Structure

```
ai-pdf-tutor/
├── backend/
│   ├── main.py              # FastAPI backend + Groq AI
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # API keys (never push!)
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main React component
│   │   ├── App.css          # Animations + styling
│   │   └── index.css        # Global styles
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

---

## 🚀 Run Locally

### Prerequisites
- Python 3.10+
- Node.js 18+
- Free Groq API key from [console.groq.com](https://console.groq.com)

### 1️⃣ Clone the repo

```bash
git clone https://github.com/Aswathyvk/ai-pdf-tutor.git
cd ai-pdf-tutor
```

### 2️⃣ Setup Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Create `.env` file:
```
GROQ_API_KEY=your_groq_key_here
```

Run backend:
```bash
uvicorn main:app --reload --port 8001
```

✅ Backend: http://127.0.0.1:8001

### 3️⃣ Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

✅ Frontend: http://localhost:5173

---

## 📦 Backend Dependencies

```
fastapi
uvicorn
python-dotenv
groq
pdfplumber
python-multipart
```

---

## 🔑 Environment Variables

| Variable | Where | Description |
|----------|-------|-------------|
| `GROQ_API_KEY` | backend/.env | Free Groq API key |
| `VITE_API_URL` | Vercel settings | Backend URL on Render |

---

## 🎨 Features

- ✅ Beautiful dark theme UI
- ✅ Drag and drop PDF upload
- ✅ Smooth CSS animations
- ✅ Yellow accent color theme
- ✅ Responsive mobile friendly
- ✅ Copy notes to clipboard
- ✅ Show / Hide answer hints
- ✅ Tab navigation (Questions / Notes / Key Terms)
- ✅ Loading steps animation
- ✅ Fully deployed and live

---

## 📅 Development Log

| Day | What was built |
|-----|---------------|
| Day 1 | Project setup, FastAPI backend, React frontend, GitHub |
| Day 2 | Switched to Groq AI, beautiful animated UI, yellow theme |
| Day 3 | Deployed backend on Render, frontend on Vercel — fully live! |

---

## 💡 Future Features

- 🧠 Quiz mode with scoring
- 🌙 Dark / Light theme toggle
- 📥 Download notes as PDF
- 💬 Chat with PDF
- 🌐 Multi-language support
- 📊 Topic-wise breakdown

---

## ⚠️ Important

- Never push `.env` file to GitHub
- `venv/` and `node_modules/` are excluded via `.gitignore`
- Free Render backend may take 50 seconds to wake up on first request

---

## 👩‍💻 Author

**Aswathy VK** — MCA Student

- 🐙 GitHub: [@Aswathyvk](https://github.com/Aswathyvk)
- 💼 Project: [ai-pdf-tutor](https://github.com/Aswathyvk/ai-pdf-tutor)
- 🌐 Live App: [ai-pdf-tutor-seven.vercel.app](https://ai-pdf-tutor-seven.vercel.app)

---

## 📄 License

This project is open source under the [MIT License](LICENSE).

---

<div align="center">

Built with ❤️ using React + FastAPI + Groq AI

⭐ Star this repo if you found it helpful!

🔗 [Live Demo](https://ai-pdf-tutor-seven.vercel.app) • [GitHub](https://github.com/Aswathyvk/ai-pdf-tutor)

</div>
