---
title: PomoAI
emoji: ⏱️
colorFrom: indigo
colorTo: blue
sdk: docker
app_port: 7860
---

# PomoAI — High-Performance Pomodoro Operating System with AI Productivity Coaching

Welcome to **PomoAI**, an advanced, full-stack, personal Pomodoro Operating System designed to transform chaotic daily lists into high-velocity flow states. From the ground up, I architected this application using a modular **React (Vite) + Express + TypeScript** stack, styled with custom **Tailwind CSS**, energized with smooth modern animations using **motion/react**, and augmented by **Google Gemini 3.5-Flash** for context-aware, active behavioral coaching.

This document serves as an exhaustive technical breakdown of PomoAI. I have outlined the full development process, folder hierarchy, API interface layers, gamification metrics (the Virtual Forest and XP loop), and multi-platform deployment setups (Docker, Hugging Face, Vercel, and GitHub Actions) so that anyone can review, run, or audit the system with absolute clarity.

---

## 🎨 System Highlights

- ⏱️ **Rigid Pomodoro Timer Engine**: Supports customizable Focus, Short Break, and Long Break configurations, dynamically bound to an active task. Includes built-in interruption monitoring.
- 🌲 **Virtual Focus Forest**: Real-time canvas-backed grid representing completed deep work sessions as full-fledged mature trees (Oak, Sakura, Pine, and Bamboo) mapped onto the user's focus metrics.
- 🧙‍♂️ **Gemini-Powered AI Productivity Coach**: Implements server-side context-aware LLM agents that query user XP, streak indicators, interruption rates, and task load to generate precise behavioral recommendations.
- 📅 **Interactive Study Planner**: Generates granular Study blueprints for high-yield exams and automatically maps them across a calendar timeline.
- ⚡ **Algorithmic Queue Optimization**: Sorts and prioritizes study schedules and active queues with priority indexes computed dynamically.
- 📊 **Productivity Analytics & Charts**: Stately and clean charts mapping product distributions, hourly productivity clusters, and focus logs.
- 🎮 **Gamification Core (XP & Achievements)**: Level-up progression tracks, streaks counters, active challenges, and a dedicated trophy cabinet tracking locked/unlocked Achievements.

---

## 📁 System Architecture & Directory Layout

I structured the project directory with clean boundaries separating client-side view routers, types, styling, configuration engines, and server endpoints.

```text
├── .github/
│   └── workflows/
│       └── deploy.yml          # Automated CI/CD pushing repository revisions to Hugging Face
├── api/
│   └── index.ts                # Vercel Serverless Function entry proxy
├── assets/                     # Custom graphics, mockups, and static image assets
├── src/
│   ├── components/             # Deconstructed UI sub-modules
│   │   ├── LandingPage.tsx     # Clean entry portal with motivational prompts
│   │   ├── DashboardTab.tsx    # Consolidated overview, statistics matrices, achievement racks
│   │   ├── WorkTimer.tsx       # Live ticking loop, controls, state nodes, sound modulators
│   │   ├── TaskManager.tsx     # High-density task checklists & tag manipulators
│   │   ├── CalendarTab.tsx     # Monthly scheduled focus blocks tracker
│   │   ├── FocusForest.tsx     # Interactive grid rendering trees planted through focus blocks
│   │   ├── AnalyticsTab.tsx    # Progress visualizations, bar clusters, and metrics logs
│   │   └── CoachTab.tsx        # Interactive AI chatbot, study schedulers, and queue optimizer
│   │
│   ├── utils/
│   │   └── presets.ts          # Structured seeds: challenges templates, default achievements, quotes
│   │
│   ├── App.tsx                 # Core parent component managing global client-state & navigation
│   ├── index.css               # Main entry stylesheet initializing Tailwind CSS & typography
│   ├── main.tsx                # Browser mounting controller
│   └── types.ts                # Rigid TypeScript Type guard specifications
│
├── .dockerignore               # Optimized Docker container context filter
├── .gitignore                  # Keeps local build files, modules, and secrets hidden from Git
├── Dockerfile                  # Advanced multi-stage Node production Docker environment
├── README.md                   # Complete architectural system documentation (This file)
├── metadata.json               # Platform configuration, viewport variables, and capabilities
├── package.json                # Project dependencies, task automation runners, and metadata
├── server.ts                   # Robust Express server hosting API routes, Vite middleware, & Gemini client
├── tsconfig.json               # Strict compiler variables for TypeScript 
└── vercel.json                 # Serverless routing, rewrites, and redirect proxies for Vercel
```

