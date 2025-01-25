const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
});

module.exports = mongoose.model('Ingredient', ingredientSchema);

