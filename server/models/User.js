const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },
    likedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'recipe'}],
    savedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'recipe'}],

});

module.exports = mongoose.modal('User', userSchema);