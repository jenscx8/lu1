import express from 'express';
import { Admin } from '../model.js';

const router = express.Router();

// create admin
router.post('/create', async (req, res) => {
  const { userName, password } = req.body;

  try {
    const newAdmin = await Admin.create({ userName, password });
    res.json(newAdmin);
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ error: 'Failed to create admin' });
  }
});
// edit admin

// delete admin

export default router;