---

## 🔬 Core Algorithms & Mathematical Formulations

To ensure the system remains scientifically sound and encouraging, I formulated and built custom business logic rules for state progression:

### 1. The Focus Score Calculation
The Focus Score evaluates the quality of each Pomodoro block on a scale from `0` to `100`. It dynamically drops with each manually logged distraction or interruption during an active focus loop:

$$\text{Focus Score} = \max\left(0, 100 - (\text{Interruption Count} \times 15)\right)$$

*A perfect score of `100` translates to maximum XP gains; frequent interruptions deplete focus scores, motivating users to put down their phones.*

### 2. Level Up Progression Formula (XP Curve)
User progression is guided by a standard RPG quadratic curve, preventing rapid saturation while keeping low-level levels extremely satisfying to unlock:

$$\text{Next Level Required XP} = \text{Current Level} \times 500 \times 1.2$$

Completing a full focus session awards:
- **Session Complete**: $+150\text{ XP}$ (uninterrupted)
- **High Priority Bonus**: $+50\text{ XP}$
- **Focus Score Bonus**: $+\text{Focus Score Value} \times 0.5\text{ XP}$

### 3. Queue Priority Index
When optimizing study lists via the AI coach, tasks are sorted using a multi-factor priority index calculated by:

$$\text{Priority Index} = (\text{Urgency Weight}) + (\text{Effort Score}) + (\text{Project Cohesion})$$

---

## 🛰️ Full-Stack Backend API Endpoints (`server.ts`)

The backend is built as a unified **Express server** supporting local development through Vitest/Vite middleware and serverless execution models. All endpoints utilize the official `@google/genai` TypeScript SDK to securely connect to `gemini-3.5-flash`.

### 1. `POST /api/coach/chat`
Provides context-aware coaching dialogues. The system injects a systematic system prompt with the user's real-time productivity statistics, active project loads, current task name, and Focus levels.

- **Request Body**:
  ```json
  {
    "message": "I feel unmotivated to code right now.",
    "history": [
      { "sender": "user", "text": "Can you help me plan?" },
      { "sender": "model", "text": "Absolutely, let's look at your streak." }
    ],
    "context": {
      "streak": 5,
      "level": 2,
      "xp": 1350,
      "focusScore": 92,
      "totalFocusMinutes": 100,
      "currentTaskTitle": "Review biology flashcards"
    }
  }
  ```
- **Response**:
  ```json
  {
    "text": "Level 2 is a great milestone, Mohamed. With a focus score of 92%, you are in an excellent position to tackle 'Review biology flashcards'. Let's do a short 25-minute block. No phones. I'm starting the clock for you."
  }
  ```

### 2. `POST /api/coach/plan`
Generates a structured, JSON-formatted milestone study schedule based on upcoming exams, days left, and user availability. It directly enforces schemas utilizing `responseSchema` parameters of the Gemini client.

- **Request Body**:
  ```json
  {
    "examTopic": "Cardiology Pathology & Symptoms",
    "daysLeft": 7,
    "targetHoursPerDay": 3
  }
  ```
- **Response**:
  ```json
  {
    "tasks": [
      {
        "title": "Analyze Myocardial Infarction Patterns",
        "durationMinutes": 50,
        "priority": "high",
        "dayOffset": 1,
        "subtasks": ["Review acute ECG markers", "Compare STEMI vs NSTEMI guidelines", "Complete practice cases"]
      }
    ],
    "advice": "Prioritize electric conductance pathways early on to guarantee a solid diagnostic foundation."
  }
  ```

### 3. `POST /api/coach/breakdown`
Accepts an intimidating, complex task and splits it into a sequence of actionable, easily managed checkboxes.

- **Request Body**:
  ```json
  { "taskTitle": "Configure container deployment with SSL" }
  ```
- **Response**:
  ```json
  {
    "subtasks": [
      "Review Dockerfile base image setup and adjust network headers",
      "Draft Caddy or Nginx reverse proxy configuration template",
      "Issue Let's Encrypt certificates using Certbot dry-run tests",
      "Deploy environment to live staging and run API port ping tests"
    ]
  }
  ```

