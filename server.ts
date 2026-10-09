import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

// Initialize Gemini SDK with User-Agent header for AI Studio telemetry
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const app = express();

// Accept up to 50MB payload for image base64
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Scan mess endpoint
app.post('/api/scan', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg' } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'Missing imageBase64 in request body' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        error: 'NO_KEY',
        message: 'No GEMINI_API_KEY configured on server. Switching to edge density fallback.',
      });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const prompt = `You are the vision analysis engine for Photo Quest. Analyze this photo of a room.
Be specific and useful, not cute. Identify the actual clutter visible. Return 3-5 monsters representing distinct clutter categories.
Bounding boxes must be tight around the actual clutter with normalized coordinates [ymin, xmin, ymax, xmax] between 0 and 1000.
Names should be grounded — 'Sock Cluster', 'Dish Mountain', 'Paperwork Pile', 'Desk Cable Tangle' — unless a playful name genuinely fits.
Commentary should be dry, adult, and insightful. Think 'witty honest friend', not 'cartoon mascot'. No exclamation marks.
Assign an overall mess_score between 10 and 95 (10 is very tidy, 95 is catastrophic clutter).
Pick a matching room_type.
For each monster, provide:
- name: grounded title
- label: exact items/clutter present
- task: concrete physical instruction to clear it
- minutes: estimated physical cleanup duration (2 to 15)
- xp: reward value (10 to 40)
- box: [ymin, xmin, ymax, xmax] coordinates from 0 to 1000
- shape: choose from ["horns", "ghost", "square", "spikes", "drip", "box", "tall"]
- color: distinct hex color like "#f43f5e", "#f59e0b", "#8b5cf6", "#06b6d4", "#10b981", "#ec4899", or "#e11d48"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: cleanBase64,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mess_score: { type: Type.INTEGER, description: 'Overall mess score 0 to 100' },
            room_type: {
              type: Type.STRING,
              enum: ['bedroom', 'kitchen', 'bathroom', 'living_room', 'office', 'other'],
            },
            summary: { type: Type.STRING, description: 'One declarative sentence describing the space' },
            commentary: { type: Type.STRING, description: 'Dry observation without exclamation marks' },
            monsters: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  label: { type: Type.STRING },
                  task: { type: Type.STRING },
                  minutes: { type: Type.INTEGER },
                  xp: { type: Type.INTEGER },
                  box: {
                    type: Type.ARRAY,
                    items: { type: Type.INTEGER },
                    description: '[ymin, xmin, ymax, xmax] 0-1000',
                  },
                  shape: {
                    type: Type.STRING,
                    enum: ['horns', 'ghost', 'square', 'spikes', 'drip', 'box', 'tall'],
                  },
                  color: { type: Type.STRING },
                },
                required: ['name', 'label', 'task', 'minutes', 'xp', 'box', 'shape', 'color'],
              },
            },
          },
          required: ['mess_score', 'room_type', 'summary', 'commentary', 'monsters'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      success: true,
      data: parsed,
      isFallback: false,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('Scan error:', errorMsg);
    return res.status(500).json({
      error: 'SCAN_FAILED',
      message: errorMsg,
      isFallback: true,
    });
  }
});

// Verify after-clean endpoint
app.post('/api/verify', async (req, res) => {
  try {
    const { beforeBase64, afterBase64, mimeType = 'image/jpeg', expectedRoomType } = req.body;

    if (!beforeBase64 || !afterBase64) {
      return res.status(400).json({ error: 'Both beforeBase64 and afterBase64 are required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        error: 'NO_KEY',
        message: 'No GEMINI_API_KEY configured. Switching to edge density fallback verification.',
      });
    }

    const cleanBefore = beforeBase64.replace(/^data:image\/\w+;base64,/, '');
    const cleanAfter = afterBase64.replace(/^data:image\/\w+;base64,/, '');

    const prompt = `Compare these two photos of the same room — the first image is BEFORE cleaning, the second image is AFTER cleaning.
Expected room type: ${expectedRoomType || 'household room'}.
Determine if the room is meaningfully cleaner. Be honest — a small superficial shift or identical angle without actual physical clutter cleared is NOT a pass.
The pass threshold is at least an 8% improvement.
1. Estimate mess_before (0 to 100).
2. Estimate mess_after (0 to 100).
3. Calculate improvement = mess_before - mess_after (can be negative if mess worsened).
4. If improvement >= 8, pass is true. Otherwise pass is false.
5. Provide commentary: a restrained, adult assessment of the work done. No exclamation marks.
6. Provide remaining: list of strings describing any remaining clutter items still visible.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          { inlineData: { mimeType, data: cleanBefore } },
          { inlineData: { mimeType, data: cleanAfter } },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            pass: { type: Type.BOOLEAN },
            mess_before: { type: Type.INTEGER },
            mess_after: { type: Type.INTEGER },
            improvement: { type: Type.INTEGER },
            commentary: { type: Type.STRING },
            remaining: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['pass', 'mess_before', 'mess_after', 'improvement', 'commentary', 'remaining'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      success: true,
      data: parsed,
      isFallback: false,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('Verify error:', errorMsg);
    return res.status(500).json({
      error: 'VERIFY_FAILED',
      message: errorMsg,
      isFallback: true,
    });
  }
});

// Mount Vite or static server
async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Photo Quest server active on http://0.0.0.0:${PORT} [${isProd ? 'production' : 'development'}]`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
