const express = require('express');
const User = require('../models/User');
const router = express.Router();

// save recipe
router.post('/:userId/save-recipe', async (req, res) => {
    const { userId } = req.params;
    const { recipeId } = req.body;

    try {
        const user = await User.findById(userId);
        user.savedRecipes.push(recipeId);
        await user.save();

        res.json({ message: 'Recipe saved successfully' });
    }catch (error) {
        res.status(500).json({ error: 'Error saving recipe' });
    }
});

module.exports = router;