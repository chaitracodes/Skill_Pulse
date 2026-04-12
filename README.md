# SkillPulse: AI Career Learning Hub

SkillPulse is an AI-powered career ecosystem designed to help you analyze your current skill set, understand market trends, and get job-ready for your target roles. It transforms raw resume data into actionable learning roadmaps, complete with market analytics and what-if career simulations.

## Key Features

- **AI Career Intelligence**: Upload your resume (PDF/TXT), and our intelligent backend extracts your skills, projects, and maps them directly to the best-fitting job roles.
- **Dynamic Learning Hub & Skill Gaps**: Visualizes your career readiness using interactive charts. It builds personalized learning roadmaps, neatly distinguishing between finding resources to learn new skills and revising the ones you already know.
- **Market Intelligence**: Fetches real-time skill demand from Google Trends and presents it in a visually engaging "stock-market" style. Live tech news briefs keep you updated on the broader ecosystem.
- **Terminal & What-If Simulations**: Want to know what happens if you learn a specific new skill or apply for a different role? The AI terminal evaluates hypothetical career scenarios to guide your path forward.

## Technology Stack

- **Frontend**: React, Vite, Lucide React (for icons), and Recharts (for rich, dynamic charts like skill spider webs).
- **Backend**: FastAPI (Python), PyMuPDF (resume parsing), Groq API (fast LLM inferences), Pytrends (market data), Pandas & Numpy.

## Getting Started

### Prerequisites
- Node.js & npm (for the frontend)
- Python 3.9+ (for the backend)
- A Groq API Key (for the AI features)

### 1. Backend Setup

Open a terminal and navigate to the `backend` directory:

```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file in the `backend` directory and add your Groq API key:

```env
GROQ_API_KEY=your_groq_api_key_here
```

Start the FastAPI development server:

```bash
uvicorn main:app --reload
```

### 2. Frontend Setup

Open a new terminal in the project root directory:

```bash
npm install
npm run dev
```

Your browser should automatically open to `http://localhost:5173` (or the port specified by Vite). Upload your resume and let the AI build your career pulse!
