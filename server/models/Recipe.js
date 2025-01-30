const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    apiId: { type: Number, required: true, unique: true },
    title: { type: String, required: true},
    image: { type: String, required: true},
    summary: { type: String },
    readyInMinutes: { type: Number },
    servings: { type: Number},
    sourceUrl: { type: String },
    vegetarian: { type: Boolean},
    vegan: { type: Boolean },
    glutenFree: { type: Boolean },
    dairyFree: { type: Boolean },
    veryHealthy: { type: Boolean },
    cheap: { type: Boolean },
    veryPopular: { type: Boolean },
    sustainable: { type: Boolean },
    aggregateLikes: { type: Number },
    healthScore: { type: Number },
    pricePerServing: { type: Number },
    extendedIngredients: [
        {
          id: { type: Number },
          name: { type: String },
          amount: { type: Number },
          unit: { type: String },
          original: { type: String },
        },
      ],
    ingredients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient'}],
    instructions: { type: String },
    dishTypes: [String],
    cuisines: [String],
    diets: [String],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null},
    source: { type: String, default: 'user' },
});

module.exports = mongoose.model('Recipe', recipeSchema);