### 4. `POST /api/coach/optimize`
Evaluates the client's current queue, compares it with focus records, and recalculates an optimized task sequencing to maximize flow state.

---

## 🛠️ Build, Run, and Deploy

PomoAI is engineered to run seamlessly across various container environments and cloud hosting providers.

### Local Development Setup

To clone, configure, and boot the application locally:

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Secrets**:
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   GEMINI_API_KEY=your-actual-google-gemini-api-key-here
   ```

3. **Launch the Hot-Reload dev environment**:
   ```bash
   npm run dev
   ```

4. **Verify Linter and Build Pipeline**:
   ```bash
   npm run lint
   ```
   ```bash
   npm run build
   ```

---

### 🐳 High-Performance Docker Deployment

I configured a high-density, multi-stage `Dockerfile` optimal for container clouds (such as **Hugging Face Spaces**, **Koyeb**, or **Cloud Run**). It compiles frontend assets in a builder stage and discards heavy development tools to keep the execution image extremely tiny.

To build and run manually:
```bash
# Build the production container image
docker build -t pomo-ai:v1 .

# Run the container (Mapping external port 7860 onto local 7860)
docker run -p 7860:7860 --env GEMINI_API_KEY="your_api_key_here" pomo-ai:v1
```

---

### 🤗 Deploying to Hugging Face Spaces

Hugging Face Spaces offers **free, persistent Docker-managed app containers**. I have fully integrated support for Hugging Face directly into the build:

1. Create a new Space on [Hugging Face](https://huggingface.co/) and select **Docker** as your SDK framework.
2. In the Space’s **Settings**, create a secret named `GEMINI_API_KEY` mapping to your API key.
3. Add the Hugging Face Space as a standard git remote target and push:
   ```bash
   git remote add hf https://huggingface.co/spaces/MohamedSaadawy/PomoAI
   git push -f hf main
   ```
*Note: Hugging Face reads our customized YAML metadata embedded at the very top of `README.md` to automatically select the **Docker** execution model and route ingress traffic safely to port `7860`!*

---

### ⚡ Deploying to Vercel (Serverless Server)

I mapped the entire Express system so that it compiles and hosts seamlessly as a **Vercel Serverless Function**:

1. **How it Works**: The file `/vercel.json` intercepts all standard `/api/*` routes and proxies them directly onto the serverless entrypoint `/api/index.ts`.
2. **Serverless Port Bypass**: Inside `/server.ts`, the traditional `.listen()` call is completely omitted when running under Vercel:
   ```typescript
   if (!process.env.VERCEL) {
     app.listen(PORT, "0.0.0.0", () => {
       console.log(`Live on port ${PORT}`);
     });
   }
   ```
3. To deploy, simply import your GitHub repository into your Vercel Dashboard, add `GEMINI_API_KEY` to your environment settings, and hit **Deploy**!

---

## 🛠️ Technologies & Dependencies Built-In

This project relies on robust, battle-tested modern tools:

- **Client Runtime**: React 18 with Vite, fast type checking with TypeScript, and client-side data caching using standard `localStorage` serialization.
- **Micro-Animations**: `motion/react` utilizing custom transition curves, subtle scale hover state micro-actions, and exit/entrance state lifecycles to guarantee visual fluidity.
- **Component Icons**: Premium vector illustrations imported natively from `lucide-react`.
- **Server Mechanics**: Node.js, Express, and native path resolution.
- **AI Core**: Modern `@google/genai` TypeScript SDK (utilizing advanced model mappings, alternating conversation managers, and raw JSON schematized layouts).

---

## 💡 Practical Implementation Decisions

- **No Mock-Data Traps**: All data grids (trees planted, tasks achieved, history charts) rely on user actions, safely cached on the client side, to guarantee that the workspace remains a personal, highly real journal.
- **Strict Single-View Constraint**: The workspace layout centers around a unified, elegant responsive grid allowing instant navigation through side tabs without heavy page refreshes.
- **Beautiful Nordic Typography**: Implemented a deep Navy/Nord palette blended with spacious negative margins, styled with Inter for primary controls, and paired with JetBrains Mono for status counters to present a focused, editorial work atmosphere.

Designed and developed by Mohamed Saadawy. Experience focused deep work like never before! ⏱️🌲
