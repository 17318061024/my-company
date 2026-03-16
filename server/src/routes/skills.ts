import { Router, Request, Response } from 'express';
import { getAllSkills, saveSkill, AgentRole } from '../db/skillStore.js';

const router = Router();

// Get all skills
router.get('/', async (_req: Request, res: Response) => {
  try {
    const skills = await getAllSkills();
    res.json(skills);
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
});

// Update a skill
router.put('/:role', async (req: Request, res: Response) => {
  try {
    const { role } = req.params;
    const { content } = req.body;

    if (!['product_manager', 'developer', 'tester', 'ui'].includes(role)) {
      res.status(400).json({ error: 'Invalid role' });
      return;
    }

    const skill = await saveSkill(role as AgentRole, content);
    res.json(skill);
  } catch (error) {
    console.error('Error saving skill:', error);
    res.status(500).json({ error: 'Failed to save skill' });
  }
});

export { router as skillRouter };
