import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { skillRouter } from './routes/skills.js';
import { agentRouter } from './routes/agents.js';
import { seedDefaultSkills } from './db/skillStore.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/skills', skillRouter);
app.use('/api/agents', agentRouter);

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Initialize and start server
async function start() {
  try {
    await seedDefaultSkills();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
