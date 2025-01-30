const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },
    likedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe'}],
    savedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe'}],

});

module.exports = mongoose.model('User', userSchema);