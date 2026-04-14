# 🔨 Anvil AI: The Self-Training Prompt Forge

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Gemini 2.0 Flash](https://img.shields.io/badge/Gemini_2.0-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white)
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

**🔴 Live Demo:** [https://anvilai.netlify.app](https://anvilai.netlify.app)

> **Advanced AI Training Engine & Studio.** Engineered to forge robotic AI outputs into natural human text and optimize raw ideas into master-level prompts. 

Anvil AI is a full-stack, GPU-accelerated application that doesn't just use AI—it learns from you. It features a custom backend data pipeline designed for **RLHF** (Reinforcement Learning from Human Feedback), seamlessly logging your edits to build a continuous training dataset.

---

## ✨ Features That Make It a Beast

* **🤖 Dual-Core Engine:** Effortlessly switch between `Prompt Forge` (optimizing raw ideas) and `Humanize Text` (erasing robotic AI footprints).
* **🎛️ Precision Controls:** Granular dropdowns to dictate the AI's Tone (Professional, Academic, Alien) and Length constraints.
* **🧠 RLHF Data Pipeline:** Every time you click *Copy & Log*, your manual text edits are captured and written to a secure JSON vault for future model fine-tuning.
* **🔐 Encrypted Admin Vault:** A PIN-protected analytics dashboard tracking overall usage, with one-click `.csv` dataset exporting.
* **⚡ GPU-Accelerated UI:** Butter-smooth React Framer Motion animations, Apple-inspired tracking, and `will-change-transform` optimizations for zero-lag rendering.
* **📡 Live DevOps Pulse:** A real-time heartbeat monitor that pings the Python API every 10 seconds to display server health.

---

## 🛠️ The Tech Stack

### Frontend (The Face)
* **Framework:** Next.js / React
* **Styling:** Tailwind CSS (with dynamic Dark, Light, and Alien themes)
* **Animation:** Framer Motion
* **Typography:** Custom antialiased, tracking-tight UI font stack
* **Hosting:** Netlify

### Backend (The Brain)
* **Framework:** Python FastAPI
* **AI Integration:** Google Gemini 2.0 Flash (`gemini-flash-latest`)
* **Database:** Local JSON File System (with dynamic CSV compiling)
* **Security:** Built-in IP Rate Limiting (10 req/min) & `.env` protection
* **Hosting:** Render

---

## 🚀 Quick Start (Local Setup)

Want to run the forge on your own machine? Follow these steps:

### 1. Clone the Vault
```
git clone [https://github.com/Eyraee/Anvil-AI.git](https://github.com/Eyraee/Anvil-AI.git)
cd Anvil-AI
```

### 2. Boot the Python Core (Backend)
``` 
cd backend
pip install -r requirements.txt
# Create a .env file and add: GEMINI_API_KEY=your_key_here
uvicorn main:app --reload 
```

### 3. Ignite the UI (Frontend)
Open a second terminal window:
```
cd frontend
npm install
npm run dev
```
Visit http://localhost:3000 to start forging.

👨‍💻 Engineered By
Tushar Shah | B.Tech Information Technology | Full-Stack Developer & Digital Artist Building the bridge between high-end software engineering and premium UI/UX design.

<div align="center">
<p><b>© 2026 Tushar Shah. All rights reserved.</b></p>
<p><sub>This project and its original source code are the intellectual property of Tushar Shah.</sub></p>
</div>
