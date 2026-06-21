import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT) || 3000;

// Helper to retrieve the API key from request headers or environment variables
function getApiKey(req?: express.Request): string | undefined {
  const headerKey = req?.headers ? (req.headers['x-gemini-api-key'] || req.headers['authorization']) : undefined;
  if (headerKey && typeof headerKey === 'string') {
    const trimmed = headerKey.replace(/^Bearer\s+/i, '').trim();
    if (trimmed) return trimmed;
  }
  return process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GOOGLE_GENAI_API_KEY;
}

// Instantiate fresh Gemini client for each request to support dynamic client api keys
function getAi(req?: express.Request): GoogleGenAI {
  const apiKey = getApiKey(req);
  if (!apiKey) {
    console.warn("WARNING: No valid Gemini API Key was found. AI features will fallback to helpful mockup responses.");
  }
  return new GoogleGenAI({
    apiKey: apiKey || "MOCK_KEY",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Parse Gemini SDK errors into clear, human-actionable guidance
function handleGeminiError(error: any): string {
  const msg = error?.message || "";
  console.error("Gemini Failure Logged:", error);
  if (msg.includes("API_KEY_INVALID") || msg.toLowerCase().includes("api key not valid") || msg.toLowerCase().includes("invalid api key")) {
    return "Your GEMINI_API_KEY appears to be invalid or deactivated. Please check that you provided the correct key.";
  }
  if (msg.toLowerCase().includes("quota") || msg.toLowerCase().includes("limit") || msg.toLowerCase().includes("exhausted") || msg.toLowerCase().includes("rate limit") || msg.toLowerCase().includes("429")) {
    return "Google Gemini API rate limit or quota exceeded. Please check your usage on Google AI Studio or try again in a few seconds.";
  }
  if (msg.toLowerCase().includes("not found") || msg.toLowerCase().includes("unsupported")) {
    return "The model specified is not supported or your API key does not have access. Please verify your GEMINI_API_KEY permissions.";
  }
  return error.message || "An unexpected error occurred during AI processing.";
}

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

// Basic health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", mode: process.env.NODE_ENV || "development" });
});

// 1. AI Chat Coach - Context-Aware Chat
app.post("/api/coach/chat", async (req, res) => {
  try {
    const { message, history, context } = req.body;
    
    if (!getApiKey(req)) {
      return res.json({
        text: `[Fallback Mock Response] Great job maintaining your streak! In this mock mode (missing API Key): you currently have ${context?.totalFocusMinutes || 0} minutes of focus, Level ${context?.level || 1}, and a focus score of 94/100. Let's conquer the next block!`
      });
    }

    const ai = getAi(req);
    
    // 1. Filter out the initial welcome seed message from model if it is the first message or has no preceding user message.
    // Ensure that history starts with "user" message and alternates roles strictly user-model-user...
    const formattedHistory: any[] = [];
    for (const h of history || []) {
      const role = h.sender === "user" ? "user" : "model";
      
      // Skip any initial "model" messages at the beginning of the history
      if (formattedHistory.length === 0 && role !== "user") {
        continue;
      }
      
      // Strict alternation pattern. If consecutive messages have the same role, 
      // merge their text so they don't break the rules.
      if (formattedHistory.length > 0 && formattedHistory[formattedHistory.length - 1].role === role) {
        formattedHistory[formattedHistory.length - 1].parts[0].text += "\n" + h.text;
      } else {
        formattedHistory.push({
          role,
          parts: [{ text: h.text }]
        });
      }
    }

    const systemPrompt = `You are an elite, highly empathetic, and direct AI productivity coach. Your goal is to guide students, developers, and professionals to attain deep focus and manage work using the Pomodoro technique. Unlike typical friendly helpers, you are structured, insight-driven, and focused on behavioral science.

Your dynamic core statistics and current user state context are as follows:
- Active streak: ${context?.streak || 0} days
- Level: ${context?.level || 1} (Total XP: ${context?.xp || 0})
- Focus score: ${context?.focusScore || 90}/100
- Today finished: ${context?.totalSessions || 0} Pomodoro sessions totaling ${context?.totalFocusMinutes || 0} minutes
- Current ongoing task name: "${context?.currentTaskTitle || "None Selected"}"
- Active projects count: ${context?.projectsCount || 0}

Please remember their actual productive streaks and state, make specific references to their levels, completed work, and focus score. If they are falling behind or have many interruptions, gently call it out yet provide highly actionable recommendations.
Keep response sizes around 150-250 words. Do not praise yourself and avoid over-excited exclamation marks.`;

    // Initialize chat session directly with history
    const chatInstance = ai.chats.create({
      model: "gemini-3.5-flash",
      history: formattedHistory,
      config: {
        systemInstruction: systemPrompt,
      }
    });

    const response = await chatInstance.sendMessage({ message: message });
    return res.json({ text: response.text });
  } catch (error: any) {
    return res.status(500).json({ error: handleGeminiError(error) });
  }
});

// 2. Study Planner - Generates a structured syllabus plan based on exam and duration
app.post("/api/coach/plan", async (req, res) => {
  try {
    const { examTopic, daysLeft, targetHoursPerDay } = req.body;

    if (!getApiKey(req)) {
      // Mock Fallback
      return res.json({
        tasks: [
          { title: "Define Syllabus core concepts", durationMinutes: 25, priority: "high", dayOffset: 1, subtasks: ["Review main topics list", "Gather reference slides"] },
          { title: "Syllabus detailed notes creation", durationMinutes: 50, priority: "high", dayOffset: 3, subtasks: ["Draft executive study cards", "Summarize high yield chapters"] },
          { title: "Self testing practice quiz", durationMinutes: 25, priority: "medium", dayOffset: 7, subtasks: ["Take mock diagnostic", "Identify key weaknesses"] },
          { title: "Final practice & flashcards", durationMinutes: 25, priority: "low", dayOffset: 12, subtasks: ["Space rep review", "Relaxation preview"] }
        ],
        advice: "Fallback Plan: Focus on active recall and prioritize highly tested concepts first. Rebuild this list in real-time once API keys are active!"
      });
    }

    const ai = getAi(req);
    const prompt = `Develop a structured study plan for a user studying the topic: "${examTopic}" with only ${daysLeft} days remaining. The target hours per day is set to ${targetHoursPerDay || 2} hours.
Generate a structured JSON list of milestone task study sessions that of sizes matching 25 or 50 minute pomodoro intervals, mapped out by a 'dayOffset' from today (from Day 1 to Day ${daysLeft}).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tasks: {
              type: Type.ARRAY,
              description: "List of actionable milestone study tasks to schedule.",
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "Clear, highly actionable task title." },
                  durationMinutes: { type: Type.INTEGER, description: "Interval duration (prefer 25 or 50 for Pomodoro)." },
                  priority: { type: Type.STRING, description: "Priority level: high, medium, or low." },
                  dayOffset: { type: Type.INTEGER, description: "Day number to perform this task (e.g., 2 for Day 2 of study plan)." },
                  subtasks: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "3-4 micro steps to execute this task successfully."
                  }
                },
                required: ["title", "durationMinutes", "priority", "dayOffset", "subtasks"]
              }
            },
            advice: { type: Type.STRING, description: "Two-sentence expert strategy to pass this specific study track." }
          },
          required: ["tasks", "advice"]
        }
      }
    });

    const output = JSON.parse(response.text || "{}");
    return res.json(output);
  } catch (error: any) {
    return res.status(500).json({ error: handleGeminiError(error) });
  }
});

// 3. Task Breakdown - Divides bigger tasks into clean checklists
app.post("/api/coach/breakdown", async (req, res) => {
  try {
    const { taskTitle } = req.body;

    if (!getApiKey(req)) {
      return res.json({
        subtasks: [
          `Information retrieval for ${taskTitle}`,
          `Draft core outline summary`,
          `Create practice cards / flashcards`,
          `Validate with quick quizzes`
        ]
      });
    }

    const ai = getAi(req);
    const prompt = `Generate a granular checklist of 4-5 steps to accomplish the complex task: "${taskTitle}". Make them high-impact, actionable, and suitable for checking off in a Pomodoro interval. Return JSON list.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subtasks: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "A sequence of micro-tasks that break down the parent task."
            }
          },
          required: ["subtasks"]
        }
      }
    });

    const output = JSON.parse(response.text || "{}");
    return res.json(output);
  } catch (error: any) {
    return res.status(500).json({ error: handleGeminiError(error) });
  }
});

