---
title: PomoAI
emoji: ⏱️
colorFrom: indigo
colorTo: blue
sdk: docker
app_port: 7860
---

# PomoAI ⏱️

A visually stunning, high-performance Pomodoro Timer application with smart task tracking.

## Getting Started

### Prerequisites

- Node.js (v20 or higher)
- npm

### Installation & Run

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

4. Start production server:
   ```bash
   npm run start
   ```

## Deploying to Hugging Face Spaces

This project is configured to run fully in a Docker container on Hugging Face Spaces.

### Step 1: Change Space SDK to Docker
In your Hugging Face Space, make sure your metadata contains `sdk: docker` and runs on `app_port: 7860` (this is automatically handled if this `README.md` is pushed to your Space!).

### Step 2: Push code to Hugging Face
You can push directly to Hugging Face from your computer:
1. Get your **Write Token** from Hugging Face: **Settings** -> **Access Tokens**.
2. Add your Hugging Face Space as a git remote:
   ```bash
   git remote add hf https://huggingface.co/spaces/MohamedSaadawy/PomoAI
   ```
3. Push your code:
   ```bash
   git push -f hf main
   ```
