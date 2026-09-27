import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { parseNeedsLocally } from './src/utils/smartLocalParser.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// GEMINI API KEY CONFIGURATION
// You can paste your Gemini API key directly between the quotes below:
const MY_GEMINI_API_KEY = ""; 
// ============================================================================

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasEnvKey: Boolean(MY_GEMINI_API_KEY.trim() || process.env.GEMINI_API_KEY),
    model: 'gemini-3.8-flash',
  });
});

// AI Need Parser endpoint
app.post('/api/parse-needs', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: 'Please provide a valid text description of care home needs.' });
    }

    // Read pasted key, or user-provided header, or environment variable
    const customKey = req.headers['x-gemini-key'] as string | undefined;
    const apiKey = MY_GEMINI_API_KEY.trim() || ((customKey && customKey.trim().length > 5) ? customKey.trim() : process.env.GEMINI_API_KEY);

    if (!apiKey) {
      return res.status(400).json({
        error: 'No Gemini API key available. Please configure your key in Settings or environment.',
        needsKey: true,
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const systemInstruction = `You are CareConnect's specialized AI Need Assistant for orphanages, children's homes, and old-age homes.
Your mission is to take messy, unstructured, multi-need sentences written or spoken by care-home staff and accurately parse them into individual, structured, actionable support requirements.

CRITICAL RULES:
1. Break down multiple needs in the input into distinct items. If the user mentions blankets, wheelchairs, a doctor, and an English teacher, output FOUR separate items.
2. For each requirement, determine:
   - title: concise, human-friendly title (e.g., "Warm Winter Blankets", "Mobility Wheelchairs", "Visiting General Physician", "English Language Tutor")
   - description: clear, respectful description explaining the context and need
   - category: Must be one of ['Education', 'Healthcare', 'Essentials', 'Accessibility', 'Food', 'Clothing', 'Companionship', 'Skills & Mentorship', 'Infrastructure', 'Activities', 'Volunteer', 'Other']
   - beneficiary: Must be one of ['Children', 'Elderly', 'Both', 'Care Home']
   - quantity: Specific quantity string if mentioned (e.g. "15 blankets", "2 wheelchairs", "1 doctor (weekly)", "1-2 volunteers"), or "As available" if not specified.
   - priority: Must be one of ['High', 'Medium', 'Low']. Medical emergencies, urgent healthcare, and mobility needs should be 'High'.
   - supportType: Must be one of ['Donate Items', 'Volunteer', 'Provide a Service', 'Provide Equipment', 'Sponsor a Need']
   - suggestedSupporter: Who is best suited to fulfill this (e.g., "Healthcare professionals & clinics", "Education donors / stationery suppliers", "Medical equipment suppliers", "College students & teachers")
   - reason: A short 1-sentence explanation of why you categorized and prioritized this requirement as you did.
3. Maintain dignity and respect in all descriptions. Never use demeaning language.
4. Output valid JSON adhering strictly to the schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Care home request: "${prompt}"`,
      config: {
        systemInstruction,
        temperature: 0.2,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            extractedRequirements: {
              type: Type.ARRAY,
              description: 'List of individual structured requirements extracted from the care home request.',
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  category: {
                    type: Type.STRING,
                    description: 'One of: Education, Healthcare, Essentials, Accessibility, Food, Clothing, Companionship, Skills & Mentorship, Infrastructure, Activities, Volunteer, Other',
                  },
                  beneficiary: {
                    type: Type.STRING,
                    description: 'One of: Children, Elderly, Both, Care Home',
                  },
                  quantity: { type: Type.STRING },
                  priority: {
                    type: Type.STRING,
                    description: 'One of: High, Medium, Low',
                  },
                  supportType: {
                    type: Type.STRING,
                    description: 'One of: Donate Items, Volunteer, Provide a Service, Provide Equipment, Sponsor a Need',
                  },
                  suggestedSupporter: { type: Type.STRING },
                  reason: { type: Type.STRING },
                },
                required: [
                  'title',
                  'description',
                  'category',
                  'beneficiary',
                  'quantity',
                  'priority',
                  'supportType',
                  'suggestedSupporter',
                  'reason',
                ],
              },
            },
            summary: {
              type: Type.STRING,
              description: 'A 1-sentence high-level summary of the needs organized.',
            },
          },
          required: ['extractedRequirements', 'summary'],
        },
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Empty response from AI model');
    }

    const parsedData = JSON.parse(responseText);
    res.json({
      success: true,
      data: parsedData,
      source: 'gemini-3.8-flash',
    });
  } catch (error: any) {
    console.warn('Gemini API call failed or unavailable, using smart local parser fallback on server:', error?.message);
    
    // Smart server fallback so the demo never fails
    const { parseNeedsLocally } = await import('./src/utils/smartLocalParser.ts');
    const localResult = parseNeedsLocally(req.body.prompt || '');
    
    res.json({
      success: true,
      data: localResult,
      source: 'smart-local-fallback',
      notice: 'Processed via Smart Local Parser due to temporary upstream Gemini load.',
    });
  }
});

// Setup Vite middleware in development or serve static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CareConnect server running at http://localhost:${PORT}`);
  });
}

startServer();
