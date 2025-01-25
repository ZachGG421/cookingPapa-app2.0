const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    title: { type: String, required: true},
    image: { type: String, required: true},
    description: String,
    ingredients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient'}],
    instructions: [String],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null},
});

module.exports = mongoose.model('Recipe', recipeSchema);