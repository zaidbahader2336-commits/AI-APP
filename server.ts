import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialization of Gemini SDK to prevent startup crash if key is missing
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment secret is not configured. Please add it via the Settings > Secrets panel.");
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

// 1. Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is online and healthy." });
});

// 2. Core Blueprint generation endpoint (Calls real Gemini API)
app.post("/api/generate", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt || !prompt.trim()) {
    return res.status(400).json({ error: "No prompt query provided." });
  }

  try {
    const ai = getGeminiClient();
    
    const sysInstruction = `
    You are the Buildcraft AI Engine, a high-fidelity application synthesizer.
    Given a user's prompt, you must design a complete visual layout, tech stack, database rows, security audit checklist, and preview widgets specifically styled and content-tailored to represent the application described in the prompt.
    
    If the user requests Urdu, Hinglish, or any specific language, accommodate it.
    
    You MUST respond with valid JSON matching EXACTLY the interface:
    {
      "title": string (A clean, elegant, concise name for the app),
      "techStack": string[] (tech stack terms like React, Tailwind, Gemini API, Recharts, SQLite, etc.),
      "previewHeaderTitle": string (uppercase header for phone layout, e.g. "VAULT APP"),
      "previewWidgets": Array of widgets to render on the phone preview. Supported widget objects:
        - Chart Widget:
          { "type": "chart", "title": string, "metricValue": string, "metricLabel": string, "lineData": [{"label": string, "value": number, "y": number}], "metrics": [{"label": string, "value": string}] }
        - Metrics Widget:
          { "type": "metrics", "metrics": [{"label": string, "value": string, "color": "emerald" | "orange" | "teal"}] }
        - List Widget:
          { "type": "list", "title": string, "items": [{"title": string, "category": string, "value": string, "status": "passed" | "warning" | "scanning"}] }
        - Button Widget:
          { "type": "action_button", "label": string, "messageOnSelect": string }
      "sampleUsers": Array of database rows matching:
        {"id": number, "name": string, "email": string, "profile_picture_url": string, "role": "Developer"|"Admin"|"User"|"Product"|"Manager", "created_at": string}
      "sampleProducts": Array of database rows matching:
        {"id": string, "title": string, "sku": string, "price": string, "category": string}
      "sampleOrders": Array of database rows matching:
        {"id": string, "user_id": string, "date": string, "total": string, "status": string}
      "securityChecks": Array of security checklist matching:
        {"id": string, "name": string, "status": "passed"|"warning"|"scanning", "message": string, "category": string}
      "activeCode": string (A professional mockup content for App.tsx summarizing the app, fully written)
    }
    
    Double-check options: No placeholders, no missing values, and output ONLY valid parsed JSON. Ensure numbers are valid.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Generate a gorgeous application setup JSON for: "${prompt}"`,
      config: {
        systemInstruction: sysInstruction,
        responseMimeType: "application/json"
      }
    });

    const rawText = response.text || "";
    console.log("Raw Gemini Generate Response:", rawText);

    let parsedJson;
    try {
      parsedJson = JSON.parse(rawText.trim());
    } catch (parseError: any) {
      console.error("Failed to parse Gemini Generate JSON:", parseError);
      return res.status(500).json({
        error: "Failed to parse system generation response as JSON.",
        details: parseError.message || "Invalid JSON formatting from Gemini."
      });
    }

    return res.json(parsedJson);

  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    return res.status(500).json({ 
      error: error.message || "Failed to generate blueprint.",
      details: "Ensure your GEMINI_API_KEY is configured in Settings > Secrets."
    });
  }
});

// 3. Workspace interactive update endpoint (Chat updates)
app.post("/api/chat-message", async (req, res) => {
  const { message, currentState } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ error: "No message query provided." });
  }

  try {
    const ai = getGeminiClient();

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `
      Current Application Workspace Config State (JSON):
      ${JSON.stringify(currentState, null, 2)}
      
      User Interactive Command: "${message}"
      
      Analyze the user state. Execute updates to the layout, widgets, data, checklist, or activeCode based on this instruction.
      If they want to append components, edit code, update schemas, or alter databases, do so.
      
      You MUST respond with valid JSON matching EXACTLY the interface:
      {
        "aiResponseMessage": string (A highly personalized response explaining what you changed, in professional, conversational, helpful Urdu or English as requested. If user asks in Urdu, reply in Urdu!),
        "updatedTitle": string (New title if updated, otherwise previous),
        "updatedWidgets": Array of preview widgets (modified if request targets widgets, otherwise previous),
        "updatedUsers": Array of users (modified if request targets schemas/users, otherwise previous),
        "updatedProducts": Array of products (modified if request asks to add products/items, otherwise previous),
        "updatedOrders": Array of orders (modified if request asks to add orders, otherwise previous),
        "updatedSecurityChecks": Array of security checks (modified if request targets security/WAF, otherwise previous),
        "updatedCode": string (Modified React/Tailwind source code snippet or explanation if target requested, otherwise previous)
      }
      
      Output ONLY valid JSON.
      `,
      config: {
        responseMimeType: "application/json"
      }
    });

    const rawText = response.text || "";
    console.log("Raw Gemini Chat Response:", rawText);

    let parsedJson;
    try {
      parsedJson = JSON.parse(rawText.trim());
    } catch (parseError: any) {
      console.error("Failed to parse Gemini Chat JSON:", parseError);
      return res.status(500).json({
        error: "Failed to parse system interactive responses as JSON.",
        details: parseError.message || "Invalid JSON formatting from Gemini."
      });
    }

    return res.json(parsedJson);

  } catch (error: any) {
    console.error("Gemini Workspace Interaction Error:", error);
    return res.status(500).json({ 
      error: error.message || "Failed to update workspace.",
      details: "Ensure your GEMINI_API_KEY is configured in Settings > Secrets."
    });
  }
});

// Dual development / production static server serving Vite Spa framework
async function initServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development server linked via Express middleware.");
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log("Static file routing activated for Production bundle.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express dev server actively listening on prefix node http://localhost:${PORT}`);
  });
}

initServer();
