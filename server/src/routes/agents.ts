import { Router, Request, Response } from 'express';
import { runPipeline, runProductManager, runDeveloper, runTester, runUI } from '../agents/orchestrator.js';
import { getSkill, AgentRole } from '../db/skillStore.js';

const router = Router();

// Run the full pipeline
router.post('/run', async (req: Request, res: Response) => {
  try {
    const { userRequest } = req.body;
    if (!userRequest) {
      res.status(400).json({ error: 'userRequest is required' });
      return;
    }

    const result = await runPipeline(userRequest);
    res.json(result);
  } catch (error) {
    console.error('Pipeline error:', error);
    res.status(500).json({ error: 'Pipeline execution failed' });
  }
});

// Run a specific agent
router.post('/run/:role', async (req: Request, res: Response) => {
  try {
    const { role } = req.params;
    const { input } = req.body;

    if (!['product_manager', 'developer', 'tester', 'ui'].includes(role)) {
      res.status(400).json({ error: 'Invalid role' });
      return;
    }

    let result;
    switch (role) {
      case 'product_manager':
        result = await runProductManager(input);
        break;
      case 'developer':
        result = await runDeveloper(input);
        break;
      case 'tester':
        result = await runTester(input, '');
        break;
      case 'ui':
        result = await runUI(input);
        break;
    }

    res.json(result);
  } catch (error) {
    console.error('Agent error:', error);
    res.status(500).json({ error: 'Agent execution failed' });
  }
});

// Get a specific skill
router.get('/:role', async (req: Request, res: Response) => {
  try {
    const { role } = req.params;
    if (!['product_manager', 'developer', 'tester', 'ui'].includes(role)) {
      res.status(400).json({ error: 'Invalid role' });
      return;
    }

    const skill = await getSkill(role as AgentRole);
    res.json(skill);
  } catch (error) {
    console.error('Error fetching skill:', error);
    res.status(500).json({ error: 'Failed to fetch skill' });
  }
});

export { router as agentRouter };