// 4. Schedule Optimizer & Productivity Checker
app.post("/api/coach/optimize", async (req, res) => {
  try {
    const { tasks, focusHoursHistory, currentFocusScore } = req.body;

    if (!getApiKey(req)) {
      return res.json({
        optimizedSequence: (tasks || []).map((t: any) => t.id),
        insight: "Optimal Schedule: Complete high priority items when your energy levels spike. Balance breaks properly!"
      });
    }

    const ai = getAi(req);
    const taskString = (tasks || []).map((t: any) => `ID:${t.id} - Title:${t.title} [Priority: ${t.priority}, Est.Pomos: ${t.estimatedPomodoros}]`).join("\n");
    const prompt = `Analyze the current productivity log and task list to optimize order and maximize flow state:
Tasks list:
${taskString}

Focus History summary: ${JSON.stringify(focusHoursHistory || {})}
Current Focus Score: ${currentFocusScore || 90}/100

Find high leverage adjustments. Sort the list, giving the ID array sequence in return. Include brief explanation.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            optimizedSequence: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Sorted tasks IDs order for highest performance priority."
            },
            insight: { type: Type.STRING, description: "A two-sentence reasoning explaining why this order is highly effective." }
          },
          required: ["optimizedSequence", "insight"]
        }
      }
    });

    const output = JSON.parse(response.text || "{}");
    return res.json(output);
  } catch (error: any) {
    return res.status(500).json({ error: handleGeminiError(error) });
  }
});

// -------------------------------------------------------------
// Vite and Production Serving Middleware Setup
// -------------------------------------------------------------
async function startServer() {
  if (process.env.VERCEL) {
    // On Vercel, the platform serves static frontend assets directly and routes /api endpoints.
    // We skip mounting Vite or local static file paths to avoid runtime asset reference crashes.
    return;
  }

  if (process.env.NODE_ENV !== "production") {
    // Development Mode
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production Mode
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Pomodoro server boot complete! Listening on http://localhost:${PORT}`);
  });
}

startServer();

export default app;
