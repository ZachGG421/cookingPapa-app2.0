const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// POST /api/users/save-recipe (Protected)
router.post('/save-recipe', protect, async (req, res) => {
  const { recipeId } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (!user.savedRecipes.includes(recipeId)) {
      user.savedRecipes.push(recipeId);
      await user.save();
    }

    res.json({ message: 'Recipe saved successfully' });
  } catch (error) {
    console.error("Save recipe error:", error);
    res.status(500).json({ error: 'Error saving recipe' });
  }
});

// GET /api/users/profile (Protected route)
router.get('/profile', protect, async (req, res) => {
  res.json(req.user);
});


module.exports = router;